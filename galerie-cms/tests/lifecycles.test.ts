import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import expositionLifecycles from '../src/api/exposition/content-types/exposition/lifecycles';
import messageContactLifecycles from '../src/api/message-contact/content-types/message-contact/lifecycles';
import artisteLifecycles from '../src/api/artiste/content-types/artiste/lifecycles';

describe('Exposition lifecycles', () => {
  it('generates slug from titre on create', () => {
    const event = { params: { data: { titre: 'Paysages de Provence' } as Record<string, unknown> } };
    expositionLifecycles.beforeCreate(event);
    assert.equal(event.params.data.slug, 'paysages-de-provence');
  });

  it('does not overwrite existing slug on create', () => {
    const event = { params: { data: { titre: 'Test', slug: 'custom-slug' } as Record<string, unknown> } };
    expositionLifecycles.beforeCreate(event);
    assert.equal(event.params.data.slug, 'custom-slug');
  });

  it('generates slug on update when titre changes and no slug provided', () => {
    const event = { params: { data: { titre: 'Nouveau Titre' } as Record<string, unknown> } };
    expositionLifecycles.beforeUpdate(event);
    assert.equal(event.params.data.slug, 'nouveau-titre');
  });

  it('does not generate slug on update when slug is already set', () => {
    const event = { params: { data: { titre: 'Test', slug: 'existing' } as Record<string, unknown> } };
    expositionLifecycles.beforeUpdate(event);
    assert.equal(event.params.data.slug, 'existing');
  });
});

describe('Artiste lifecycles', () => {
  it('generates slug from nom on create', () => {
    const event = { params: { data: { nom: 'Marcel Despierre' } as Record<string, unknown> } };
    artisteLifecycles.beforeCreate(event);
    assert.equal(event.params.data.slug, 'marcel-despierre');
  });
});

describe('MessageContact lifecycles', () => {
  it('sets dateEnvoi on create when not provided', () => {
    const event = { params: { data: {} as Record<string, unknown> } };
    const before = new Date().toISOString();
    messageContactLifecycles.beforeCreate(event);
    const after = new Date().toISOString();

    assert.ok(event.params.data.dateEnvoi, 'dateEnvoi should be set');
    const dateEnvoi = event.params.data.dateEnvoi as string;
    assert.ok(dateEnvoi >= before && dateEnvoi <= after, 'dateEnvoi should be current time');
  });

  it('does not overwrite existing dateEnvoi', () => {
    const existing = '2026-01-01T00:00:00.000Z';
    const event = { params: { data: { dateEnvoi: existing } as Record<string, unknown> } };
    messageContactLifecycles.beforeCreate(event);
    assert.equal(event.params.data.dateEnvoi, existing);
  });
});
