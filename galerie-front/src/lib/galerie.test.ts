import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GALERIE, adresseEnLigne, horairesEnLigne, horairesGalerie, lieuExposition, lignesAdresse, parseAdresseLibre } from './galerie.ts';

test('adresse de la galerie : rue puis code postal et ville', () => {
  assert.deepEqual(lignesAdresse(GALERIE.adresse), ['7, avenue Franklin Roosevelt', '75008 Paris']);
  assert.equal(adresseEnLigne(GALERIE.adresse), '7, avenue Franklin Roosevelt, 75008 Paris');
});

test('parseAdresseLibre : rue, code postal, ville', () => {
  assert.deepEqual(parseAdresseLibre('Île des Impressionnistes, 78400 Chatou'), {
    streetAddress: 'Île des Impressionnistes',
    postalCode: '78400',
    addressLocality: 'Chatou',
    addressCountry: 'FR',
  });
});

test('parseAdresseLibre : « France » final reconnu', () => {
  assert.deepEqual(parseAdresseLibre('7 rue X, 75008 Paris, France'), {
    streetAddress: '7 rue X',
    postalCode: '75008',
    addressLocality: 'Paris',
    addressCountry: 'FR',
  });
});

test('parseAdresseLibre : adresses étrangères, pays omis', () => {
  for (const a of [
    'Kunsthalle, 10115 Berlin, Allemagne',
    'MECC, 6229 GV Maastricht, Pays-Bas',
    'Tour & Taxis, 1000 Bruxelles, Belgique',
    '10115 Berlin, Deutschland',
  ]) {
    const r = parseAdresseLibre(a);
    assert.equal(r?.addressCountry, undefined, a);
    assert.equal(r?.postalCode, undefined, a);
    assert.equal(r?.streetAddress, a, a);
  }
});

test('parseAdresseLibre : saisie sur plusieurs lignes', () => {
  assert.deepEqual(parseAdresseLibre('12 rue de la Paix\n75002 Paris'), {
    streetAddress: '12 rue de la Paix',
    postalCode: '75002',
    addressLocality: 'Paris',
    addressCountry: 'FR',
  });
});

test('parseAdresseLibre : sans code postal, tout est dans la rue, sans pays', () => {
  assert.deepEqual(parseAdresseLibre('Quelque part'), { streetAddress: 'Quelque part' });
});

test('parseAdresseLibre : vide', () => {
  assert.equal(parseAdresseLibre('  '), undefined);
  assert.equal(parseAdresseLibre(null), undefined);
});

test('lieuExposition : vide = la galerie', () => {
  const lieu = lieuExposition({ lieu: null, adresseLieu: null });
  assert.equal(lieu.nom, 'Galerie Louis Barrand');
  assert.equal(lieu.horsLesMurs, false);
  assert.equal(lieu.adresse?.postalCode, '75008');
});

test('lieuExposition : lieu renseigné', () => {
  const lieu = lieuExposition({ lieu: 'Foire de Chatou', adresseLieu: 'Île des Impressionnistes, 78400 Chatou' });
  assert.equal(lieu.nom, 'Foire de Chatou');
  assert.equal(lieu.horsLesMurs, true);
  assert.equal(lieu.adresse?.addressLocality, 'Chatou');
});

test('horairesGalerie : CMS sinon « Sur rendez-vous »', () => {
  assert.equal(horairesGalerie(null), 'Sur rendez-vous');
  assert.equal(horairesGalerie({ horaires: '  ' }), 'Sur rendez-vous');
  assert.equal(horairesGalerie({ horaires: 'Mar-Sam 14h-19h' }), 'Mar-Sam 14h-19h');
});

test('horairesEnLigne : sauts de ligne en « ; », point final retiré', () => {
  assert.equal(horairesEnLigne({ horaires: 'Mar-Sam 14h-19h.\nDim sur rendez-vous.' }), 'Mar-Sam 14h-19h. ; Dim sur rendez-vous');
  assert.equal(horairesEnLigne(null), 'Sur rendez-vous');
});
