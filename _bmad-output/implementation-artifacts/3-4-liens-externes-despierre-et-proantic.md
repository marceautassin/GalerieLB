# Story 3.4: Liens externes (Despierre & Proantic)

Status: done

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

- [x] Task 1 : Mettre à jour Footer.astro (AC: #1, #2, #3)
  - [x] 1.1 Ajouter le lien vers le site Jacques Despierre (déjà présent depuis Story 1.4)
  - [x] 1.2 Ajouter le lien vers Proantic (déjà présent depuis Story 1.4)
  - [x] 1.3 `target="_blank"` + `rel="noopener"` sur les deux (déjà en place)
  - [x] 1.4 Vérifier l'accessibilité (texte descriptif, focus visible) — OK
- [x] Task 2 : Liens contextuels (AC: #4)
  - [x] 2.1 Si la fiche artiste concerne Jacques Despierre → lien vers le site dédié (condition sur slug)
  - [x] 2.2 Lien Proantic dans la page À propos (section "Retrouvez-nous aussi sur")

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
Claude Opus 4.6

### Debug Log References
- TypeScript check : pass sans erreur
- Footer déjà équipé des liens Despierre/Proantic depuis Story 1.4

### Completion Notes List
- Task 1 : Footer.astro déjà complet (liens + target + rel) — rien à modifier
- Task 2.1 : Lien contextuel Despierre ajouté sur fiche artiste via condition `slug.includes('despierre')`
- Task 2.2 : Section "Retrouvez-nous aussi sur" avec lien Proantic ajoutée sur la page À propos
- URLs actuelles sont des placeholders — à remplacer par les vraies URLs fournies par Louis

### Senior Developer Review (AI)
- Date : 2026-03-07
- Outcome : Approved with notes
- Note : URLs placeholders (`https://www.despierre.com`, `https://www.proantic.com`) à remplacer quand Louis fournira les vraies. Le check par slug (`slug.includes('despierre')`) est fragile mais acceptable vu le volume faible d'artistes.

### File List
- `galerie-front/src/pages/artistes/[slug].astro` (modifié — lien contextuel Despierre)
- `galerie-front/src/pages/a-propos.astro` (modifié — section lien Proantic)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modifié — status)
- `_bmad-output/implementation-artifacts/3-4-liens-externes-despierre-et-proantic.md` (modifié — story file)
