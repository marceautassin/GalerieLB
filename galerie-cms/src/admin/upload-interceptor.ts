import imageCompression from 'browser-image-compression';

/**
 * Intercepts browser fetch to compress images client-side before Strapi upload.
 * Strapi v5 on Clever Cloud 1 Go RAM can't resize HD photos server-side without OOM,
 * so we shift the work to the content editor's browser.
 */

const MAX_SIZE_MB = 2;
const MAX_WIDTH_OR_HEIGHT = 2400;
const JPEG_QUALITY = 0.85;
const TINY_BYPASS_BYTES = 500 * 1024; // truly tiny files: skip re-encoding to avoid quality loss

const UPLOAD_PATH_PATTERN = /(^|\/)upload(\/|\?|$)/;
const IMAGE_MIME_PATTERN = /^image\//;
const HEIC_MIME_PATTERN = /^image\/(heic|heif)$/i;
const HEIC_NAME_PATTERN = /\.(heic|heif)$/i;

interface ToastHandle {
  close: () => void;
  update: (message: string) => void;
}

let activeToasts = 0;

function showToast(message: string): ToastHandle {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  const offset = 24 + activeToasts * 56;
  activeToasts += 1;
  el.style.cssText = [
    'position:fixed',
    `bottom:${offset}px`,
    'right:24px',
    'background:#1a1a1a',
    'color:#fff',
    'padding:12px 18px',
    'border-radius:4px',
    'font-family:system-ui,sans-serif',
    'font-size:14px',
    'z-index:99999',
    'box-shadow:0 4px 12px rgba(0,0,0,0.15)',
    'max-width:360px',
  ].join(';');
  el.textContent = message;
  document.body.appendChild(el);
  let closed = false;
  return {
    update: (msg) => {
      el.textContent = msg;
    },
    close: () => {
      if (closed) return;
      closed = true;
      activeToasts = Math.max(0, activeToasts - 1);
      if (el.parentNode) el.parentNode.removeChild(el);
    },
  };
}

async function importHeic2any(): Promise<(options: { blob: Blob; toType?: string; quality?: number }) => Promise<Blob | Blob[]>> {
  const mod = (await import('heic2any')) as unknown as {
    default?: (options: { blob: Blob; toType?: string; quality?: number }) => Promise<Blob | Blob[]>;
  };
  const fn = mod.default ?? (mod as unknown as (options: { blob: Blob; toType?: string; quality?: number }) => Promise<Blob | Blob[]>);
  if (typeof fn !== 'function') throw new Error('heic2any: default export introuvable');
  return fn;
}

async function convertHeicIfNeeded(file: File): Promise<File> {
  const isHeic = HEIC_MIME_PATTERN.test(file.type) || HEIC_NAME_PATTERN.test(file.name);
  if (!isHeic) return file;
  const heic2any = await importHeic2any();
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: JPEG_QUALITY });
  const blob = Array.isArray(result) ? result[0] : result;
  const newName = file.name.replace(HEIC_NAME_PATTERN, '.jpg');
  return new File([blob], newName, { type: 'image/jpeg', lastModified: file.lastModified });
}

async function compressFile(file: File): Promise<File> {
  const prepared = await convertHeicIfNeeded(file);
  const wasConverted = prepared !== file;
  // Bypass only truly tiny files that couldn't reasonably exceed the dimension cap.
  // HEIC-converted files always go through compression to enforce the 2400 px cap,
  // since HEIC gives no dimension info pre-decode.
  if (!wasConverted && prepared.size <= TINY_BYPASS_BYTES) return prepared;
  if (!IMAGE_MIME_PATTERN.test(prepared.type)) return prepared;
  const preserveAlpha = prepared.type === 'image/png';
  return imageCompression(prepared, {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
    useWebWorker: true,
    initialQuality: JPEG_QUALITY,
    fileType: preserveAlpha ? 'image/png' : 'image/jpeg',
  });
}

function isTargetImage(value: FormDataEntryValue): value is File {
  if (!(value instanceof File)) return false;
  if (IMAGE_MIME_PATTERN.test(value.type)) return true;
  if (HEIC_NAME_PATTERN.test(value.name)) return true;
  return false;
}

async function compressFormData(form: FormData): Promise<FormData | null> {
  // Single pass: preserve original insertion order so Strapi's files[i] ↔ fileInfo[i] pairing stays intact.
  const allEntries: Array<[string, FormDataEntryValue]> = [];
  let imageCount = 0;
  form.forEach((value, key) => {
    allEntries.push([key, value]);
    if (isTargetImage(value)) imageCount += 1;
  });
  if (imageCount === 0) return null;

  const toast = showToast(imageCount > 1 ? `Optimisation de ${imageCount} images…` : 'Optimisation de l’image…');
  const output = new FormData();
  let processed = 0;
  try {
    for (const [key, value] of allEntries) {
      if (!isTargetImage(value)) {
        output.append(key, value);
        continue;
      }
      processed += 1;
      if (imageCount > 1) toast.update(`Optimisation ${processed}/${imageCount}…`);
      try {
        const compressed = await compressFile(value);
        output.append(key, compressed, compressed.name);
      } catch (err) {
        console.warn('[upload-interceptor] compression échouée, envoi de l\'original', value.name, err);
        output.append(key, value, value.name);
      }
    }
    return output;
  } finally {
    toast.close();
  }
}

function extractUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

function isUploadRequest(input: RequestInfo | URL, init: RequestInit | undefined): boolean {
  const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
  if (method !== 'POST') return false;
  return UPLOAD_PATH_PATTERN.test(extractUrl(input));
}

/**
 * Build a RequestInit that sends `body` cleanly:
 *  - strips any pinned Content-Type header (old multipart boundary is stale)
 *  - carries headers/credentials/signal/method from the original init
 */
function buildReplacementInit(init: RequestInit | undefined, body: FormData): RequestInit {
  const headers = new Headers(init?.headers ?? undefined);
  headers.delete('content-type');
  headers.delete('Content-Type');
  return { ...(init ?? {}), headers, body };
}

export function installUploadInterceptor(): void {
  if (typeof window === 'undefined') return;
  const w = window as Window & { __galerieUploadInterceptorInstalled?: boolean };
  if (w.__galerieUploadInterceptorInstalled) return;
  w.__galerieUploadInterceptorInstalled = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (!isUploadRequest(input, init)) return originalFetch(input, init);

    // Only intercept when we actually own a FormData body we can rewrite.
    const body = init?.body;
    if (!(body instanceof FormData)) return originalFetch(input, init);

    try {
      const compressed = await compressFormData(body);
      if (!compressed) return originalFetch(input, init);
      const url = extractUrl(input);
      return originalFetch(url, buildReplacementInit(init, compressed));
    } catch (err) {
      console.warn('[upload-interceptor] interception échouée, envoi original', err);
      return originalFetch(input, init);
    }
  };
}
