# Story 3.1: Pages Expositions (liste et fiche)

Status: done

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

- [x] Task 1 : Étendre le client API (AC: #7)
  - [x] 1.1 Ajouter `fetchExpositions()` et `fetchExpositionBySlug(slug)` dans `strapi-client.ts`
  - [x] 1.2 Compléter le type `Exposition` dans `strapi.ts` (titre, dateDebut, dateFin, preface, visuels, statut, slug, oeuvres)
- [x] Task 2 : Créer CarteExposition.astro (AC: #2)
  - [x] 2.1 Props : `exposition: Exposition`
  - [x] 2.2 Visuel, titre, dates formatées, badge "En cours" si applicable
  - [x] 2.3 Hover : légère élévation, lien englobant
- [x] Task 3 : Page liste `/expositions/index.astro` (AC: #1, #6)
  - [x] 3.1 Fetch toutes les expositions au build
  - [x] 3.2 Séparer en deux sections : "En cours" (statut === 'en-cours') et "Passées"
  - [x] 3.3 Grille de CarteExposition dans chaque section
- [x] Task 4 : Page fiche `/expositions/[slug].astro` (AC: #3, #4, #5, #6)
  - [x] 4.1 `getStaticPaths()` avec `fetchExpositions()`
  - [x] 4.2 Afficher : titre, dates, préface (rich text), visuels
  - [x] 4.3 Section "Oeuvres présentées" — grille de CarteOeuvre
  - [x] 4.4 Section "Artistes" — déduits des oeuvres (extraire les artistes uniques des oeuvres associées)
  - [x] 4.5 Breadcrumb : Expositions > Titre Exposition
  - [x] 4.6 SeoHead dynamique

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
Claude Opus 4.6

### Debug Log References

### Completion Notes List
- Type Exposition déjà complet dans strapi.ts (créé en Story 1.3)
- fetchExpositions() popule oeuvres avec visuels+artiste (deep populate) pour la fiche
- fetchExpositionBySlug() même populate pour les pages dynamiques
- normalizeExposition() cascade normalizeOeuvre() sur les oeuvres imbriquées
- CarteExposition : aspect-ratio 16/9, badge "En cours" positionné en absolu, dates formatées fr-FR
- Page liste : séparation en-cours/passées via filter sur statut enum
- Fiche expo : préface rendue en rich text (set:html), artistes déduits des oeuvres via Map pour unicité
- Build OK : 14 pages, 1.08s

### File List
- `src/lib/strapi-client.ts` — Ajout fetchExpositions, fetchExpositionBySlug, normalizeExposition
- `src/lib/format.ts` — Utilitaire formatDateFr partagé (review fix)
- `src/components/CarteExposition.astro` — Nouveau composant carte exposition
- `src/pages/expositions/index.astro` — Page liste expositions (en cours / passées)
- `src/pages/expositions/[slug].astro` — Page fiche exposition (détail, oeuvres, artistes déduits)

## Senior Developer Review (AI)

### Findings

| # | Sévérité | Description | Résolution |
|---|----------|-------------|------------|
| 1 | HIGH | AC #3 : seul le premier visuel affiché sur la fiche (visuels pluriel ignoré) | Corrigé — galerie multi-visuels sur [slug].astro |
| 2 | MEDIUM | DRY : formatDate dupliquée dans CarteExposition + [slug].astro | Corrigé — extrait dans src/lib/format.ts (formatDateFr) |
| 3 | MEDIUM | Accessibilité : alt text ignore alternativeText de Strapi | Corrigé — utilise visuel.alternativeText ?? titre |
| 4 | MEDIUM | Aucun test automatisé front-end | Non corrigé — hors scope review, à traiter dans une story dédiée |
| 5 | LOW | Strip HTML naïf pour meta description (regex fragile) | Non corrigé — risque faible (contenu CMS) |
| 6 | LOW | Over-fetching sur index.astro (deep populate inutile) | Non corrigé — impact build-time uniquement |

## Change Log

- 2026-03-05 : Implémentation pages expositions (liste + fiche). Build OK 14 pages.
- 2026-03-05 : Code review — 6 findings (1 HIGH, 3 MEDIUM, 2 LOW). Corrections : galerie multi-visuels, formatDateFr partagé, alternativeText pour alt. Status → done.
