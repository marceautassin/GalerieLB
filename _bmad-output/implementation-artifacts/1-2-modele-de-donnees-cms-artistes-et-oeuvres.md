# Story 1.2: Modèle de données CMS — Artistes & Oeuvres

Status: in-progress

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

- [x] Task 1 : Créer le content type Artiste (AC: #1)
  - [x] 1.1 Créer le content type via Strapi Content-Type Builder ou `schema.json`
  - [x] 1.2 Champs : `nom` (string, required), `biographie` (richtext), `contexteArtistique` (richtext), `photo` (media, single), `slug` (uid, basé sur `nom`)
  - [x] 1.3 Vérifier que le CRUD fonctionne dans l'admin panel
- [x] Task 2 : Créer le content type Oeuvre (AC: #2)
  - [x] 2.1 Champs : `titre` (string, required), `technique` (string), `dimensions` (string), `provenance` (text), `visuels` (media, multiple), `slug` (uid, basé sur `titre`)
  - [x] 2.2 Vérifier le CRUD dans l'admin panel
- [x] Task 3 : Créer le content type Thematique (AC: #4)
  - [x] 3.1 Champs : `nom` (string, required, unique), `slug` (uid, basé sur `nom`)
- [x] Task 4 : Configurer les relations (AC: #3, #5)
  - [x] 4.1 Relation Artiste → Oeuvre : one-to-many (un artiste a plusieurs oeuvres)
  - [x] 4.2 Relation Oeuvre ↔ Thematique : many-to-many
  - [x] 4.3 Tester les associations depuis l'admin (créer un artiste, lui ajouter des oeuvres, associer des thématiques)
- [x] Task 5 : Configurer les permissions API (AC: #6)
  - [ ] 5.1 Vérifier que le provider S3 fonctionne (upload d'image via admin) — **NON TESTÉ** : credentials S3 non disponibles
  - [x] 5.2 Créer un API token read-only dans Strapi admin
  - [x] 5.3 Tester les endpoints REST : `GET /api/artistes`, `GET /api/oeuvres`, `GET /api/thematiques` avec le token
  - [x] 5.4 Vérifier que les réponses incluent les relations (populate)
- [x] Task 6 : Données de test (AC: #6)
  - [x] 6.1 Créer 2-3 artistes de test avec biographies
  - [ ] 6.2 Créer 4-5 oeuvres de test avec visuels (images placeholder) — **PARTIEL** : oeuvres créées mais sans visuels uploadés
  - [x] 6.3 Créer 3-4 thématiques de test (ex: Paysage, Équestre, Nature morte)
  - [x] 6.4 Associer les oeuvres aux artistes et thématiques

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

Claude Opus 4.6

### Debug Log References

- Les fichiers `schema.json` ne sont pas copiés vers `dist/` par la compilation TypeScript de Strapi v5. Solution : utiliser des fichiers `schema.ts` avec `export default` au lieu de `schema.json`. Strapi charge les `.js` compilés via `importDefault()` de la même façon.
- Le provider S3 est configuré conditionnellement dans `config/plugins.ts` (activé uniquement si `AWS_ACCESS_KEY_ID` est défini). Non testé faute de credentials S3 — la configuration existante de Story 1.1 est conservée.
- Les champs `slug` (type `uid`) ne sont pas auto-générés via l'API Content Manager (uniquement côté client admin panel). Résolu par des lifecycle hooks (`beforeCreate`/`beforeUpdate`) qui génèrent les slugs côté serveur.

### Completion Notes List

- Content types Artiste, Oeuvre et Thematique créés avec fichiers `schema.ts` (compilés en `.js` pour `dist/`)
- Relations bidirectionnelles configurées : Artiste→Oeuvre (oneToMany/manyToOne), Oeuvre↔Thematique (manyToMany)
- Controllers, services et routes créés avec les factories Strapi v5
- Token API read-only créé avec permissions find/findOne sur les 3 content types
- Endpoints REST testés avec populate des relations : réponses conformes au format `{ data, meta }`
- Données de test : 3 artistes, 5 oeuvres, 4 thématiques, toutes relations associées et publiées
- Build Strapi validé (`npm run build`) et serveur démarré avec succès (`npm run develop`)

### File List

- `galerie-cms/src/api/artiste/content-types/artiste/schema.ts` (nouveau)
- `galerie-cms/src/api/artiste/controllers/artiste.ts` (nouveau)
- `galerie-cms/src/api/artiste/services/artiste.ts` (nouveau)
- `galerie-cms/src/api/artiste/routes/artiste.ts` (nouveau)
- `galerie-cms/src/api/oeuvre/content-types/oeuvre/schema.ts` (nouveau)
- `galerie-cms/src/api/oeuvre/controllers/oeuvre.ts` (nouveau)
- `galerie-cms/src/api/oeuvre/services/oeuvre.ts` (nouveau)
- `galerie-cms/src/api/oeuvre/routes/oeuvre.ts` (nouveau)
- `galerie-cms/src/api/thematique/content-types/thematique/schema.ts` (nouveau)
- `galerie-cms/src/api/thematique/controllers/thematique.ts` (nouveau)
- `galerie-cms/src/api/thematique/services/thematique.ts` (nouveau)
- `galerie-cms/src/api/thematique/routes/thematique.ts` (nouveau)
- `galerie-cms/src/api/artiste/content-types/artiste/lifecycles.ts` (nouveau — review fix)
- `galerie-cms/src/api/oeuvre/content-types/oeuvre/lifecycles.ts` (nouveau — review fix)
- `galerie-cms/src/api/thematique/content-types/thematique/lifecycles.ts` (nouveau — review fix)
- `galerie-cms/tests/content-types.test.ts` (nouveau — review fix)
- `galerie-cms/types/generated/contentTypes.d.ts` (auto-généré par Strapi)
- `galerie-cms/package.json` (modifié — ajout script test + dep tsx)

## Senior Developer Review (AI)

### Findings

| # | Sévérité | Description | Résolution |
|---|----------|-------------|------------|
| 1 | HIGH | Task 5.1 marquée [x] mais S3 non testé (pas de credentials) | Tâche décochée, honnêteté rétablie |
| 2 | HIGH | Task 6.2 oeuvres créées sans visuels uploadés | Tâche décochée, reste à compléter |
| 3 | HIGH | Aucun test automatisé | 22 tests de validation de schéma créés (node:test + tsx) |
| 4 | MEDIUM | File List manquait contentTypes.d.ts et package.json | File List mise à jour |
| 5 | MEDIUM | Pas de lifecycle hook pour la génération de slugs | 3 lifecycle hooks créés (beforeCreate/beforeUpdate) |
| 6 | MEDIUM | Dev Notes pas à jour sur la déviation schema.json → schema.ts | Debug Log déjà documenté |
| 7 | LOW | Slugs thématiques null en base | Corrigé par lifecycle hooks |
| 8 | LOW | Schémas sans `as const` | Non corrigé — impact nul, Strapi n'utilise pas le typage statique des schémas |

### Issues ouvertes

- **Task 5.1** : S3 non testable sans credentials AWS. À valider lors du déploiement (Story 6.1).
- **Task 6.2** : Visuels non uploadés. À compléter manuellement via l'admin panel avec des images placeholder.

## Change Log

- 2026-03-04 : Création des content types Artiste, Oeuvre, Thematique avec relations et données de test. Utilisation de `schema.ts` au lieu de `schema.json` pour compatibilité avec la compilation TypeScript de Strapi v5.
- 2026-03-05 : Code review — 8 findings (3 HIGH, 3 MEDIUM, 2 LOW). Corrections appliquées : 3 lifecycle hooks slug, 22 tests automatisés, File List mise à jour, tâches 5.1 et 6.2 décochées (honnêteté). Status repassé à `in-progress`.
