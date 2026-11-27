import { test } from 'node:test';
import assert from 'node:assert/strict';
import { etatCartes, parseThematiques, thematiqueValide } from './filtre-thematique.ts';

test('parseThematiques : sépare par espace, ignore le vide', () => {
  assert.deepEqual(parseThematiques('paysage  portrait'), ['paysage', 'portrait']);
  assert.deepEqual(parseThematiques(''), []);
  assert.deepEqual(parseThematiques(undefined), []);
});

test('sans thématique active : tout est visible, span-2 toutes les 5 cartes', () => {
  const etats = etatCartes(Array.from({ length: 10 }, () => []), null);
  assert.ok(etats.every((e) => e.visible));
  assert.deepEqual(
    etats.map((e) => e.span2),
    [false, false, false, false, true, false, false, false, false, true],
  );
});

test('thématique active : seules les cartes correspondantes, rang recalculé', () => {
  const cartes = [['a'], ['b'], ['a'], ['a'], ['b'], ['a'], ['a']];
  const etats = etatCartes(cartes, 'a');
  assert.deepEqual(
    etats.map((e) => e.visible),
    [true, false, true, true, false, true, true],
  );
  // 5e carte visible = l'index 6
  assert.deepEqual(
    etats.map((e) => e.span2),
    [false, false, false, false, false, false, true],
  );
});

test('thématique inconnue : aucune carte visible', () => {
  const etats = etatCartes([['a'], ['b']], 'zzz');
  assert.ok(etats.every((e) => !e.visible && !e.span2));
});

test('thematiqueValide : slug connu conservé, inconnu ou absent = null', () => {
  const them = [{ slug: 'paysages' }, { slug: 'portraits' }];
  assert.equal(thematiqueValide('portraits', them), 'portraits');
  assert.equal(thematiqueValide('zzz', them), null);
  assert.equal(thematiqueValide(null, them), null);
  assert.equal(thematiqueValide('', them), null);
});
