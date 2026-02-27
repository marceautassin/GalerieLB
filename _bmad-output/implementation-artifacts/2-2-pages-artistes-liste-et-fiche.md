# Story 2.2: Pages Artistes (liste et fiche)

Status: ready-for-dev

## Story

As a visiteur,
I want parcourir la liste des artistes et consulter la fiche détaillée de chacun,
so that je puisse découvrir les artistes représentés par la galerie.

## Acceptance Criteria

1. `/artistes` affiche la liste de tous les artistes avec nom et photo
2. Chaque artiste est cliquable → `/artistes/[slug]`
3. La fiche artiste affiche biographie, contexte artistique, photo
4. La fiche artiste affiche la liste des oeuvres associées (CarteOeuvre)
5. Chaque oeuvre est cliquable → fiche oeuvre
6. Images avec `<Image>` Astro (WebP/AVIF, lazy loading) et alt text descriptif
7. Pages responsives (mobile 320px+ → desktop)

## Tasks / Subtasks

- [ ] Task 1 : Page liste artistes `/artistes/index.astro` (AC: #1, #2, #7)
  - [ ] 1.1 Fetch des artistes au build via `fetchArtistes()`
  - [ ] 1.2 Grille de CarteArtiste (3 cols desktop, 2 tablette, 1 mobile)
  - [ ] 1.3 Chaque carte : photo, nom, dates — lien vers `/artistes/[slug]`
- [ ] Task 2 : Créer CarteArtiste.astro (AC: #1, #6)
  - [ ] 2.1 Props : `artiste: Artiste`
  - [ ] 2.2 Image avec `<Image>` Astro, alt `"Portrait de [nom]"`
  - [ ] 2.3 Hover : légère élévation (box-shadow subtile), transition 200ms
  - [ ] 2.4 Lien englobant toute la carte
  - [ ] 2.5 Responsive et accessible (focus visible)
- [ ] Task 3 : Page fiche artiste `/artistes/[slug].astro` (AC: #3, #4, #5, #6, #7)
  - [ ] 3.1 `getStaticPaths()` avec `fetchArtistes()`
  - [ ] 3.2 Fetch artiste par slug avec oeuvres peuplées
  - [ ] 3.3 Afficher : photo, nom, biographie (rich text), contexte artistique (rich text)
  - [ ] 3.4 Section "Oeuvres de cet artiste" — grille de CarteOeuvre
  - [ ] 3.5 Breadcrumb : Artistes > Nom Artiste
  - [ ] 3.6 SeoHead avec title et description dynamiques
- [ ] Task 4 : Créer CarteOeuvre.astro (AC: #4, #5, #6)
  - [ ] 4.1 Props : `oeuvre: Oeuvre`
  - [ ] 4.2 Image avec proportions réelles (pas de recadrage carré)
  - [ ] 4.3 Desktop : overlay au hover (titre + artiste, opacity transition)
  - [ ] 4.4 Mobile : info visible en permanence (pas de hover)
  - [ ] 4.5 Alt text : `"[Titre], [Artiste]"`
  - [ ] 4.6 Lien vers `/oeuvres/[slug]`
- [ ] Task 5 : Créer Breadcrumb.astro (AC: #3)
  - [ ] 5.1 Props : `items: { label: string, href?: string }[]`
  - [ ] 5.2 `<nav aria-label="Fil d'Ariane">`
  - [ ] 5.3 Dernier élément non cliquable
  - [ ] 5.4 Taille caption (0.75rem), couleur `--color-text-secondary`

## Dev Notes

### CarteOeuvre — Composant réutilisable

Ce composant sera réutilisé dans toutes les pages qui affichent des oeuvres : liste artiste, liste oeuvres, expositions, accueil. Le design respecte les proportions originales des oeuvres — **PAS de recadrage carré**.

### Grille asymétrique

La grille d'oeuvres utilise CSS Grid. Pour l'instant, une grille simple suffit. L'asymétrie (certaines oeuvres en span 2) sera affinée dans la Story 2.3 avec la page oeuvres dédiée.

### Images — Règles

- TOUJOURS `<Image>` Astro (pas `<img>`)
- `loading="lazy"` sur toutes sauf above the fold
- Alt text descriptif obligatoire
- Les URLs viennent de S3 via Strapi — utiliser `src` avec l'URL complète

### Rich text — Rendu

La biographie et le contexte artistique sont du rich text Strapi. Strapi v5 retourne du markdown ou du HTML selon la config. Utiliser un rendu approprié (HTML direct ou parser markdown).

### Prérequis

- Story 2.1 complétée (client API et types disponibles)
- Story 1.4 complétée (LayoutPrincipal, Header, Footer)
- Données de test dans Strapi

### Hors scope

- GalerieImages avec grille asymétrique avancée (Story 2.3)
- Navigation par thématique (Story 2.4)
- SectionLiensRelies complète (sera enrichie progressivement)

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Sections: Component Strategy (CarteArtiste, CarteOeuvre, Breadcrumb), UX Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md — Sections: Structure pages, Image handling]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 2, Story 2.2]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
