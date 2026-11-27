import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aujourdhuiParis, statutExposition } from './exposition-statut.ts';

const expo = { dateDebut: '2026-10-13', dateFin: '2026-11-13' };

test('avant le début : à venir', () => {
  assert.equal(statutExposition(expo, '2026-10-12'), 'a-venir');
});

test('le jour de début est en cours', () => {
  assert.equal(statutExposition(expo, '2026-10-13'), 'en-cours');
});

test('pendant : en cours', () => {
  assert.equal(statutExposition(expo, '2026-10-30'), 'en-cours');
});

test('le jour de fin est encore en cours', () => {
  assert.equal(statutExposition(expo, '2026-11-13'), 'en-cours');
});

test('le lendemain de la fin : passée', () => {
  assert.equal(statutExposition(expo, '2026-11-14'), 'passee');
});

test('sans date de fin : en cours dès le début, jamais passée', () => {
  const ouverte = { dateDebut: '2026-10-13', dateFin: null };
  assert.equal(statutExposition(ouverte, '2026-10-12'), 'a-venir');
  assert.equal(statutExposition(ouverte, '2026-10-13'), 'en-cours');
  assert.equal(statutExposition(ouverte, '2030-01-01'), 'en-cours');
});

test('aujourdhuiParis suit le fuseau de Paris, pas UTC', () => {
  // 23h30 UTC le 13/11 = 00h30 le 14/11 à Paris (UTC+1 en hiver)
  assert.equal(aujourdhuiParis(new Date('2026-11-13T23:30:00Z')), '2026-11-14');
  assert.equal(aujourdhuiParis(new Date('2026-11-13T12:00:00Z')), '2026-11-13');
});

test('dates au format datetime : seule la date compte', () => {
  const dt = { dateDebut: '2026-10-13T00:00:00.000Z', dateFin: '2026-11-13T00:00:00.000Z' };
  assert.equal(statutExposition(dt, '2026-10-13'), 'en-cours');
  assert.equal(statutExposition(dt, '2026-11-13'), 'en-cours');
  assert.equal(statutExposition(dt, '2026-11-14'), 'passee');
});
