# Story 2.1: Client API Strapi et types TypeScript

Status: done

## Story

As a développeur,
I want un client API typé pour récupérer les données Strapi au build,
so that toutes les pages front puissent consommer les données du CMS de manière fiable.

## Acceptance Criteria

1. `src/lib/strapi-client.ts` expose des fonctions typées : `fetchArtistes()`, `fetchArtisteBySlug()`, `fetchOeuvres()`, `fetchOeuvreBySlug()`, `fetchThematiques()`
2. `src/types/strapi.ts` définit les interfaces TypeScript pour Artiste, Oeuvre, Thematique (alignées sur le schéma Strapi)
3. Le token API read-only est lu depuis `STRAPI_API_URL` et `STRAPI_API_TOKEN`
4. Aucun `any` n'est utilisé — toutes les réponses sont typées
5. Une erreur de fetch au build fait échouer le build (pas de page vide silencieuse)

## Tasks / Subtasks

- [x] Task 1 : Créer les types TypeScript (AC: #2, #4)
  - [x] 1.1 Créer `src/types/strapi.ts`
  - [x] 1.2 Interface `StrapiResponse<T>` pour le format `{ data: T[], meta }` et `StrapiSingleResponse<T>` pour `{ data: T, meta }`
  - [x] 1.3 Interface `Artiste` : id, nom, biographie, contexteArtistique, photo (StrapiMedia), slug, oeuvres (Oeuvre[])
  - [x] 1.4 Interface `Oeuvre` : id, titre, technique, dimensions, provenance, visuels (StrapiMedia[]), slug, artiste (Artiste), thematiques (Thematique[]), expositions (Exposition[])
  - [x] 1.5 Interface `Thematique` : id, nom, slug
  - [x] 1.6 Interface `StrapiMedia` : id, url, alternativeText, width, height, formats
  - [x] 1.7 Interfaces préparatoires : `Exposition`, `ArticlePresse`, `APropos`, `MessageContact`
- [x] Task 2 : Créer le client API (AC: #1, #3, #5)
  - [x] 2.1 Créer `src/lib/strapi-client.ts`
  - [x] 2.2 Fonction utilitaire `fetchStrapi<T>(endpoint, params?)` : construit l'URL, ajoute le token en header Authorization Bearer, parse JSON, type la réponse
  - [x] 2.3 Si le fetch échoue ou retourne une erreur → `throw Error` avec message descriptif (fait échouer le build Astro)
  - [x] 2.4 Lire `STRAPI_API_URL` et `STRAPI_API_TOKEN` depuis `import.meta.env`
  - [x] 2.5 Implémenter les fonctions : `fetchArtistes()`, `fetchArtisteBySlug(slug)`, `fetchOeuvres()`, `fetchOeuvreBySlug(slug)`, `fetchThematiques()`
  - [x] 2.6 Gérer le `populate` correctement pour inclure les relations et médias dans chaque requête
- [x] Task 3 : Validation (AC: #1, #5)
  - [x] 3.1 Tester chaque fonction avec Strapi local + données de test (créées en Story 1.2)
  - [x] 3.2 Vérifier que le build échoue si Strapi est arrêté ou le token invalide
  - [x] 3.3 Vérifier que les types correspondent aux données réelles de Strapi

## Dev Notes

### Architecture du client API

```typescript
// src/lib/strapi-client.ts

const STRAPI_API_URL = import.meta.env.STRAPI_API_URL;
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

async function fetchStrapi<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${STRAPI_API_URL}/api/${endpoint}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText} on ${endpoint}`);
  }

  return response.json();
}
```

### Populate — Exemples de requêtes

```typescript
// Artiste avec ses oeuvres et leurs visuels
fetchArtistes(): populate[oeuvres][populate]=visuels

// Oeuvre avec artiste, thématiques, visuels
fetchOeuvres(): populate=artiste,thematiques,visuels

