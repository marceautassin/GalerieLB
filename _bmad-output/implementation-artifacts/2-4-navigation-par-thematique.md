# Story 2.4: Navigation par thématique

Status: ready-for-dev

## Story

As a visiteur (notamment directeur artistique luxe),
I want filtrer les oeuvres par thématique (équestre, nature-morte, paysage...),
so that je puisse trouver rapidement des oeuvres correspondant à mon brief.

## Acceptance Criteria

1. `/oeuvres` affiche la liste des thématiques comme filtres
2. Sélection d'une thématique → seules les oeuvres correspondantes sont affichées
3. Click sur une thématique depuis une fiche oeuvre → page oeuvres filtrée
4. Le filtre est retirable pour revenir à la liste complète
5. Filtrage côté client (pas de rechargement de page — island Vue ou JS léger)
6. Filtrage accessible au clavier

## Tasks / Subtasks

- [ ] Task 1 : Créer ChipThematique.vue (island Vue) (AC: #1, #5, #6)
  - [ ] 1.1 Props : `thematiques: Thematique[]`, `oeuvres: Oeuvre[]`
  - [ ] 1.2 Afficher les chips de thématiques au-dessus de la grille
  - [ ] 1.3 État : inactive (bordure `--color-border`) / active (fond `--color-text`, texte `--color-bg`)
  - [ ] 1.4 Click → filtre les oeuvres, re-click → désactive
  - [ ] 1.5 `role="button"`, `aria-pressed` pour l'accessibilité
  - [ ] 1.6 Navigation clavier (Tab, Enter/Space)
- [ ] Task 2 : Intégrer le filtrage dans la page oeuvres (AC: #1, #2, #5)
  - [ ] 2.1 Passer les données (oeuvres + thématiques) à l'island Vue
  - [ ] 2.2 Le filtrage met à jour la grille affichée sans rechargement
  - [ ] 2.3 État vide : "Aucune oeuvre dans cette thématique pour le moment."
  - [ ] 2.4 Utiliser `client:visible` pour l'hydratation lazy
- [ ] Task 3 : Filtrage via URL (AC: #3, #4)
  - [ ] 3.1 Lire le query param `?thematique=slug` au chargement
  - [ ] 3.2 Si présent → activer le filtre correspondant automatiquement
  - [ ] 3.3 Mettre à jour l'URL quand un filtre est activé/désactivé (history.replaceState)
  - [ ] 3.4 Le bouton retour navigateur ramène à la grille filtrée précédente

## Dev Notes

### Architecture du filtrage

Le filtrage est un island Vue qui reçoit TOUTES les oeuvres au build (SSG) et filtre côté client. Pas de fetch additionnel au runtime.

```astro
<!-- /oeuvres/index.astro -->
<ChipThematique
  client:visible
  thematiques={thematiques}
  oeuvres={oeuvres}
/>
```

Le composant Vue gère l'état du filtre actif et rend les CarteOeuvre filtrées. Les CarteOeuvre dans ce contexte sont rendues par Vue (pas par Astro), car le filtrage est dynamique.

### Persistance du filtre dans l'URL

```javascript
// Lire au mount
const urlParams = new URLSearchParams(window.location.search);
const activeThematique = urlParams.get('thematique');

// Mettre à jour sans rechargement
history.replaceState(null, '', `?thematique=${slug}`);
// Retirer le filtre
history.replaceState(null, '', window.location.pathname);
```

### Prérequis

- Story 2.3 complétée (page oeuvres, GalerieImages)
- Thématiques créées dans Strapi avec oeuvres associées

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Sections: Component Strategy (ChipThematique), UX Patterns (filtrage)]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 2, Story 2.4]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
