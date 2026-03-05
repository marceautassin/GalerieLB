# Story 2.2: Pages Artistes (liste et fiche)

Status: done

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

- [x] Task 1 : Page liste artistes `/artistes/index.astro` (AC: #1, #2, #7)
  - [x] 1.1 Fetch des artistes au build via `fetchArtistes()`
  - [x] 1.2 Grille de CarteArtiste (3 cols desktop, 2 tablette, 1 mobile)
  - [x] 1.3 Chaque carte : photo, nom, dates — lien vers `/artistes/[slug]`
- [x] Task 2 : Créer CarteArtiste.astro (AC: #1, #6)
  - [x] 2.1 Props : `artiste: Artiste`
  - [x] 2.2 Image avec `<Image>` Astro, alt `"Portrait de [nom]"`
  - [x] 2.3 Hover : légère élévation (box-shadow subtile), transition 200ms
  - [x] 2.4 Lien englobant toute la carte
  - [x] 2.5 Responsive et accessible (focus visible)
- [x] Task 3 : Page fiche artiste `/artistes/[slug].astro` (AC: #3, #4, #5, #6, #7)
  - [x] 3.1 `getStaticPaths()` avec `fetchArtistes()`
  - [x] 3.2 Fetch artiste par slug avec oeuvres peuplées
  - [x] 3.3 Afficher : photo, nom, biographie (rich text), contexte artistique (rich text)
  - [x] 3.4 Section "Oeuvres de cet artiste" — grille de CarteOeuvre
  - [x] 3.5 Breadcrumb : Artistes > Nom Artiste
  - [x] 3.6 SeoHead avec title et description dynamiques
- [x] Task 4 : Créer CarteOeuvre.astro (AC: #4, #5, #6)
  - [x] 4.1 Props : `oeuvre: Oeuvre`
  - [x] 4.2 Image avec proportions réelles (pas de recadrage carré)
  - [x] 4.3 Desktop : overlay au hover (titre + artiste, opacity transition)
  - [x] 4.4 Mobile : info visible en permanence (pas de hover)
  - [x] 4.5 Alt text : `"[Titre], [Artiste]"`
  - [x] 4.6 Lien vers `/oeuvres/[slug]`
- [x] Task 5 : Créer Breadcrumb.astro (AC: #3)
  - [x] 5.1 Props : `items: { label: string, href?: string }[]`
  - [x] 5.2 `<nav aria-label="Fil d'Ariane">`
  - [x] 5.3 Dernier élément non cliquable
  - [x] 5.4 Taille caption (0.75rem), couleur `--color-text-secondary`

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
Claude Opus 4.6

### Debug Log References

### Completion Notes List
- Rich text from Strapi v5 is plain text — rendered by splitting on newlines into `<p>` tags
- All test data images are null — placeholder handling verified working
- Used Astro `<Image>` component for remote images (AC #6) with remotePatterns in astro.config.ts
- Build generates 3 artiste detail pages + 1 list page successfully

### Code Review Fixes (2026-03-05)
- [FIX #1 HIGH] Rich text rendering: `.filter()` before `.map()` to avoid empty nodes in DOM
- [FIX #2 HIGH] Added `:focus-visible` styles on CarteArtiste and CarteOeuvre for keyboard navigation
- [FIX #3 MEDIUM] Eliminated N+1 fetch: `getStaticPaths` passes artiste via `props` (deep populate via `fetchArtisteBySlug`)
- [FIX #5 MEDIUM] Removed dead code `Astro.redirect('/404')` (impossible in SSG with getStaticPaths)
- [FIX #6 LOW] SEO description truncated at word boundary with `truncateAtWord()` + "…"
- [NOTED #4 MEDIUM] `<h2>` in CarteArtiste: correct hierarchy in current context, monitor for reuse

### File List
- `src/pages/artistes/index.astro` — Liste artistes avec grille responsive
- `src/pages/artistes/[slug].astro` — Fiche artiste avec photo, bio, contexte, oeuvres
- `src/components/CarteArtiste.astro` — Carte artiste avec photo/placeholder, hover
- `src/components/CarteOeuvre.astro` — Carte oeuvre avec overlay desktop, info mobile
- `src/components/Breadcrumb.astro` — Fil d'Ariane accessible
- `astro.config.ts` — Ajout remotePatterns pour images
