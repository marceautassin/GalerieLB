---
title: 'Refonte page accueil + header iPad compact'
type: 'feature'
created: '2026-05-07'
status: 'done'
baseline_commit: 'c69f0a983fccf66e9b29ed078438523f60b1ab8e'
context:
  - '_bmad/_memory/art-director-sidecar/specs-2026-05-07.md'
  - '_bmad/_memory/art-director-sidecar/audit-2026-05-07.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur iPad portrait (834px) le hero d'accueil crope l'œuvre vedette (seule la moitié gauche du tableau Despierre est visible) à cause d'un grid 3fr/2fr + `min-height: 85vh` qui force `object-fit: cover` à sacrifier les côtés ; sur le même viewport le header desktop déclenche un wrap du wordmark et de "À propos" sur 2 lignes faute de breakpoint compact entre mobile (≥768) et desktop (≥1024). De plus, la grille des Acquisitions récentes affiche encore des placeholders (le filtre `hasVisuels` mergé n'est appelé nulle part), l'overlay desktop des `CarteOeuvre` cache l'info que mobile montre déjà, et la composition globale est "portfolio template" sans respiration éditoriale.

**Approach:** Refonte complète de l'accueil suivant `specs-2026-05-07.md §SPEC 2` (hero plein cadre `--w-bleed` avec texte en overlay bottom-left, ligne éditoriale `--w-prose` entre hero et grille, grille acquisitions `--w-edge`, suppression overlay desktop, CTA "Voir toutes" en lien souligné, appel `fetchOeuvres({ hasVisuels: true })`) **plus deux ajouts dûs au test iPad** : (1) hero avec `aspect-ratio` maîtrisé (16/9 desktop, 4/3 portrait) au lieu de `min-height: 85vh` pour ne plus distordre les œuvres au format paysage ; (2) breakpoint header compact 768–1023px (logo plus petit, gaps resserrés, suppression du pill Contact au profit d'un lien texte).

## Boundaries & Constraints

**Always:**
- Mobile ≤640px : non-régressif (rendu actuel excellent)
- Containers `.container--bleed/edge/prose/nav` (commit précédent) — pas réinventer
- Easings existants `cubic-bezier(0.25, 0.1, 0.25, 1)` conservés
- A11y préservée : skip-link, aria nav, focus trap, `<h1>` unique
- Image hero `loading="eager"` + `fetchpriority="high"`

**Ask First:**
- Si l'œuvre vedette `apropos.oeuvresMisesEnAvant[0]` est en format portrait (rare) — comment la cadrer

**Never:**
- Pas toucher : LayoutPrincipal, lightbox, footer, menu burger mobile, autres pages
- Pas modifier palette, fonts, espacements globaux
- Pas de nouveau composant ni package npm

## I/O & Edge-Case Matrix

| Scenario | State | Expected Behavior |
|---|---|---|
| Hero ≥1024px | œuvre paysage | 100vw, ratio 16/9, texte overlay bottom-left |
| Hero 641–1023px (iPad) | idem | 100vw, ratio 4/3 ou 16/9 selon orientation, texte overlay si hauteur ≥ 500px sinon sous hero |
| Hero ≤640px | idem | 100vw, ratio 4/3, texte sous hero |
| Hero image absente | `visuelHero === null` | Placeholder respecte aspect-ratio courant |
| Header 768–1023px | iPad portrait | Logo 1.125rem, gap réduit, Contact en lien texte, aucun wrap |
| Header ≥1024px | desktop | Rendu actuel (logo 1.5rem, pill Contact) |
| Carte œuvre ≥768px hover | hover | Pas d'overlay sombre, image scale 1.02/800ms, info sous image |

</frozen-after-approval>

## Code Map

- `galerie-front/src/pages/index.astro` -- restructuration complète : hero `bleed` avec overlay, ligne éditoriale `prose`, grille `edge`, lien `cta-lien`
- `galerie-front/src/components/CarteOeuvre.astro` -- suppression overlay desktop, info toujours visible, hover scale 1.02/800ms
- `galerie-front/src/components/Header.astro` -- ajout breakpoint compact 768–1023px (logo réduit, gaps resserrés, Contact en lien texte)

## Tasks & Acceptance

**Execution:**

