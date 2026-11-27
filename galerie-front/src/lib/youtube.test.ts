import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseYoutubeId,
  youtubeThumbnail,
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from './youtube.ts';

const ID = 'dQw4w9WgXcQ';

test('formats acceptés', async (t) => {
  const accepted: Record<string, string> = {
    'youtu.be': `https://youtu.be/${ID}`,
    'watch www': `https://www.youtube.com/watch?v=${ID}`,
    'watch m.': `https://m.youtube.com/watch?v=${ID}`,
    'watch sans préfixe': `https://youtube.com/watch?v=${ID}`,
    'watch http': `http://www.youtube.com/watch?v=${ID}`,
    shorts: `https://www.youtube.com/shorts/${ID}`,
    embed: `https://www.youtube.com/embed/${ID}`,
    live: `https://www.youtube.com/live/${ID}`,
    'nocookie embed': `https://www.youtube-nocookie.com/embed/${ID}`,
    'nocookie sans www': `https://youtube-nocookie.com/embed/${ID}`,
  };
  for (const [name, url] of Object.entries(accepted)) {
    await t.test(name, () => assert.equal(parseYoutubeId(url), ID));
  }
});

test('exemple réel avec ?si=', () => {
  assert.equal(parseYoutubeId('https://youtu.be/7A5fZwF773s?si=du5sTGVrPS7dlrBZ'), '7A5fZwF773s');
});

test('paramètres supplémentaires tolérés', () => {
  assert.equal(parseYoutubeId(`https://www.youtube.com/watch?v=${ID}&t=42s`), ID);
  assert.equal(parseYoutubeId(`https://www.youtube.com/watch?v=${ID}&list=PLabc123`), ID);
  assert.equal(parseYoutubeId(`https://www.youtube.com/watch?list=PLabc123&v=${ID}`), ID);
  assert.equal(parseYoutubeId(`https://www.youtube.com/shorts/${ID}?feature=share`), ID);
});

test('espaces autour tolérés', () => {
  assert.equal(parseYoutubeId(`  https://youtu.be/${ID}  `), ID);
  assert.equal(parseYoutubeId(`\n\thttps://youtu.be/${ID}\n`), ID);
});

test('null, undefined, vide, malformé → null', () => {
  assert.equal(parseYoutubeId(null), null);
  assert.equal(parseYoutubeId(undefined), null);
  assert.equal(parseYoutubeId(''), null);
  assert.equal(parseYoutubeId('   '), null);
  assert.equal(parseYoutubeId('pas une url'), null);
  assert.equal(parseYoutubeId(ID), null);
  assert.equal(parseYoutubeId('https://'), null);
});

test('autre domaine → null', () => {
  assert.equal(parseYoutubeId(`https://vimeo.com/${ID}`), null);
  assert.equal(parseYoutubeId(`https://example.com/watch?v=${ID}`), null);
});

test('domaines pièges → null', () => {
  assert.equal(parseYoutubeId(`https://evil.com/youtube.com/watch?v=${ID}`), null);
  assert.equal(parseYoutubeId(`https://evil.com/?u=https://youtu.be/${ID}`), null);
  assert.equal(parseYoutubeId(`https://youtube.com.evil.com/watch?v=${ID}`), null);
  assert.equal(parseYoutubeId(`https://notyoutube.com/watch?v=${ID}`), null);
  assert.equal(parseYoutubeId(`https://youtu.be.evil.com/${ID}`), null);
  assert.equal(parseYoutubeId(`https://user@evil.com/watch?v=${ID}`), null);
});

test('protocole non http(s) → null', () => {
  assert.equal(parseYoutubeId(`javascript://youtu.be/${ID}`), null);
  assert.equal(parseYoutubeId(`ftp://youtu.be/${ID}`), null);
});

test('id trop court ou trop long → null', () => {
  assert.equal(parseYoutubeId('https://youtu.be/abc'), null);
  assert.equal(parseYoutubeId(`https://youtu.be/${ID}x`), null);
  assert.equal(parseYoutubeId(`https://www.youtube.com/watch?v=${ID}x`), null);
  assert.equal(parseYoutubeId('https://www.youtube.com/watch?v=abc'), null);
  assert.equal(parseYoutubeId('https://www.youtube.com/shorts/abc'), null);
});

test('id avec caractères interdits → null', () => {
  assert.equal(parseYoutubeId('https://youtu.be/dQw4w9WgXc!'), null);
  assert.equal(parseYoutubeId('https://youtu.be/dQw4w9WgXc.'), null);
});

test('chemins non vidéo → null', () => {
  assert.equal(parseYoutubeId('https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv'), null);
  assert.equal(parseYoutubeId('https://www.youtube.com/@galerie'), null);
  assert.equal(parseYoutubeId('https://www.youtube.com/'), null);
  assert.equal(parseYoutubeId('https://youtu.be/'), null);
  assert.equal(parseYoutubeId('https://www.youtube.com/embed/'), null);
});

test('youtube.com/watch sans v → null', () => {
  assert.equal(parseYoutubeId('https://www.youtube.com/watch'), null);
  assert.equal(parseYoutubeId('https://www.youtube.com/watch?list=PLabc123'), null);
  assert.equal(parseYoutubeId('https://www.youtube.com/watch?v='), null);
});

test('helpers', () => {
  assert.equal(youtubeThumbnail(ID), `https://i.ytimg.com/vi/${ID}/hqdefault.jpg`);
  assert.equal(youtubeEmbedUrl(ID), `https://www.youtube-nocookie.com/embed/${ID}`);
  assert.equal(youtubeWatchUrl(ID), `https://www.youtube.com/watch?v=${ID}`);
});
