# Story 1.3: Modèle de données CMS — Expositions, Presse & À propos

Status: ready-for-dev

## Story

As a Louis (administrateur),
I want gérer les expositions, les articles presse et les informations de la galerie,
so that tout le contenu du site soit administrable.

## Acceptance Criteria

1. Exposition contient : titre, dates début/fin, préface (rich text), visuels, statut
2. La relation Oeuvre ↔ Exposition (many-to-many) est fonctionnelle
3. ArticlePresse contient : titre, type (PDF/lien), fichier PDF, URL externe, visuel
4. MessageContact contient : nom, email, message, oeuvre/expo de référence, date
5. Le single type APropos contient : biographie Louis, texte Prix Marcus, adresse, horaires
6. Les permissions API sont configurées : seul POST /api/messages-contact est public, tout le reste est verrouillé sauf en lecture avec token

## Tasks / Subtasks

- [ ] Task 1 : Créer le content type Exposition (AC: #1, #2)
  - [ ] 1.1 Champs : `titre` (string, required), `dateDebut` (date, required), `dateFin` (date), `preface` (richtext), `visuels` (media, multiple), `statut` (enumeration: en-cours/passee), `slug` (uid, basé sur `titre`)
  - [ ] 1.2 Relation Oeuvre ↔ Exposition : many-to-many
  - [ ] 1.3 Vérifier le CRUD et les associations dans l'admin
- [ ] Task 2 : Créer le content type ArticlePresse (AC: #3)
  - [ ] 2.1 Champs : `titre` (string, required), `type` (enumeration: pdf/lien), `fichierPdf` (media, single, allowedTypes: files), `urlExterne` (string), `visuel` (media, single)
  - [ ] 2.2 Vérifier le CRUD dans l'admin
- [ ] Task 3 : Créer le content type MessageContact (AC: #4)
  - [ ] 3.1 Champs : `nom` (string, required), `email` (email, required), `message` (text, required), `referenceOeuvre` (string), `referenceExposition` (string), `dateEnvoi` (datetime, default: now)
  - [ ] 3.2 Vérifier la création depuis l'admin
- [ ] Task 4 : Créer le single type APropos (AC: #5)
  - [ ] 4.1 Champs : `biographieLouis` (richtext), `textePrixMarcus` (richtext), `adresse` (text), `horaires` (text)
  - [ ] 4.2 Vérifier l'édition dans l'admin
- [ ] Task 5 : Configurer les permissions API (AC: #6)
  - [ ] 5.1 Rôle Public : autoriser uniquement `POST /api/messages-contact` (create)
  - [ ] 5.2 Rôle Public : tout le reste en lecture interdite (pas de find/findOne publics)
  - [ ] 5.3 Vérifier que le token API read-only (créé en 1.2) donne accès en lecture à toutes les collections
  - [ ] 5.4 Tester : `POST /api/messages-contact` sans token → doit fonctionner
  - [ ] 5.5 Tester : `GET /api/expositions` sans token → doit être refusé (403)
  - [ ] 5.6 Tester : `GET /api/expositions` avec token → doit fonctionner
- [ ] Task 6 : Données de test
  - [ ] 6.1 Créer 2 expositions de test (1 en cours, 1 passée) avec oeuvres associées
  - [ ] 6.2 Créer 2 articles presse (1 PDF, 1 lien externe)
  - [ ] 6.3 Remplir le single type APropos avec du contenu placeholder
  - [ ] 6.4 Tester la soumission d'un message contact via API

## Dev Notes

### Schéma Strapi — Exposition

```json
{
  "kind": "collectionType",
  "collectionName": "expositions",
  "info": {
    "singularName": "exposition",
    "pluralName": "expositions",
    "displayName": "Exposition"
  },
  "attributes": {
    "titre": { "type": "string", "required": true },
    "dateDebut": { "type": "date", "required": true },
    "dateFin": { "type": "date" },
    "preface": { "type": "richtext" },
    "visuels": { "type": "media", "multiple": true, "allowedTypes": ["images"] },
    "statut": { "type": "enumeration", "enum": ["en-cours", "passee"], "default": "en-cours" },
    "slug": { "type": "uid", "targetField": "titre" },
    "oeuvres": { "type": "relation", "relation": "manyToMany", "target": "api::oeuvre.oeuvre" }
  }
}
```

### Schéma Strapi — ArticlePresse

```json
{
  "kind": "collectionType",
  "collectionName": "articles-presse",
  "info": {
    "singularName": "article-presse",
    "pluralName": "articles-presse",
    "displayName": "ArticlePresse"
  },
  "attributes": {
    "titre": { "type": "string", "required": true },
    "type": { "type": "enumeration", "enum": ["pdf", "lien"], "required": true },
    "fichierPdf": { "type": "media", "multiple": false, "allowedTypes": ["files"] },
    "urlExterne": { "type": "string" },
    "visuel": { "type": "media", "multiple": false, "allowedTypes": ["images"] }
  }
}
```

### Schéma Strapi — MessageContact

```json
{
  "kind": "collectionType",
  "collectionName": "messages-contact",
  "info": {
    "singularName": "message-contact",
    "pluralName": "messages-contact",
    "displayName": "MessageContact"
  },
  "attributes": {
    "nom": { "type": "string", "required": true },
    "email": { "type": "email", "required": true },
    "message": { "type": "text", "required": true },
    "referenceOeuvre": { "type": "string" },
    "referenceExposition": { "type": "string" },
    "dateEnvoi": { "type": "datetime" }
  }
}
```

### Schéma Strapi — APropos (single type)

```json
{
  "kind": "singleType",
  "collectionName": "a-propos",
  "info": {
    "singularName": "a-propos",
    "pluralName": "a-propos",
    "displayName": "APropos"
  },
  "attributes": {
    "biographieLouis": { "type": "richtext" },
    "textePrixMarcus": { "type": "richtext" },
    "adresse": { "type": "text" },
    "horaires": { "type": "text" }
  }
}
```

### Permissions API — Configuration critique

| Endpoint | Public (sans token) | Token read-only |
|---|---|---|
| `POST /api/messages-contact` | **AUTORISÉ** (create uniquement) | AUTORISÉ |
| `GET /api/artistes` | INTERDIT | AUTORISÉ |
| `GET /api/oeuvres` | INTERDIT | AUTORISÉ |
| `GET /api/expositions` | INTERDIT | AUTORISÉ |
| `GET /api/thematiques` | INTERDIT | AUTORISÉ |
| `GET /api/articles-presse` | INTERDIT | AUTORISÉ |
| `GET /api/a-propos` | INTERDIT | AUTORISÉ |

Configuration dans Strapi admin : Settings → Roles → Public → cocher uniquement `create` sur MessageContact.

### Relation Exposition ↔ Artiste — RAPPEL

**NE PAS créer de relation directe.** Les artistes d'une exposition sont déduits au build Astro via les oeuvres associées.

### Lifecycle MessageContact

Le lifecycle hook pour l'envoi d'email Brevo (`src/api/message-contact/lifecycles.ts`) est hors scope de cette story. Il sera implémenté dans la Story 4.1 (Formulaire de contact).

### Prérequis

- Story 1.2 complétée (content types Artiste, Oeuvre, Thematique existent)
- Token API read-only créé dans Story 1.2

### Hors scope

- Lifecycle email Brevo sur MessageContact (Story 4.1)
- Pages front (Stories 2.x, 3.x)
- Client API front (Story 2.1)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Sections: Modèle de données, API REST, Permissions]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.3]
- [Source: _bmad-output/project-context.md — Anti-pattern: relation Expo↔Artiste, endpoint public]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
