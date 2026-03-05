import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import artisteSchema from '../src/api/artiste/content-types/artiste/schema';
import oeuvreSchema from '../src/api/oeuvre/content-types/oeuvre/schema';
import thematiqueSchema from '../src/api/thematique/content-types/thematique/schema';
import expositionSchema from '../src/api/exposition/content-types/exposition/schema';
import articlePresseSchema from '../src/api/article-presse/content-types/article-presse/schema';
import messageContactSchema from '../src/api/message-contact/content-types/message-contact/schema';
import aProposSchema from '../src/api/a-propos/content-types/a-propos/schema';

// --- Helpers ---

function assertCollectionType(
  schema: Record<string, unknown>,
  expectedSingular: string,
  expectedPlural: string,
) {
  assert.equal(schema.kind, 'collectionType');
  const info = schema.info as Record<string, string>;
  assert.equal(info.singularName, expectedSingular);
  assert.equal(info.pluralName, expectedPlural);
}

function assertHasAttribute(
  schema: Record<string, unknown>,
  name: string,
  expectedType: string,
) {
  const attrs = schema.attributes as Record<string, Record<string, unknown>>;
  assert.ok(attrs[name], `Missing attribute: ${name}`);
  assert.equal(attrs[name].type, expectedType, `${name} should be type "${expectedType}"`);
}

function assertRelation(
  schema: Record<string, unknown>,
  name: string,
  expectedRelation: string,
  expectedTarget: string,
) {
  const attrs = schema.attributes as Record<string, Record<string, unknown>>;
  assert.ok(attrs[name], `Missing relation: ${name}`);
  assert.equal(attrs[name].type, 'relation');
  assert.equal(attrs[name].relation, expectedRelation, `${name} relation should be "${expectedRelation}"`);
  assert.equal(attrs[name].target, expectedTarget, `${name} target should be "${expectedTarget}"`);
}

// --- Artiste ---

describe('Artiste schema', () => {
  it('is a collectionType with correct naming', () => {
    assertCollectionType(artisteSchema, 'artiste', 'artistes');
    assert.equal(artisteSchema.collectionName, 'artistes');
  });

  it('has required nom field', () => {
    assertHasAttribute(artisteSchema, 'nom', 'string');
    const attrs = artisteSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.nom.required, true);
  });

  it('has biographie richtext field', () => {
    assertHasAttribute(artisteSchema, 'biographie', 'richtext');
  });

  it('has contexteArtistique richtext field', () => {
    assertHasAttribute(artisteSchema, 'contexteArtistique', 'richtext');
  });

  it('has photo media field (single image)', () => {
    assertHasAttribute(artisteSchema, 'photo', 'media');
    const attrs = artisteSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.photo.multiple, false);
    assert.deepEqual(attrs.photo.allowedTypes, ['images']);
  });

  it('has slug uid field targeting nom', () => {
    assertHasAttribute(artisteSchema, 'slug', 'uid');
    const attrs = artisteSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.slug.targetField, 'nom');
  });

  it('has oneToMany relation to oeuvres', () => {
    assertRelation(artisteSchema, 'oeuvres', 'oneToMany', 'api::oeuvre.oeuvre');
    const attrs = artisteSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.oeuvres.mappedBy, 'artiste');
  });

  it('has draftAndPublish enabled', () => {
    const options = artisteSchema.options as Record<string, boolean>;
    assert.equal(options.draftAndPublish, true);
  });
});

// --- Oeuvre ---

describe('Oeuvre schema', () => {
  it('is a collectionType with correct naming', () => {
    assertCollectionType(oeuvreSchema, 'oeuvre', 'oeuvres');
    assert.equal(oeuvreSchema.collectionName, 'oeuvres');
  });

  it('has required titre field', () => {
    assertHasAttribute(oeuvreSchema, 'titre', 'string');
    const attrs = oeuvreSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.titre.required, true);
  });

  it('has technique, dimensions, provenance fields', () => {
    assertHasAttribute(oeuvreSchema, 'technique', 'string');
    assertHasAttribute(oeuvreSchema, 'dimensions', 'string');
    assertHasAttribute(oeuvreSchema, 'provenance', 'text');
  });

  it('has visuels media field (multiple images)', () => {
    assertHasAttribute(oeuvreSchema, 'visuels', 'media');
    const attrs = oeuvreSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.visuels.multiple, true);
    assert.deepEqual(attrs.visuels.allowedTypes, ['images']);
  });

  it('has slug uid field targeting titre', () => {
    assertHasAttribute(oeuvreSchema, 'slug', 'uid');
    const attrs = oeuvreSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.slug.targetField, 'titre');
  });

  it('has manyToOne relation to artiste (inverse of oneToMany)', () => {
    assertRelation(oeuvreSchema, 'artiste', 'manyToOne', 'api::artiste.artiste');
    const attrs = oeuvreSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.artiste.inversedBy, 'oeuvres');
  });

  it('has manyToMany relation to thematiques', () => {
    assertRelation(oeuvreSchema, 'thematiques', 'manyToMany', 'api::thematique.thematique');
    const attrs = oeuvreSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.thematiques.inversedBy, 'oeuvres');
  });

  it('has manyToMany relation to expositions (inverse side)', () => {
    assertRelation(oeuvreSchema, 'expositions', 'manyToMany', 'api::exposition.exposition');
    const attrs = oeuvreSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.expositions.mappedBy, 'oeuvres');
  });
});

