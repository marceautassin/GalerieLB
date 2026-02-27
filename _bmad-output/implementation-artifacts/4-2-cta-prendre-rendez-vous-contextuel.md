# Story 4.2: CTA "Prendre rendez-vous" contextuel

Status: ready-for-dev

## Story

As a visiteur,
I want accéder au formulaire de contact en moins de 3 clics depuis n'importe quelle page,
so that je puisse facilement initier un échange avec la galerie.

## Acceptance Criteria

1. Fiche oeuvre : "Prendre rendez-vous" → `/contact?oeuvre=[slug]` avec champ pré-rempli
2. Fiche exposition : "Prendre rendez-vous" ou "Contact" → `/contact?exposition=[slug]` avec pré-remplissage
3. Nav : lien "Contact" toujours accessible (< 3 clics depuis n'importe quelle page)

## Tasks / Subtasks

- [ ] Task 1 : CTA sur fiche oeuvre (AC: #1)
  - [ ] 1.1 Vérifier que le CTA existe dans `/oeuvres/[slug].astro` (créé en Story 2.3)
  - [ ] 1.2 Lien : `/contact?oeuvre=${oeuvre.slug}`
  - [ ] 1.3 Style bouton primaire (fond noir, texte ivoire)
  - [ ] 1.4 Visible sans scroller sur desktop (dans la colonne métadonnées du split layout)
- [ ] Task 2 : CTA sur fiche exposition (AC: #2)
  - [ ] 2.1 Ajouter un CTA "Contact" dans `/expositions/[slug].astro`
  - [ ] 2.2 Lien : `/contact?exposition=${expo.slug}`
  - [ ] 2.3 Style bouton secondaire ou primaire selon le contexte
- [ ] Task 3 : Vérifier la nav (AC: #3)
  - [ ] 3.1 Confirmer que "Contact" est dans la navigation principale (Story 1.4)
  - [ ] 3.2 Compter les clics depuis chaque type de page → max 3

## Dev Notes

### Un seul CTA primaire par écran

Règle UX : un seul bouton primaire visible par écran. Si "Prendre rendez-vous" est primaire sur la fiche oeuvre, les autres actions sont secondaires.

### Story légère

Cette story est principalement de la vérification et de l'ajout de CTAs sur les pages existantes. La plupart du travail (lien pré-rempli) est déjà en place depuis les Stories 2.3 et 4.1.

### Prérequis

- Story 4.1 complétée (formulaire contact avec pré-remplissage URL)
- Story 2.3 complétée (fiche oeuvre)
- Story 3.1 complétée (fiche exposition)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 4, Story 4.2]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — UX Patterns (Button Hierarchy)]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
