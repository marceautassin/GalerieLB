# Story 4.3: Page d'accueil avec nouveautés

Status: ready-for-dev

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

- [ ] Task 1 : Mise à jour `/pages/index.astro` (AC: #1, #2, #3, #4, #5)
  - [ ] 1.1 Fetch des oeuvres triées par `createdAt` desc, limit 8 via `fetchOeuvres()` avec params de tri
  - [ ] 1.2 Section hero sobre : titre de la galerie, séparateur, phrase d'accroche (pas de hero immersif — direction B choisie)
  - [ ] 1.3 Section "Dernières acquisitions" : grille de CarteOeuvre
  - [ ] 1.4 Lien "Voir toutes les oeuvres" → `/oeuvres`
  - [ ] 1.5 SeoHead avec title "Galerie Louis Barrand" et description
  - [ ] 1.6 Schema.org `ArtGallery` (ou placeholder pour Story 5.1)
- [ ] Task 2 : Ajouter le tri/limit au client API (AC: #4)
  - [ ] 2.1 Paramètre `sort` et `pagination[limit]` dans `fetchOeuvres()`
  - [ ] 2.2 Appel : `fetchOeuvres({ sort: 'createdAt:desc', limit: 8 })`

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

### Debug Log References

### Completion Notes List

### File List
