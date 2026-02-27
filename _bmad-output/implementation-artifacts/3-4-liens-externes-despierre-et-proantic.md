# Story 3.4: Liens externes (Despierre & Proantic)

Status: ready-for-dev

## Story

As a visiteur,
I want accéder au site dédié de Jacques Despierre et à la page Proantic de la galerie,
so that je puisse approfondir mes recherches.

## Acceptance Criteria

1. Lien vers le site dédié Jacques Despierre visible dans le footer
2. Lien vers Proantic visible dans le footer
3. Les deux liens s'ouvrent dans un nouvel onglet (`target="_blank"` + `rel="noopener"`)
4. Les liens sont accessibles depuis les pages artistes/oeuvres pertinentes si applicable

## Tasks / Subtasks

- [ ] Task 1 : Mettre à jour Footer.astro (AC: #1, #2, #3)
  - [ ] 1.1 Ajouter le lien vers le site Jacques Despierre
  - [ ] 1.2 Ajouter le lien vers Proantic
  - [ ] 1.3 `target="_blank"` + `rel="noopener"` sur les deux
  - [ ] 1.4 Vérifier l'accessibilité (texte descriptif, focus visible)
- [ ] Task 2 : Liens contextuels (AC: #4)
  - [ ] 2.1 Si la fiche artiste concerne Jacques Despierre → ajouter un lien vers le site dédié
  - [ ] 2.2 Ajouter un lien Proantic dans la page À propos si pertinent

## Dev Notes

### URLs

Les URLs exactes pour Despierre et Proantic seront fournies par Louis/Marceau. Utiliser des placeholders en attendant.

### Story légère

Cette story est principalement une mise à jour du footer existant (créé en Story 1.4) et l'ajout de liens contextuels. Volume de travail faible.

### Prérequis

- Story 1.4 complétée (Footer.astro existe)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 3, Story 3.4]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