- [x] `galerie-front/src/pages/index.astro` -- (a) ligne 10 : changer l'appel `fetchOeuvres({ sort: 'createdAt:desc', limit: 8 })` en `fetchOeuvres({ sort: 'createdAt:desc', limit: 8, hasVisuels: true })`. (b) Restructurer le template en 3 sections successives : `<section class="hero container--bleed">` (image plein cadre + bloc texte en overlay positionné `absolute; bottom; left`), puis `<section class="container--prose accroche-editoriale">` (1 phrase serif italique centrée), puis `<section class="container--edge acquisitions-recentes">` (titre + grille `<ul>` + lien souligné). (c) Réécrire le `<style>` : retirer le grid 3fr/2fr du hero, l'image utilise `aspect-ratio: 4/3` mobile / `16/9` desktop (≥1024) avec `object-fit: cover`. Le bloc texte est en `position: absolute` bottom-left avec gradient sombre derrière pour contraste, sauf en mobile (≤640px) où il sort sous l'image. CTA "Voir toutes les œuvres" devient lien souligné fin (créer `.cta-lien` inline ou dans `<style>`).
- [x] `galerie-front/src/components/CarteOeuvre.astro` -- (a) supprimer entièrement le bloc `<div class="carte-oeuvre-overlay">` et toutes les règles `.carte-oeuvre-overlay*` du `<style>` (l. 87–124). (b) Renommer `.carte-oeuvre-info-mobile` → `.carte-oeuvre-info` partout. (c) Supprimer la media query `@media (min-width: 768px) { .carte-oeuvre-info-mobile { display: none; } }`. (d) Ralentir le hover : `transform 800ms` (au lieu de 600ms) et `scale(1.02)` (au lieu de 1.04).
- [x] `galerie-front/src/components/Header.astro` -- ajouter dans le `<style>` un breakpoint `@media (min-width: 768px) and (max-width: 1023.98px) { ... }` qui : (a) réduit `.logo` à `font-size: 1.125rem` et `.logo-img` à `height: 32px`, (b) `.nav-desktop ul { gap: var(--space-md) }` (au lieu de `--space-lg`), (c) `.nav-desktop a { font-size: 0.8125rem }`, (d) override `.nav-cta` pour qu'il ressemble à un lien texte (`background: none; color: var(--color-text); padding: 8px 0; border: none;`). Garder les valeurs actuelles à ≥1024px.
- [ ] **Manuel** -- Avec dev server local, capturer `/` en 1920 / 1194 / 834 / 768 / 640 / 375 et vérifier les ACs visuelles. Vérifier que le tableau hero (Despierre chevaux) est intégralement visible sur iPad portrait.

**Acceptance Criteria:**

- Given un visiteur sur `/` en iPad portrait (834×1194), when la page se charge, then le tableau de l'œuvre vedette est intégralement visible (signature, bordures, composition complète) — aucun élément central de l'œuvre n'est cropé.
- Given un visiteur sur `/` en iPad portrait (834×1194), when il regarde le header, then "Galerie Louis Barrand" tient sur une seule ligne, "À propos" tient sur une seule ligne, et aucun item de nav ne wrap.
- Given un visiteur sur `/` en 1920px, when la page se charge, then l'image hero occupe les 100vw de la viewport (full-bleed effectif) avec ratio 16/9, et le texte "Galerie Louis Barrand" apparaît en overlay bas-gauche par-dessus l'image.
- Given un visiteur sur `/` en 1920px, when il scroll sous le hero, then une ligne éditoriale serif italique apparaît centrée dans une colonne ≤720px, suivie d'une grille d'acquisitions étendue jusqu'à `min(96vw, 1760px)`.
- Given un visiteur sur `/` en n'importe quel viewport ≥640px, when il survole une carte d'œuvre, then aucun overlay sombre n'apparaît sur l'image — le titre et l'artiste sont déjà visibles sous l'image.
- Given Strapi contient des œuvres sans visuel et des œuvres avec visuel, when la page d'accueil charge, then la grille "Acquisitions récentes" n'affiche aucune cellule grise placeholder (toutes ont une image).
- Given le rendu mobile actuel sur 375px, when la page recharge après refonte, then aucune régression visuelle n'est détectable côté composition (single-column, hero full-bleed, métadonnées sous chaque carte).

## Spec Change Log

<!-- Empty until first review loop -->

## Verification

**Commands:**
- `yarn build` (depuis `galerie-front/`) -- expected: build success (peut échouer au SSG si Strapi local indisponible — c'est OK pour validation TS)
- `yarn dev` -- expected: dev server démarre, page `/` répond sans erreur console

**Manual checks:**
- Sur la page `/` lancée en dev local, capturer en 375 / 640 / 768 / 834 / 1024 / 1194 / 1440 / 1920 et vérifier visuellement chaque AC
- Comparer avec `home-1920.jpeg`, `home-1440.jpeg`, `home-768.jpeg`, `home-375.jpeg`, `home-ipad-portrait.jpeg`, `home-ipad-landscape.jpeg` (captures avant) — l'iPad portrait doit montrer le tableau entier, le 1920 doit être plein cadre
- Inspector devtools : sur un vignette de la grille Acquisitions, vérifier qu'au hover aucun élément `.carte-oeuvre-overlay` n'existe dans le DOM
- Tester l'œuvre vedette : si `apropos.oeuvresMisesEnAvant[0]` est en format portrait, vérifier le rendu et signaler à Marceau pour décision
