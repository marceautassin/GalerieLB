# Story 3.1: Pages Expositions (liste et fiche)

Status: ready-for-dev

## Story

As a visiteur,
I want parcourir les expositions de la galerie et consulter le détail de chacune,
so that je comprenne la ligne éditoriale de la galerie et les événements passés ou en cours.

## Acceptance Criteria

1. `/expositions` affiche les expositions séparées en "En cours" et "Passées"
2. Chaque exposition affiche titre, dates, visuel → cliquable vers `/expositions/[slug]`
3. La fiche exposition affiche : titre, dates, préface (rich text), visuels
4. La fiche affiche les oeuvres présentées (CarteOeuvre, liens vers fiches)
5. La fiche affiche les artistes déduits des oeuvres (liens vers fiches artistes)
6. Images optimisées, alt text, responsive
7. `fetchExpositions()` et `fetchExpositionBySlug()` dans strapi-client.ts, types dans strapi.ts

## Tasks / Subtasks

- [ ] Task 1 : Étendre le client API (AC: #7)
  - [ ] 1.1 Ajouter `fetchExpositions()` et `fetchExpositionBySlug(slug)` dans `strapi-client.ts`
  - [ ] 1.2 Compléter le type `Exposition` dans `strapi.ts` (titre, dateDebut, dateFin, preface, visuels, statut, slug, oeuvres)
- [ ] Task 2 : Créer CarteExposition.astro (AC: #2)
  - [ ] 2.1 Props : `exposition: Exposition`
  - [ ] 2.2 Visuel, titre, dates formatées, badge "En cours" si applicable
  - [ ] 2.3 Hover : légère élévation, lien englobant
- [ ] Task 3 : Page liste `/expositions/index.astro` (AC: #1, #6)
  - [ ] 3.1 Fetch toutes les expositions au build
  - [ ] 3.2 Séparer en deux sections : "En cours" (statut === 'en-cours') et "Passées"
  - [ ] 3.3 Grille de CarteExposition dans chaque section
- [ ] Task 4 : Page fiche `/expositions/[slug].astro` (AC: #3, #4, #5, #6)
  - [ ] 4.1 `getStaticPaths()` avec `fetchExpositions()`
  - [ ] 4.2 Afficher : titre, dates, préface (rich text), visuels
  - [ ] 4.3 Section "Oeuvres présentées" — grille de CarteOeuvre
  - [ ] 4.4 Section "Artistes" — déduits des oeuvres (extraire les artistes uniques des oeuvres associées)
  - [ ] 4.5 Breadcrumb : Expositions > Titre Exposition
  - [ ] 4.6 SeoHead dynamique

## Dev Notes

### Relation Exposition → Artistes — DÉDUITE AU BUILD

```typescript
// Dans /expositions/[slug].astro
const artistesUniques = [...new Map(
  exposition.oeuvres
    .map(o => o.artiste)
    .filter(Boolean)
    .map(a => [a.id, a])
).values()];
```

**NE JAMAIS créer de relation directe Exposition ↔ Artiste dans Strapi.**

### Prérequis

- Story 2.2 complétée (CarteOeuvre existe)
- Story 1.3 complétée (content type Exposition existe)
- Story 2.1 complétée (client API base)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Relation Expo↔Artiste déduite]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 3, Story 3.1]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
