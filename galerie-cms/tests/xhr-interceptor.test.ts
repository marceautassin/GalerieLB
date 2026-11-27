import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { installXhrInterceptor } from '../src/admin/xhr-interceptor';

const isUploadUrl = (url: string) => /(^|\/)upload(\/|\?|$)/.test(url);
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

function setup(rewrite: (form: FormData) => Promise<FormData | null>) {
  const sent: unknown[] = [];
  let realAborts = 0;
  const proto = {
    open() {},
    send(body: unknown) {
      sent.push(body);
    },
    abort() {
      realAborts += 1;
    },
  };
  installXhrInterceptor(proto as unknown as XMLHttpRequest, rewrite, isUploadUrl);

  const makeXhr = () => {
    const events: string[] = [];
    const xhr = Object.create(proto) as XMLHttpRequest;
    (xhr as unknown as { dispatchEvent: (e: Event) => boolean }).dispatchEvent = (e) => {
      events.push(e.type);
      return true;
    };
    return { xhr, events };
  };
  return { sent, makeXhr, realAborts: () => realAborts };
}

function formWithImage(): FormData {
  const form = new FormData();
  form.append('files', new File(['x'], 'a.jpg', { type: 'image/jpeg' }));
  return form;
}

describe('xhr-interceptor', () => {
  it('passes a non-upload request through unchanged', async () => {
    let rewrites = 0;
    const { sent, makeXhr } = setup(async () => (rewrites += 1, null));
    const { xhr } = makeXhr();
    const form = formWithImage();
    xhr.open('POST', '/content-manager/foo');
    xhr.send(form);
    assert.deepEqual(sent, [form]);
    assert.equal(rewrites, 0);
  });

  it('sends the rewritten body for an upload', async () => {
    const rewritten = formWithImage();
    const { sent, makeXhr } = setup(async () => rewritten);
    const { xhr } = makeXhr();
    xhr.open('POST', '/upload');
    xhr.send(formWithImage());
    assert.equal(sent.length, 0);
    await tick();
    assert.deepEqual(sent, [rewritten]);
  });

  it('fires abort + loadend and never sends when aborted during compression', async () => {
    let release!: (f: FormData) => void;
    const { sent, makeXhr, realAborts } = setup(() => new Promise((r) => (release = r)));
    const { xhr, events } = makeXhr();
    xhr.open('POST', '/upload');
    xhr.send(formWithImage());
    xhr.abort();
    assert.deepEqual(events, ['abort', 'loadend']);
    assert.equal(realAborts(), 0);
    release(formWithImage());
    await tick();
    assert.equal(sent.length, 0);
  });

  it('sends the original body when compression fails', async () => {
    const { sent, makeXhr } = setup(() => Promise.reject(new Error('boom')));
    const { xhr } = makeXhr();
    const form = formWithImage();
    xhr.open('POST', '/upload');
    xhr.send(form);
    await tick();
    assert.deepEqual(sent, [form]);
  });

  it('calls the real abort once the request is no longer pending', async () => {
    const { makeXhr, realAborts } = setup(async () => null);
    const { xhr } = makeXhr();
    xhr.open('POST', '/upload');
    xhr.send(formWithImage());
    await tick();
    xhr.abort();
    assert.equal(realAborts(), 1);
  });

  it('cancels a pending request when open() is called again', async () => {
    let release!: (f: FormData) => void;
    const { sent, makeXhr } = setup(() => new Promise((r) => (release = r)));
    const { xhr } = makeXhr();
    xhr.open('POST', '/upload');
    xhr.send(formWithImage());
    xhr.open('GET', '/other');
    release(formWithImage());
    await tick();
    assert.equal(sent.length, 0);
  });

  it('emits error + loadend when the real send throws', async () => {
    const throwing = {
      open() {},
      send() {
        throw new Error('InvalidStateError');
      },
      abort() {},
    };
    installXhrInterceptor(throwing as unknown as XMLHttpRequest, async () => null, isUploadUrl);
    const xhr = Object.create(throwing) as XMLHttpRequest;
    const events: string[] = [];
    (xhr as unknown as { dispatchEvent: (e: Event) => boolean }).dispatchEvent = (e) => (events.push(e.type), true);
    xhr.open('POST', '/upload');
    xhr.send(formWithImage());
    await tick();
    assert.deepEqual(events, ['error', 'loadend']);
  });
});
