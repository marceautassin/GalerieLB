# Story 2.1: Client API Strapi et types TypeScript

Status: ready-for-dev

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

- [ ] Task 1 : Créer les types TypeScript (AC: #2, #4)
  - [ ] 1.1 Créer `src/types/strapi.ts`
  - [ ] 1.2 Interface `StrapiResponse<T>` pour le format `{ data: T[], meta }` et `StrapiSingleResponse<T>` pour `{ data: T, meta }`
  - [ ] 1.3 Interface `Artiste` : id, nom, biographie, contexteArtistique, photo (StrapiMedia), slug, oeuvres (Oeuvre[])
  - [ ] 1.4 Interface `Oeuvre` : id, titre, technique, dimensions, provenance, visuels (StrapiMedia[]), slug, artiste (Artiste), thematiques (Thematique[]), expositions (Exposition[])
  - [ ] 1.5 Interface `Thematique` : id, nom, slug
  - [ ] 1.6 Interface `StrapiMedia` : id, url, alternativeText, width, height, formats
  - [ ] 1.7 Interfaces préparatoires : `Exposition`, `ArticlePresse`, `APropos`, `MessageContact`
- [ ] Task 2 : Créer le client API (AC: #1, #3, #5)
  - [ ] 2.1 Créer `src/lib/strapi-client.ts`
  - [ ] 2.2 Fonction utilitaire `fetchStrapi<T>(endpoint, params?)` : construit l'URL, ajoute le token en header Authorization Bearer, parse JSON, type la réponse
  - [ ] 2.3 Si le fetch échoue ou retourne une erreur → `throw Error` avec message descriptif (fait échouer le build Astro)
  - [ ] 2.4 Lire `STRAPI_API_URL` et `STRAPI_API_TOKEN` depuis `import.meta.env`
  - [ ] 2.5 Implémenter les fonctions : `fetchArtistes()`, `fetchArtisteBySlug(slug)`, `fetchOeuvres()`, `fetchOeuvreBySlug(slug)`, `fetchThematiques()`
  - [ ] 2.6 Gérer le `populate` correctement pour inclure les relations et médias dans chaque requête
- [ ] Task 3 : Validation (AC: #1, #5)
  - [ ] 3.1 Tester chaque fonction avec Strapi local + données de test (créées en Story 1.2)
  - [ ] 3.2 Vérifier que le build échoue si Strapi est arrêté ou le token invalide
  - [ ] 3.3 Vérifier que les types correspondent aux données réelles de Strapi

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

### Debug Log References

### Completion Notes List

### File List
