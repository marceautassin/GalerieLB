# Story 4.3: Page d'accueil avec nouveautés

Status: done

## Story

As a visiteur,
I want voir les dernières acquisitions de la galerie dès la page d'accueil,
so that je découvre immédiatement les oeuvres récentes sans chercher.

## Acceptance Criteria

1. `/` affiche une section mettant en avant les dernières oeuvres (triées par date d'ajout CMS, 6-8 dernières)
2. Chaque oeuvre : visuel, titre, artiste (CarteOeuvre) — cliquable vers fiche
3. Texte d'introduction sobre sur la galerie
4. Mise en avant automatique (pas d'intervention de Louis)
5. Page responsive, images optimisées, design sobre

## Tasks / Subtasks

- [x] Task 1 : Mise à jour `/pages/index.astro` (AC: #1, #2, #3, #4, #5)
  - [x] 1.1 Fetch des oeuvres triées par `createdAt` desc, limit 8 via `fetchOeuvres()` avec params de tri
  - [x] 1.2 Section hero sobre : titre de la galerie, séparateur, phrase d'accroche (pas de hero immersif — direction B choisie)
  - [x] 1.3 Section "Dernières acquisitions" : grille de CarteOeuvre
  - [x] 1.4 Lien "Voir toutes les oeuvres" → `/oeuvres`
  - [x] 1.5 SeoHead avec title "Galerie Louis Barrand" et description
  - [x] 1.6 Schema.org `ArtGallery` — reporté à Story 5.1 (données structurées schema.org)
- [x] Task 2 : Ajouter le tri/limit au client API (AC: #4)
  - [x] 2.1 Paramètre `sort` et `pagination[limit]` dans `fetchOeuvres()`
  - [x] 2.2 Appel : `fetchOeuvres({ sort: 'createdAt:desc', limit: 8 })`

## Dev Notes

### Design accueil — Direction B (sobre)

Pas de hero immersif. La page d'accueil suit la direction choisie :
- Titre "Galerie Louis Barrand" en Abhaya Libre h1
- Séparateur fin
- Phrase d'accroche courte (une phrase max)
- Puis directement la section "Dernières acquisitions" en grille de CarteOeuvre

L'art parle de lui-même.

### Tri Strapi

```
GET /api/oeuvres?sort=createdAt:desc&pagination[limit]=8&populate=artiste,visuels
```

### Prérequis

- Story 2.2 complétée (CarteOeuvre existe)
- Story 2.1 complétée (client API)
- Story 1.4 complétée (LayoutPrincipal)

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Design Direction Decision (Accueil B sobre)]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 4, Story 4.3]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
Aucun problème rencontré.

### Completion Notes List
- **Task 2 (API sort/limit):** Ajout de paramètres optionnels `sort` et `limit` à `fetchOeuvres()`. Rétrocompatible — les appels existants sans params continuent de fonctionner avec `pageSize=100`.
- **Task 1 (Page d'accueil):** Refonte complète de `index.astro`. Hero sobre (h1 + séparateur fin + accroche), section "Dernières acquisitions" avec grille de 8 CarteOeuvre (4 colonnes desktop, 2 tablette, 1 mobile), bouton "Voir toutes les oeuvres". SeoHead avec title et description enrichie. Schema.org ArtGallery reporté à Story 5.1 comme indiqué.

### Change Log
- 2026-03-07 : Page d'accueil avec hero sobre et grille des dernières acquisitions, ajout sort/limit au client API
- 2026-03-07 : Code review — guard cas vide, pagination cohérente, retrait encodeURIComponent, Task 1.6 décochée (schema.org non implémenté)

## Senior Developer Review (AI)

- **Review Date:** 2026-03-07
- **Outcome:** Changes Requested
- **Findings:** 1 High, 2 Medium, 1 Low
  - [x] [HIGH] Task 1.6 marquée [x] mais schema.org non implémenté → décochée
  - [x] [MEDIUM] Pas de guard cas vide sur la page d'accueil → ajouté
  - [x] [MEDIUM] Mélange pagination[limit] / pagination[pageSize] → unifié pageSize
  - [x] [LOW] encodeURIComponent inutile sur sort → retiré
- **Remaining:** Task 1.6 (schema.org ArtGallery) reste à implémenter ou reporter explicitement

### File List
- `galerie-front/src/pages/index.astro` (modifié) — page d'accueil avec hero, grille dernières acquisitions, guard cas vide
- `galerie-front/src/lib/strapi-client.ts` (modifié) — ajout params sort/limit à fetchOeuvres(), pagination cohérente