// --- Thematique ---

describe('Thematique schema', () => {
  it('is a collectionType with correct naming', () => {
    assertCollectionType(thematiqueSchema, 'thematique', 'thematiques');
    assert.equal(thematiqueSchema.collectionName, 'thematiques');
  });

  it('has required unique nom field', () => {
    assertHasAttribute(thematiqueSchema, 'nom', 'string');
    const attrs = thematiqueSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.nom.required, true);
    assert.equal(attrs.nom.unique, true);
  });

  it('has slug uid field targeting nom', () => {
    assertHasAttribute(thematiqueSchema, 'slug', 'uid');
    const attrs = thematiqueSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.slug.targetField, 'nom');
  });

  it('has manyToMany relation to oeuvres (inverse side)', () => {
    assertRelation(thematiqueSchema, 'oeuvres', 'manyToMany', 'api::oeuvre.oeuvre');
    const attrs = thematiqueSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.oeuvres.mappedBy, 'thematiques');
  });
});

// --- Cross-schema relation consistency ---

describe('Relation bidirectionality', () => {
  it('Artiste.oeuvres ↔ Oeuvre.artiste are properly linked', () => {
    const artisteAttrs = artisteSchema.attributes as Record<string, Record<string, unknown>>;
    const oeuvreAttrs = oeuvreSchema.attributes as Record<string, Record<string, unknown>>;

    assert.equal(artisteAttrs.oeuvres.mappedBy, 'artiste');
    assert.equal(oeuvreAttrs.artiste.inversedBy, 'oeuvres');
    assert.equal(artisteAttrs.oeuvres.target, 'api::oeuvre.oeuvre');
    assert.equal(oeuvreAttrs.artiste.target, 'api::artiste.artiste');
  });

  it('Oeuvre.thematiques ↔ Thematique.oeuvres are properly linked', () => {
    const oeuvreAttrs = oeuvreSchema.attributes as Record<string, Record<string, unknown>>;
    const thematiqueAttrs = thematiqueSchema.attributes as Record<string, Record<string, unknown>>;

    assert.equal(oeuvreAttrs.thematiques.inversedBy, 'oeuvres');
    assert.equal(thematiqueAttrs.oeuvres.mappedBy, 'thematiques');
    assert.equal(oeuvreAttrs.thematiques.target, 'api::thematique.thematique');
    assert.equal(thematiqueAttrs.oeuvres.target, 'api::oeuvre.oeuvre');
  });

  it('No direct Exposition-Artiste relation exists (architecture rule)', () => {
    const artisteAttrs = artisteSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(artisteAttrs.expositions, undefined, 'Artiste must NOT have expositions relation');
  });

  it('Exposition.oeuvres ↔ Oeuvre.expositions are properly linked', () => {
    const expositionAttrs = expositionSchema.attributes as Record<string, Record<string, unknown>>;
    const oeuvreAttrs = oeuvreSchema.attributes as Record<string, Record<string, unknown>>;

    assert.equal(expositionAttrs.oeuvres.inversedBy, 'expositions');
    assert.equal(oeuvreAttrs.expositions.mappedBy, 'oeuvres');
    assert.equal(expositionAttrs.oeuvres.target, 'api::oeuvre.oeuvre');
    assert.equal(oeuvreAttrs.expositions.target, 'api::exposition.exposition');
  });
});

// --- Exposition ---

describe('Exposition schema', () => {
  it('is a collectionType with correct naming', () => {
    assertCollectionType(expositionSchema, 'exposition', 'expositions');
    assert.equal(expositionSchema.collectionName, 'expositions');
  });

  it('has required titre field', () => {
    assertHasAttribute(expositionSchema, 'titre', 'string');
    const attrs = expositionSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.titre.required, true);
  });

  it('has required dateDebut and optional dateFin', () => {
    assertHasAttribute(expositionSchema, 'dateDebut', 'date');
    assertHasAttribute(expositionSchema, 'dateFin', 'date');
    const attrs = expositionSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.dateDebut.required, true);
    assert.equal(attrs.dateFin.required, undefined);
  });

  it('has preface richtext field', () => {
    assertHasAttribute(expositionSchema, 'preface', 'richtext');
  });

  it('has visuels media field (multiple images)', () => {
    assertHasAttribute(expositionSchema, 'visuels', 'media');
    const attrs = expositionSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.visuels.multiple, true);
    assert.deepEqual(attrs.visuels.allowedTypes, ['images']);
  });

  it('has statut enumeration field with correct values', () => {
    assertHasAttribute(expositionSchema, 'statut', 'enumeration');
    const attrs = expositionSchema.attributes as Record<string, Record<string, unknown>>;
    assert.deepEqual(attrs.statut.enum, ['en-cours', 'passee']);
    assert.equal(attrs.statut.default, 'en-cours');
  });

  it('has slug uid field targeting titre', () => {
    assertHasAttribute(expositionSchema, 'slug', 'uid');
    const attrs = expositionSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.slug.targetField, 'titre');
  });

  it('has manyToMany relation to oeuvres', () => {
    assertRelation(expositionSchema, 'oeuvres', 'manyToMany', 'api::oeuvre.oeuvre');
    const attrs = expositionSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.oeuvres.inversedBy, 'expositions');
  });

  it('has draftAndPublish enabled', () => {
    const options = expositionSchema.options as Record<string, boolean>;
    assert.equal(options.draftAndPublish, true);
  });
});

