# Story 3.3: Section Presse

Status: ready-for-dev

## Story

As a journaliste,
I want accéder rapidement aux articles de presse et aux ressources média de la galerie,
so that je puisse évaluer la couverture existante et préparer mon propre article.

## Acceptance Criteria

1. `/presse` affiche la liste des articles avec titre et type (PDF/lien)
2. Les articles PDF sont téléchargeables (lien vers fichier S3)
3. Les articles de type lien ouvrent l'URL externe dans un nouvel onglet
4. Les visuels haute résolution sont affichés et téléchargeables
5. Page responsive et accessible

## Tasks / Subtasks

- [ ] Task 1 : Étendre le client API (AC: #1)
  - [ ] 1.1 Ajouter `fetchArticlesPresse()` dans `strapi-client.ts`
  - [ ] 1.2 Compléter le type `ArticlePresse` dans `strapi.ts`
- [ ] Task 2 : Créer la page `/presse.astro` (AC: #1, #2, #3, #4, #5)
  - [ ] 2.1 Fetch des articles presse au build
  - [ ] 2.2 Liste des articles : titre, type (icône PDF ou lien externe)
  - [ ] 2.3 PDF : `<a href="[url-s3]" download>` pour téléchargement direct
  - [ ] 2.4 Lien externe : `target="_blank" rel="noopener"`
  - [ ] 2.5 Visuels haute résolution affichés avec option téléchargement
  - [ ] 2.6 SeoHead, responsive, accessible

## Dev Notes

### Liens — Attributs de sécurité

Tous les liens externes : `target="_blank"` + `rel="noopener"`. Pas de `rel="noreferrer"` (on veut que les sites sachent d'où vient le trafic).

### Prérequis

- Story 1.3 complétée (content type ArticlePresse existe)
- Story 2.1 complétée (client API base)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 3, Story 3.3]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
