# Story 1.2: Modèle de données CMS — Artistes & Oeuvres

Status: ready-for-dev

## Story

As a Louis (administrateur),
I want créer et gérer des artistes et des oeuvres dans le CMS,
so that je puisse constituer mon catalogue en ligne.

## Acceptance Criteria

1. Artiste contient : nom, biographie (rich text), contexte artistique (rich text), photo, slug
2. Oeuvre contient : titre, technique, dimensions, provenance, visuel(s), slug
3. La relation Artiste → Oeuvre (one-to-many) est fonctionnelle
4. Le content type Thematique est créé (nom, slug)
5. La relation Oeuvre ↔ Thematique (many-to-many) est fonctionnelle
6. Louis peut créer un artiste, lui associer des oeuvres et des thématiques depuis l'admin panel
7. Le provider S3 est configuré pour l'upload des visuels

## Tasks / Subtasks

- [ ] Task 1 : Créer le content type Artiste (AC: #1)
  - [ ] 1.1 Créer le content type via Strapi Content-Type Builder ou `schema.json`
  - [ ] 1.2 Champs : `nom` (string, required), `biographie` (richtext), `contexteArtistique` (richtext), `photo` (media, single), `slug` (uid, basé sur `nom`)
  - [ ] 1.3 Vérifier que le CRUD fonctionne dans l'admin panel
- [ ] Task 2 : Créer le content type Oeuvre (AC: #2)
  - [ ] 2.1 Champs : `titre` (string, required), `technique` (string), `dimensions` (string), `provenance` (text), `visuels` (media, multiple), `slug` (uid, basé sur `titre`)
  - [ ] 2.2 Vérifier le CRUD dans l'admin panel
- [ ] Task 3 : Créer le content type Thematique (AC: #4)
  - [ ] 3.1 Champs : `nom` (string, required, unique), `slug` (uid, basé sur `nom`)
- [ ] Task 4 : Configurer les relations (AC: #3, #5)
  - [ ] 4.1 Relation Artiste → Oeuvre : one-to-many (un artiste a plusieurs oeuvres)
  - [ ] 4.2 Relation Oeuvre ↔ Thematique : many-to-many
  - [ ] 4.3 Tester les associations depuis l'admin (créer un artiste, lui ajouter des oeuvres, associer des thématiques)
- [ ] Task 5 : Configurer les permissions API (AC: #6)
  - [ ] 5.1 Vérifier que le provider S3 fonctionne (upload d'image via admin)
  - [ ] 5.2 Créer un API token read-only dans Strapi admin
  - [ ] 5.3 Tester les endpoints REST : `GET /api/artistes`, `GET /api/oeuvres`, `GET /api/thematiques` avec le token
  - [ ] 5.4 Vérifier que les réponses incluent les relations (populate)
- [ ] Task 6 : Données de test (AC: #6)
  - [ ] 6.1 Créer 2-3 artistes de test avec biographies
  - [ ] 6.2 Créer 4-5 oeuvres de test avec visuels (images placeholder)
  - [ ] 6.3 Créer 3-4 thématiques de test (ex: Paysage, Équestre, Nature morte)
  - [ ] 6.4 Associer les oeuvres aux artistes et thématiques

## Dev Notes

### Schéma Strapi — Artiste

```json
{
  "kind": "collectionType",
  "collectionName": "artistes",
  "info": {
    "singularName": "artiste",
    "pluralName": "artistes",
    "displayName": "Artiste"
  },
  "attributes": {
    "nom": { "type": "string", "required": true },
    "biographie": { "type": "richtext" },
    "contexteArtistique": { "type": "richtext" },
    "photo": { "type": "media", "multiple": false, "allowedTypes": ["images"] },
    "slug": { "type": "uid", "targetField": "nom" },
    "oeuvres": { "type": "relation", "relation": "oneToMany", "target": "api::oeuvre.oeuvre" }
  }
}
```

### Schéma Strapi — Oeuvre

```json
{
  "kind": "collectionType",
  "collectionName": "oeuvres",
  "info": {
    "singularName": "oeuvre",
    "pluralName": "oeuvres",
    "displayName": "Oeuvre"
  },
  "attributes": {
    "titre": { "type": "string", "required": true },
    "technique": { "type": "string" },
    "dimensions": { "type": "string" },
    "provenance": { "type": "text" },
    "visuels": { "type": "media", "multiple": true, "allowedTypes": ["images"] },
    "slug": { "type": "uid", "targetField": "titre" },
    "artiste": { "type": "relation", "relation": "manyToOne", "target": "api::artiste.artiste", "inversedBy": "oeuvres" },
    "thematiques": { "type": "relation", "relation": "manyToMany", "target": "api::thematique.thematique" }
  }
}
```

### Schéma Strapi — Thematique

```json
{
  "kind": "collectionType",
  "collectionName": "thematiques",
  "info": {
    "singularName": "thematique",
    "pluralName": "thematiques",
    "displayName": "Thematique"
  },
  "attributes": {
    "nom": { "type": "string", "required": true, "unique": true },
    "slug": { "type": "uid", "targetField": "nom" }
  }
}
```

### Relation Exposition ↔ Artiste — ATTENTION

**NE PAS créer de relation directe Exposition ↔ Artiste dans Strapi.** Cette relation est déduite au build Astro : récupérer les oeuvres d'une expo → en extraire les artistes. C'est une règle fondamentale du projet.

### Convention de nommage des champs

- camelCase pour tous les champs Strapi : `contexteArtistique`, `dateDebut`
- Les noms métier restent en français : `Artiste`, `Oeuvre`, `Thematique`
- Les endpoints REST sont au pluriel : `/api/artistes`, `/api/oeuvres`

### API — Format de réponse Strapi

Strapi v5 retourne le format natif `{ data, meta }`. NE PAS créer de wrapper custom.

Exemple de requête avec relations :
```
GET /api/artistes?populate[oeuvres][populate]=visuels
GET /api/oeuvres?populate=artiste,thematiques,visuels
```

### Provider S3

Le provider `@strapi/provider-upload-aws-s3` a été installé dans Story 1.1 et configuré dans `config/plugins.ts`. Vérifier que l'upload fonctionne correctement via l'admin panel.

### Prérequis

- Story 1.1 complétée (Strapi initialisé et fonctionnel)
- PostgreSQL local disponible
- Variables S3 configurées dans `.env`

### Hors scope

- Content types Exposition, ArticlePresse, MessageContact, APropos (Story 1.3)
- Relation Oeuvre ↔ Exposition (Story 1.3)
- Permissions API fines (POST messages-contact public — Story 1.3)
- Client API côté front (Story 2.1)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Sections: Modèle de données, API REST, Relations]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.2]
- [Source: _bmad-output/project-context.md — Anti-pattern: relation Expo↔Artiste]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
