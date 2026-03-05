# Story 1.3: Modèle de données CMS — Expositions, Presse & À propos

Status: done

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

- [x] Task 1 : Créer le content type Exposition (AC: #1, #2)
  - [x] 1.1 Champs : `titre` (string, required), `dateDebut` (date, required), `dateFin` (date), `preface` (richtext), `visuels` (media, multiple), `statut` (enumeration: en-cours/passee), `slug` (uid, basé sur `titre`)
  - [x] 1.2 Relation Oeuvre ↔ Exposition : many-to-many
  - [x] 1.3 Vérifier le CRUD et les associations dans l'admin
- [x] Task 2 : Créer le content type ArticlePresse (AC: #3)
  - [x] 2.1 Champs : `titre` (string, required), `type` (enumeration: pdf/lien), `fichierPdf` (media, single, allowedTypes: files), `urlExterne` (string), `visuel` (media, single)
  - [x] 2.2 Vérifier le CRUD dans l'admin
- [x] Task 3 : Créer le content type MessageContact (AC: #4)
  - [x] 3.1 Champs : `nom` (string, required), `email` (email, required), `message` (text, required), `referenceOeuvre` (string), `referenceExposition` (string), `dateEnvoi` (datetime, default: now)
  - [x] 3.2 Vérifier la création depuis l'admin
- [x] Task 4 : Créer le single type APropos (AC: #5)
  - [x] 4.1 Champs : `biographieLouis` (richtext), `textePrixMarcus` (richtext), `adresse` (text), `horaires` (text)
  - [x] 4.2 Vérifier l'édition dans l'admin
- [x] Task 5 : Configurer les permissions API (AC: #6)
  - [x] 5.1 Rôle Public : autoriser uniquement `POST /api/messages-contact` (create)
  - [x] 5.2 Rôle Public : tout le reste en lecture interdite (pas de find/findOne publics)
  - [x] 5.3 Vérifier que le token API read-only (créé en 1.2) donne accès en lecture à toutes les collections
  - [x] 5.4 Tester : `POST /api/messages-contact` sans token → doit fonctionner
  - [x] 5.5 Tester : `GET /api/expositions` sans token → doit être refusé (403)
  - [x] 5.6 Tester : `GET /api/expositions` avec token → doit fonctionner
- [x] Task 6 : Données de test
  - [x] 6.1 Créer 2 expositions de test (1 en cours, 1 passée) avec oeuvres associées
  - [x] 6.2 Créer 2 articles presse (1 PDF, 1 lien externe)
  - [x] 6.3 Remplir le single type APropos avec du contenu placeholder
  - [x] 6.4 Tester la soumission d'un message contact via API

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

Claude Opus 4.6

### Debug Log References

- Le schéma APropos (singleType) nécessite un `pluralName` différent du `singularName`. Strapi v5 vérifie l'unicité de tous les noms (singular + plural) dans un tableau unique. Corrigé avec `pluralName: "a-propos-items"` au lieu de `"a-propos"`.
- Les fichiers `schema.ts` avec `export default` continuent de fonctionner correctement (pattern établi en Story 1.2).
- MessageContact utilise `draftAndPublish: false` car les messages ne sont pas du contenu publiable.
- Le lifecycle hook `beforeCreate` de MessageContact remplit `dateEnvoi` avec `new Date().toISOString()`.
- Nouveau token API custom `front-read-all` créé avec find/findOne sur tous les content types (le token existant de Story 1.2 n'avait pas les permissions pour les nouveaux types).

### Completion Notes List

- 4 content types créés : Exposition (collectionType), ArticlePresse (collectionType), MessageContact (collectionType), APropos (singleType)
- Relation bidirectionnelle Oeuvre ↔ Exposition (manyToMany) avec `inversedBy`/`mappedBy`
- Schema Oeuvre mis à jour pour inclure la relation inverse `expositions`
- Lifecycle hooks : Exposition (slug auto), MessageContact (dateEnvoi auto)
- Controllers, services et routes créés avec les factories Strapi v5
- Permissions API : Public = uniquement POST messages-contact ; Token = find/findOne sur toutes les collections
- 48 tests de validation de schéma (8 suites, dont les 22 tests de Story 1.2)
- Données de test : 2 expositions (en-cours + passée, avec oeuvres associées), 2 articles presse (pdf + lien), APropos rempli, messages contact testés
- Build Strapi validé et serveur fonctionnel

### File List

- `galerie-cms/src/api/exposition/content-types/exposition/schema.ts` (nouveau)
- `galerie-cms/src/api/exposition/content-types/exposition/lifecycles.ts` (nouveau)
- `galerie-cms/src/api/exposition/controllers/exposition.ts` (nouveau)
- `galerie-cms/src/api/exposition/services/exposition.ts` (nouveau)
- `galerie-cms/src/api/exposition/routes/exposition.ts` (nouveau)
- `galerie-cms/src/api/article-presse/content-types/article-presse/schema.ts` (nouveau)
- `galerie-cms/src/api/article-presse/controllers/article-presse.ts` (nouveau)
- `galerie-cms/src/api/article-presse/services/article-presse.ts` (nouveau)
- `galerie-cms/src/api/article-presse/routes/article-presse.ts` (nouveau)
- `galerie-cms/src/api/message-contact/content-types/message-contact/schema.ts` (nouveau)
- `galerie-cms/src/api/message-contact/content-types/message-contact/lifecycles.ts` (nouveau)
- `galerie-cms/src/api/message-contact/controllers/message-contact.ts` (nouveau)
- `galerie-cms/src/api/message-contact/services/message-contact.ts` (nouveau)
- `galerie-cms/src/api/message-contact/routes/message-contact.ts` (nouveau)
- `galerie-cms/src/api/a-propos/content-types/a-propos/schema.ts` (nouveau)
- `galerie-cms/src/api/a-propos/controllers/a-propos.ts` (nouveau)
- `galerie-cms/src/api/a-propos/services/a-propos.ts` (nouveau)
- `galerie-cms/src/api/a-propos/routes/a-propos.ts` (nouveau)
- `galerie-cms/src/api/oeuvre/content-types/oeuvre/schema.ts` (modifié — ajout relation expositions)
- `galerie-cms/src/lib/slugify.ts` (nouveau — review fix, DRY)
- `galerie-cms/tests/content-types.test.ts` (modifié — 26 nouveaux tests)
- `galerie-cms/tests/slugify.test.ts` (nouveau — review fix)
- `galerie-cms/tests/lifecycles.test.ts` (nouveau — review fix)
- `galerie-cms/types/generated/contentTypes.d.ts` (auto-généré par Strapi)

## Senior Developer Review (AI)

### Findings

| # | Sévérité | Description | Résolution |
|---|----------|-------------|------------|
| 1 | HIGH | Aucun test sur les lifecycle hooks (slug, dateEnvoi) | 7 tests lifecycle + 7 tests slugify créés |
| 2 | HIGH | `slugify()` dupliquée dans 4 fichiers lifecycle (DRY) | Extraite dans `src/lib/slugify.ts`, importée partout |
| 3 | MEDIUM | Permissions API volatiles (stockées en DB uniquement) | Documenté comme risque connu — standard Strapi, reconfigurer sur fresh deploy |
| 4 | MEDIUM | `contentTypes.d.ts` absent de la File List | File List mise à jour |
| 5 | MEDIUM | Dev Notes APropos schema obsolète (pluralName, collectionName) | Non modifié — Dev Notes sont des specs d'origine, les écarts sont documentés dans Debug Log |
| 6 | LOW | Endpoint public sans rate limiting / anti-spam | Explicitement différé post-MVP dans l'architecture |
| 7 | LOW | `slugify()` ne protège pas contre les résultats vides | Corrigé — fallback `'untitled'` ajouté |

### Issues ouvertes

- **MEDIUM #3** : Les permissions API (Public: POST messages-contact, Token: read-only) sont configurées dans la base Strapi, pas en code. Sur un fresh deploy, il faudra les reconfigurer manuellement. Envisager un script bootstrap en Story 6.1 (déploiement).

## Change Log

- 2026-03-05 : Création des content types Exposition, ArticlePresse, MessageContact (collectionTypes) et APropos (singleType). Relation manyToMany Oeuvre↔Exposition configurée. Permissions API : POST messages-contact public, lecture avec token pour tous les types. 48 tests de validation de schéma passent. Données de test créées.
- 2026-03-05 : Code review — 7 findings (2 HIGH, 3 MEDIUM, 2 LOW). Corrections : `slugify()` extraite dans `src/lib/` (DRY), 14 tests ajoutés (lifecycle + slugify), fallback slug vide, File List complétée. 62 tests passent.
