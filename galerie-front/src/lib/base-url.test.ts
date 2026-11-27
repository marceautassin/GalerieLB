import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withBase } from './base-url.ts';

test('page : ajoute le / final', () => {
  assert.equal(withBase('/', '/oeuvres'), '/oeuvres/');
  assert.equal(withBase('/', '/oeuvres/mon-slug'), '/oeuvres/mon-slug/');
});

test('racine et chemin déjà terminé par /', () => {
  assert.equal(withBase('/', '/'), '/');
  assert.equal(withBase('/', '/oeuvres/'), '/oeuvres/');
});

test('requête : le / final se place avant le ?', () => {
  assert.equal(withBase('/', '/contact?exposition=foire'), '/contact/?exposition=foire');
  assert.equal(withBase('/', '/oeuvres?thematique=paysage'), '/oeuvres/?thematique=paysage');
  assert.equal(withBase('/', '/contact/?a=b'), '/contact/?a=b');
});

test('ancre : le / final se place avant le #', () => {
  assert.equal(withBase('/', '/a-propos#horaires'), '/a-propos/#horaires');
  assert.equal(withBase('/', '/a-propos?x=1#h'), '/a-propos/?x=1#h');
});

test('fichiers : laissés intacts', () => {
  assert.equal(withBase('/', '/llms.txt'), '/llms.txt');
  assert.equal(withBase('/', '/sitemap-index.xml'), '/sitemap-index.xml');
  assert.equal(withBase('/', '/logo.svg'), '/logo.svg');
  assert.equal(withBase('/', '/favicon.svg?v=2'), '/favicon.svg?v=2');
});

test('base de sous-chemin (GitHub Pages)', () => {
  assert.equal(withBase('/galerie/', '/'), '/galerie/');
  assert.equal(withBase('/galerie', '/oeuvres'), '/galerie/oeuvres/');
  assert.equal(withBase('/galerie/', '/logo.svg'), '/galerie/logo.svg');
});
