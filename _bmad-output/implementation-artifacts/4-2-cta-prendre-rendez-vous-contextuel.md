# Story 4.2: CTA "Prendre rendez-vous" contextuel

Status: done

## Story

As a visiteur,
I want accéder au formulaire de contact en moins de 3 clics depuis n'importe quelle page,
so that je puisse facilement initier un échange avec la galerie.

## Acceptance Criteria

1. Fiche oeuvre : "Prendre rendez-vous" → `/contact?oeuvre=[slug]` avec champ pré-rempli
2. Fiche exposition : "Prendre rendez-vous" ou "Contact" → `/contact?exposition=[slug]` avec pré-remplissage
3. Nav : lien "Contact" toujours accessible (< 3 clics depuis n'importe quelle page)

## Tasks / Subtasks

- [x] Task 1 : CTA sur fiche oeuvre (AC: #1)
  - [x] 1.1 Vérifier que le CTA existe dans `/oeuvres/[slug].astro` (créé en Story 2.3)
  - [x] 1.2 Lien : `/contact?oeuvre=${oeuvre.slug}`
  - [x] 1.3 Style bouton primaire (fond noir, texte ivoire)
  - [x] 1.4 Visible sans scroller sur desktop (dans la colonne métadonnées du split layout)
- [x] Task 2 : CTA sur fiche exposition (AC: #2)
  - [x] 2.1 Ajouter un CTA "Contact" dans `/expositions/[slug].astro`
  - [x] 2.2 Lien : `/contact?exposition=${expo.slug}`
  - [x] 2.3 Style bouton secondaire ou primaire selon le contexte
- [x] Task 3 : Vérifier la nav (AC: #3)
  - [x] 3.1 Confirmer que "Contact" est dans la navigation principale (Story 1.4)
  - [x] 3.2 Compter les clics depuis chaque type de page → max 3

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
Claude Opus 4.6

### Debug Log References
Aucun problème rencontré.

### Completion Notes List
- **Task 1 (CTA oeuvre):** Vérifié — le CTA "Prendre rendez-vous" existait déjà dans `oeuvres/[slug].astro` (Story 2.3). Lien `/contact?oeuvre=${slug}`, style `btn-primary` (fond #1A1A1A, texte #FAF8F5), positionné dans la colonne métadonnées du split layout (visible sans scroll desktop).
- **Task 2 (CTA exposition):** Ajouté un CTA "Contact" dans `expositions/[slug].astro` avec lien `/contact?exposition=${exposition.slug}` et style `btn-primary`. Placé après la section oeuvres et avant les liens artistes.
- **Task 3 (Nav):** Vérifié — "Contact" est présent dans la navigation principale (desktop et mobile) dans `Header.astro`. Accessible en 1 clic depuis n'importe quelle page.
- Le formulaire de contact (`FormulaireContact.vue`) gère déjà le pré-remplissage via les paramètres URL `?oeuvre=` et `?exposition=` (implémenté en Story 4.1).

### Change Log
- 2026-03-07 : Ajout CTA "Contact" sur fiche exposition, vérification CTA oeuvre et nav existants
- 2026-03-07 : Code review — CTA déplacé après la préface (avant oeuvres), texte unifié "Prendre rendez-vous"

## Senior Developer Review (AI)

- **Review Date:** 2026-03-07
- **Outcome:** Changes Requested → Fixed
- **Findings:** 2 Medium, 1 Low corrigés
  - [x] [MEDIUM] CTA exposition mal positionné (enterré après grille oeuvres) → déplacé après préface
  - [x] [LOW] Texte CTA incohérent ("Contact" vs "Prendre rendez-vous") → unifié "Prendre rendez-vous"

### File List
- `galerie-front/src/pages/expositions/[slug].astro` (modifié) — CTA Contact avec lien pré-rempli, repositionné après préface
