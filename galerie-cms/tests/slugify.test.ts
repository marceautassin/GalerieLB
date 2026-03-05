import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { slugify } from '../src/lib/slugify';

describe('slugify', () => {
  it('converts basic text to slug', () => {
    assert.equal(slugify('Paysages de Provence'), 'paysages-de-provence');
  });

  it('strips accents and diacritics', () => {
    assert.equal(slugify('Rétrospective Despierre'), 'retrospective-despierre');
    assert.equal(slugify('À propos de l\'été'), 'a-propos-de-lete');
  });

  it('collapses multiple spaces and dashes', () => {
    assert.equal(slugify('hello   world'), 'hello-world');
    assert.equal(slugify('hello---world'), 'hello-world');
  });

  it('removes special characters', () => {
    assert.equal(slugify('Art & Culture (2026)'), 'art-culture-2026');
  });

  it('trims whitespace', () => {
    assert.equal(slugify('  hello  '), 'hello');
  });

  it('returns "untitled" for empty string', () => {
    assert.equal(slugify(''), 'untitled');
  });

  it('returns "untitled" for special-chars-only input', () => {
    assert.equal(slugify('@#$%^&*'), 'untitled');
  });
});
