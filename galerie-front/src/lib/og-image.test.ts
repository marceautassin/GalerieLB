import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ogImageSize } from './og-image.ts';

test('grande image : réduite à 1200 px, ratio conservé', () => {
  assert.deepEqual(ogImageSize({ width: 4000, height: 3000 }), { width: 1200, height: 900 });
});

test('image étroite : jamais agrandie', () => {
  assert.deepEqual(ogImageSize({ width: 800, height: 1000 }), { width: 800, height: 1000 });
});

test('image par défaut 1200×630 inchangée', () => {
  assert.deepEqual(ogImageSize({ width: 1200, height: 630 }), { width: 1200, height: 630 });
});

test('hauteur arrondie', () => {
  assert.deepEqual(ogImageSize({ width: 3001, height: 2000 }), { width: 1200, height: 800 });
});