// --- ArticlePresse ---

describe('ArticlePresse schema', () => {
  it('is a collectionType with correct naming', () => {
    assertCollectionType(articlePresseSchema, 'article-presse', 'articles-presse');
    assert.equal(articlePresseSchema.collectionName, 'articles-presse');
  });

  it('has required titre field', () => {
    assertHasAttribute(articlePresseSchema, 'titre', 'string');
    const attrs = articlePresseSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.titre.required, true);
  });

  it('has required type enumeration (pdf/lien)', () => {
    assertHasAttribute(articlePresseSchema, 'type', 'enumeration');
    const attrs = articlePresseSchema.attributes as Record<string, Record<string, unknown>>;
    assert.deepEqual(attrs.type.enum, ['pdf', 'lien']);
    assert.equal(attrs.type.required, true);
  });

  it('has fichierPdf media field (single file)', () => {
    assertHasAttribute(articlePresseSchema, 'fichierPdf', 'media');
    const attrs = articlePresseSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.fichierPdf.multiple, false);
    assert.deepEqual(attrs.fichierPdf.allowedTypes, ['files']);
  });

  it('has urlExterne string field', () => {
    assertHasAttribute(articlePresseSchema, 'urlExterne', 'string');
  });

  it('has visuel media field (single image)', () => {
    assertHasAttribute(articlePresseSchema, 'visuel', 'media');
    const attrs = articlePresseSchema.attributes as Record<string, Record<string, unknown>>;
    assert.equal(attrs.visuel.multiple, false);
    assert.deepEqual(attrs.visuel.allowedTypes, ['images']);
  });
});

// --- MessageContact ---

describe('MessageContact schema', () => {
  it('is a collectionType with correct naming', () => {
    assertCollectionType(messageContactSchema, 'message-contact', 'messages-contact');
    assert.equal(messageContactSchema.collectionName, 'messages-contact');
  });

  it('has required nom, email, message fields', () => {
    const attrs = messageContactSchema.attributes as Record<string, Record<string, unknown>>;
    assertHasAttribute(messageContactSchema, 'nom', 'string');
    assert.equal(attrs.nom.required, true);
    assertHasAttribute(messageContactSchema, 'email', 'email');
    assert.equal(attrs.email.required, true);
    assertHasAttribute(messageContactSchema, 'message', 'text');
    assert.equal(attrs.message.required, true);
  });

  it('has referenceOeuvre and referenceExposition string fields', () => {
    assertHasAttribute(messageContactSchema, 'referenceOeuvre', 'string');
    assertHasAttribute(messageContactSchema, 'referenceExposition', 'string');
  });

  it('has dateEnvoi datetime field', () => {
    assertHasAttribute(messageContactSchema, 'dateEnvoi', 'datetime');
  });

  it('has draftAndPublish disabled', () => {
    const options = messageContactSchema.options as Record<string, boolean>;
    assert.equal(options.draftAndPublish, false);
  });
});

// --- APropos (singleType) ---

describe('APropos schema', () => {
  it('is a singleType with correct naming', () => {
    assert.equal(aProposSchema.kind, 'singleType');
    const info = aProposSchema.info as Record<string, string>;
    assert.equal(info.singularName, 'a-propos');
    assert.equal(info.pluralName, 'a-propos-items');
    assert.equal(info.displayName, 'APropos');
  });

  it('has biographieLouis and textePrixMarcus richtext fields', () => {
    assertHasAttribute(aProposSchema, 'biographieLouis', 'richtext');
    assertHasAttribute(aProposSchema, 'textePrixMarcus', 'richtext');
  });

  it('has adresse and horaires text fields', () => {
    assertHasAttribute(aProposSchema, 'adresse', 'text');
    assertHasAttribute(aProposSchema, 'horaires', 'text');
  });

  it('has draftAndPublish enabled', () => {
    const options = aProposSchema.options as Record<string, boolean>;
    assert.equal(options.draftAndPublish, true);
  });
});
