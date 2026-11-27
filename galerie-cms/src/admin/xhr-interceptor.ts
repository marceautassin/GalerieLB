/**
 * Patches an XMLHttpRequest prototype so that matching multipart uploads are rewritten
 * (e.g. images compressed) before the real `send`. Strapi's media library uploads through XHR.
 *
 * While the rewrite runs, the real XHR is OPENED but not sent: per the XHR spec `abort()` then
 * fires no event, which would hang Strapi's upload pool. We therefore fire abort/loadend (and
 * error/loadend on a failing send) ourselves.
 */

export type FormDataRewriter = (form: FormData) => Promise<FormData | null>;

interface XhrMeta {
  method: string;
  url: string;
  aborted: boolean;
  pending: boolean;
}

type TrackedXhr = XMLHttpRequest & { __galerieUpload?: XhrMeta };

function emit(xhr: XMLHttpRequest, types: string[]): void {
  for (const type of types) xhr.dispatchEvent(new Event(type));
}

export function installXhrInterceptor(
  proto: XMLHttpRequest,
  rewrite: FormDataRewriter,
  isUploadUrl: (url: string) => boolean,
): void {
  const originalOpen = proto.open;
  const originalSend = proto.send;
  const originalAbort = proto.abort;

  const cancelPending = (meta: XhrMeta | undefined): boolean => {
    if (!meta?.pending) return false;
    meta.pending = false;
    meta.aborted = true;
    return true;
  };

  proto.open = function (this: TrackedXhr, method: string, url: string | URL, ...rest: unknown[]) {
    cancelPending(this.__galerieUpload);
    this.__galerieUpload = { method: method.toUpperCase(), url: String(url), aborted: false, pending: false };
    return (originalOpen as (...args: unknown[]) => void).call(this, method, url, ...rest);
  };

  proto.abort = function (this: TrackedXhr) {
    if (cancelPending(this.__galerieUpload)) {
      emit(this, ['abort', 'loadend']);
      return;
    }
    return originalAbort.call(this);
  };

  proto.send = function (this: TrackedXhr, body?: Document | XMLHttpRequestBodyInit | null) {
    const meta = this.__galerieUpload;
    const isUpload = meta && meta.method === 'POST' && isUploadUrl(meta.url);
    if (!meta || !isUpload || !(body instanceof FormData)) return originalSend.call(this, body);

    meta.pending = true;
    rewrite(body)
      .catch((err) => {
        console.warn('[upload-interceptor] interception XHR échouée, envoi original', err);
        return null;
      })
      .then((rewritten) => {
        if (meta.aborted || !meta.pending) return;
        meta.pending = false;
        try {
          originalSend.call(this, rewritten ?? body);
        } catch (err) {
          console.warn('[upload-interceptor] envoi XHR échoué', err);
          emit(this, ['error', 'loadend']);
        }
      });
  };
}