// Oeuvre par slug avec toutes les relations
fetchOeuvreBySlug(slug): filters[slug][$eq]=slug&populate=artiste,thematiques,visuels,expositions
```

### Règles critiques

- **AUCUN `any`** — toutes les réponses Strapi doivent être typées
- **AUCUN fetch runtime** côté visiteur — ce client est utilisé UNIQUEMENT au build (dans le frontmatter Astro ou `getStaticPaths`)
- **Erreur = build fail** — jamais de page vide silencieuse
- Format de réponse Strapi natif `{ data, meta }` — PAS de wrapper custom
- Nommage : `fetchArtistes()`, `getOeuvreBySlug()` — mixte FR/EN naturel

### Strapi v5 — Différences avec v4

En Strapi v5, la structure de réponse a évolué. Les attributs sont directement sur l'objet data (pas de `.attributes` wrapper comme en v4). Vérifier la structure exacte avec les données de test.

### Prérequis

- Stories 1.2 et 1.3 complétées (tous les content types existent dans Strapi)
- Données de test créées dans Strapi
- Token API read-only créé

### Hors scope

- Fonctions pour Exposition, ArticlePresse, APropos (Story 3.x)
- Pages front (Stories 2.2+)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Sections: API REST, Client API, TypeScript]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 2, Story 2.1]
- [Source: _bmad-output/project-context.md — Règles TypeScript, anti-patterns]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Strapi v5 : les attributs sont directement sur l'objet data (pas de `.attributes` wrapper comme en v4). Confirmé via tests API live.
- `URLSearchParams.set()` encode les crochets `[]` ce qui casse la syntaxe populate Strapi. Résolu en passant la query string directement (pas d'objet params).
- Strapi v5 retourne `null` (pas `[]`) pour les champs media multiples sans fichiers et certaines relations vides. Normalisé via des fonctions `normalizeArtiste/Oeuvre/Thematique` qui garantissent des tableaux.
- Le token API `front-read-all` a été régénéré car l'ancien ne fonctionnait plus. Nouveau token mis à jour dans `.env`.
- Strapi v5 ajoute `documentId` (UUID) en plus de `id` (numérique) sur chaque entité. Ajouté aux interfaces.
- Le param `status=published` est nécessaire pour ne récupérer que les entrées publiées (Strapi v5 draft/publish).

### Completion Notes List

- `src/types/strapi.ts` : 8 interfaces métier (Artiste, Oeuvre, Thematique, Exposition, ArticlePresse, APropos, MessageContact, StrapiMedia) + wrappers (StrapiResponse, StrapiSingleResponse, StrapiMeta, StrapiMediaFormat)
- `src/lib/strapi-client.ts` : 5 fonctions typées (fetchArtistes, fetchArtisteBySlug, fetchOeuvres, fetchOeuvreBySlug, fetchThematiques) + utilitaire fetchStrapi<T> avec error handling
- Zéro `any` dans le code — toutes les réponses typées
- Validation intégration : 3 artistes, 5 oeuvres, 4 thématiques, bySlug fonctionnel
- Build fail confirmé quand Strapi est arrêté (exit code 1)
- Normaliseurs pour gérer les null Strapi (visuels, relations)

### File List

- `galerie-front/src/types/strapi.ts` (nouveau)
- `galerie-front/src/lib/strapi-client.ts` (nouveau)

## Senior Developer Review (AI)

### Findings

| # | Sévérité | Description | Résolution |
|---|----------|-------------|------------|
| 1 | HIGH | `fetchArtisteBySlug()` ne deep-populate pas `oeuvres.visuels` | Corrigé : `populate[oeuvres][populate][0]=visuels` |
| 2 | MEDIUM | Pagination pageSize=100 tronque sans warning | Ajout `warnIfTruncated()` sur toutes les fonctions list |
| 3 | MEDIUM | `.env` dans File List mais gitignored | Retiré du File List |
| 4 | LOW | `StrapiSingleResponse` défini mais non utilisé | Non corrigé — préparatoire pour Story 3.x (APropos) |
| 5 | LOW | Pas de `env.d.ts` pour typer les env vars | Non corrigé — Astro type déjà comme `string \| undefined` |

### Issues ouvertes

- **LOW #4** : `StrapiSingleResponse` sera utilisé en Story 3.x pour `fetchAPropos()`.
- **LOW #5** : Les env vars sont déjà typées `string | undefined` par Astro. Un `env.d.ts` est optionnel.

## Change Log

- 2026-03-05 : Création du client API Strapi typé et des interfaces TypeScript. 5 fonctions de fetch, 8 interfaces métier, zéro any. Validé avec Strapi local (3 artistes, 5 oeuvres, 4 thématiques). Build fail confirmé quand Strapi inaccessible.
- 2026-03-05 : Code review — 5 findings (1 HIGH, 2 MEDIUM, 2 LOW). Corrections : deep populate oeuvres.visuels sur fetchArtisteBySlug, warning pagination truncation, File List nettoyé. Build validé.
