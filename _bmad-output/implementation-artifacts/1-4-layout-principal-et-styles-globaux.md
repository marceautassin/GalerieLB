# Story 1.4: Layout principal et styles globaux

Status: ready-for-dev

## Story

As a visiteur,
I want voir une structure de page cohérente avec header, navigation et footer,
so that je puisse naviguer sur le site de manière intuitive.

## Acceptance Criteria

1. Le `LayoutPrincipal.astro` est en place avec header, nav et footer
2. Le fichier `global.css` contient le reset, les custom properties (couleurs, typographie Abhaya Libre + Inter) et les styles globaux
3. Le composant `SeoHead.astro` est créé (meta de base, structure extensible)
4. La navigation contient les liens vers les 6 sections (Artistes, Oeuvres, Expositions, À propos, Presse, Contact)
5. Le layout est responsive (mobile 320px+ → desktop)
6. Le HTML est sémantique (nav, main, header, footer)

## Tasks / Subtasks

- [ ] Task 1 : Compléter global.css avec les design tokens (AC: #2)
  - [ ] 1.1 Vérifier/compléter le reset CSS
  - [ ] 1.2 Vérifier/compléter les custom properties (couleurs, typo, spacing, transitions)
  - [ ] 1.3 Ajouter les styles body : `background: var(--color-bg)`, `color: var(--color-text)`, `font-family: var(--font-body)`
  - [ ] 1.4 Ajouter l'échelle typographique headings (h1-h4) avec Abhaya Libre
  - [ ] 1.5 Ajouter le style focus global : `outline: 2px solid var(--color-text); outline-offset: 2px`
  - [ ] 1.6 Charger les fonts Google (Abhaya Libre + Inter) avec `font-display: swap`
- [ ] Task 2 : Créer SeoHead.astro (AC: #3)
  - [ ] 2.1 Props : `title`, `description`, `ogImage?`, `ogType?`, `canonicalUrl?`
  - [ ] 2.2 Rendre les balises `<title>`, `<meta description>`, `<meta charset>`, `<meta viewport>`
  - [ ] 2.3 Rendre les balises Open Graph de base (og:title, og:description, og:image, og:type, og:url)
  - [ ] 2.4 Ajouter `<html lang="fr">`
  - [ ] 2.5 Ajouter les `<link>` Google Fonts (preconnect + stylesheet)
  - [ ] 2.6 Structure extensible pour ajouter schema.org plus tard (Story 5.1)
- [ ] Task 3 : Créer Header.astro (AC: #1, #4, #6)
  - [ ] 3.1 Logo à gauche (placeholder texte ou SVG — logo fourni plus tard par Marceau)
  - [ ] 3.2 Nav links à droite : Artistes, Oeuvres, Expositions, À propos, Presse, Contact
  - [ ] 3.3 CTA "Contact" stylisé comme bouton dans la nav
  - [ ] 3.4 Comportement sticky : se cache au scroll descendant (> 100px), réapparaît au scroll montant
  - [ ] 3.5 Fond `#FAF8F5` avec léger box-shadow au scroll
  - [ ] 3.6 Skip-to-content link en premier élément focusable
  - [ ] 3.7 `<header>` + `<nav>` sémantiques
- [ ] Task 4 : Créer Nav mobile — burger menu (AC: #5)
  - [ ] 4.1 Icône hamburger 44x44px (touch target) — visible uniquement < 768px
  - [ ] 4.2 Overlay plein écran fond `#FAF8F5`
  - [ ] 4.3 Liens centrés verticalement en Abhaya Libre grand
  - [ ] 4.4 CTA Contact visible en bas
  - [ ] 4.5 Fermeture : bouton X, touche Escape, click sur un lien
  - [ ] 4.6 Focus trap à l'intérieur du menu ouvert
  - [ ] 4.7 `aria-expanded` sur le bouton burger
- [ ] Task 5 : Créer Footer.astro (AC: #1, #6)
  - [ ] 5.1 3 colonnes : adresse galerie, horaires, liens externes (Despierre, Proantic)
  - [ ] 5.2 Fond `#000000`, texte clair
  - [ ] 5.3 Liens externes avec `target="_blank"` et `rel="noopener"`
  - [ ] 5.4 `<footer>` sémantique
  - [ ] 5.5 Responsive : empilé sur mobile
- [ ] Task 6 : Créer LayoutPrincipal.astro (AC: #1, #5, #6)
  - [ ] 6.1 Import et inclusion de SeoHead, Header, Footer
  - [ ] 6.2 `<main>` avec `<slot />` pour le contenu
  - [ ] 6.3 Largeur max contenu : 1280px centré
  - [ ] 6.4 Marges latérales : 24px (mobile), 48px (tablette), auto (desktop)
  - [ ] 6.5 Import de global.css
- [ ] Task 7 : Mettre à jour index.astro (AC: #1)
  - [ ] 7.1 Utiliser LayoutPrincipal comme wrapper
  - [ ] 7.2 Contenu placeholder minimal (titre + texte)
  - [ ] 7.3 Vérifier le rendu complet : header + nav + contenu + footer
- [ ] Task 8 : Validation responsive et accessibilité (AC: #5, #6)
  - [ ] 8.1 Tester sur mobile (320px), tablette (768px), desktop (1024px+)
  - [ ] 8.2 Navigation clavier complète (Tab through header → content → footer)
  - [ ] 8.3 Vérifier les landmarks sémantiques dans un lecteur d'écran ou DevTools
  - [ ] 8.4 Vérifier les contrastes (déjà validés dans la spec UX)

## Dev Notes

### Design Tokens complets — global.css

```css
:root {
  /* Couleurs */
  --color-bg: #FAF8F5;
  --color-text: #1A1A1A;
  --color-text-secondary: #4A4A4A;
  --color-text-tertiary: #7A7A7A;
  --color-border: #E5E2DE;
  --color-surface: #FFFFFF;
  --color-black: #000000;
  --color-success: #2D6A4F;
  --color-error: #C1292E;

  /* Typographie */
  --font-heading: 'Abhaya Libre', serif;
  --font-body: 'Inter', sans-serif;

  /* Espacements */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;

  /* Layout */
  --max-width: 1280px;

  /* Transitions */
  --transition-default: 200ms ease-in-out;
  --transition-fade: 150ms ease-in-out;
}

/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.6;
}

/* Échelle typographique */
h1, h2, h3, h4 { font-family: var(--font-heading); }
h1 { font-size: 2.5rem; line-height: 1.2; font-weight: 700; }
h2 { font-size: 2rem; line-height: 1.25; font-weight: 700; }
h3 { font-size: 1.5rem; line-height: 1.3; font-weight: 600; }
h4 { font-size: 1.25rem; line-height: 1.35; font-weight: 600; }

/* Focus global */
:focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 2px;
}

/* Images */
img { max-width: 100%; height: auto; display: block; }

/* Links */
a { color: var(--color-text); }
```

### Header — Comportement sticky hide/show

Le header utilise du JavaScript vanilla (pas de Vue — composant statique Astro avec `<script>`).

```
Logique :
- Variable lastScrollY = 0
- Au scroll : si scrollY > lastScrollY ET scrollY > 100px → header hidden (translateY(-100%))
- Si scrollY < lastScrollY → header visible (translateY(0))
- Transition : var(--transition-default)
```

Ce script est dans un `<script>` inline dans Header.astro (exécuté côté client).

### Nav mobile — Focus trap

Le focus trap dans le menu mobile nécessite du JavaScript vanilla :
- Récupérer tous les éléments focusables dans le menu
- Au Tab sur le dernier → revenir au premier
- Au Shift+Tab sur le premier → aller au dernier
- Escape → fermer le menu

### Composants à créer dans cette story

| Fichier | Emplacement |
|---|---|
| `LayoutPrincipal.astro` | `src/layouts/` |
| `Header.astro` | `src/components/` |
| `Nav.astro` | `src/components/` (optionnel — peut être intégré dans Header) |
| `Footer.astro` | `src/components/` |
| `SeoHead.astro` | `src/components/` |

### Bouton CTA — Styles

```css
/* Bouton primaire (CTA) */
.btn-primary {
  background: var(--color-text);
  color: var(--color-bg);
  padding: 12px 24px;
  border: 1px solid transparent;
  font-family: var(--font-body);
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition-default);
}
.btn-primary:hover {
  background: var(--color-bg);
  color: var(--color-text);
  border-color: var(--color-text);
}
```

### Google Fonts — Chargement

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

À placer dans SeoHead.astro (dans le `<head>`).

### Structure LayoutPrincipal.astro

```astro
---
import SeoHead from '../components/SeoHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
}

const { title, description, ogImage, ogType } = Astro.props;
---

<!DOCTYPE html>
<html lang="fr">
<head>
  <SeoHead title={title} description={description} ogImage={ogImage} ogType={ogType} />
</head>
<body>
  <a href="#main-content" class="skip-link">Aller au contenu</a>
  <Header />
  <main id="main-content">
    <div class="container">
      <slot />
    </div>
  </main>
  <Footer />
</body>
</html>

<style>
  .skip-link {
    position: absolute;
    top: -100%;
    left: 16px;
    z-index: 1000;
    padding: 8px 16px;
    background: var(--color-text);
    color: var(--color-bg);
  }
  .skip-link:focus {
    top: 8px;
  }
  .container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--space-lg);
  }
  @media (min-width: 768px) {
    .container { padding: 0 var(--space-2xl); }
  }
  @media (min-width: 1024px) {
    .container { padding: 0; }
  }
</style>
```

### Anti-patterns à éviter

- NE PAS utiliser de framework CSS — CSS natif uniquement
- NE PAS écrire de CSS global hors de `src/styles/global.css`
- NE PAS utiliser `<img>` — utiliser `<Image>` d'Astro (quand il y aura des images)
- NE PAS utiliser Vue pour le header/nav/footer — ce sont des composants statiques Astro
- NE PAS supprimer le focus outline (`outline: none` interdit)
- Le JavaScript du header (sticky) et du menu mobile (focus trap) est en vanilla JS dans des `<script>` Astro, PAS en Vue

### Breakpoints (media queries mobile-first)

```css
/* Mobile : défaut (< 768px) */
/* Tablette */
@media (min-width: 768px) { }
/* Desktop */
@media (min-width: 1024px) { }
/* Large */
@media (min-width: 1440px) { }
```

### Prérequis

- Story 1.1 complétée (projet Astro initialisé, global.css créé avec tokens de base)

### Hors scope

- Composants CarteOeuvre, CarteArtiste, CarteExposition (Story 2.x)
- Données CMS (Stories 1.2, 1.3)
- Contenu dynamique (Story 2.1+)
- Logo final (fourni par Marceau plus tard — utiliser placeholder texte "Galerie Louis Barrand")

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Sections: Visual Design Foundation, Component Strategy, UX Consistency Patterns, Responsive Design]
- [Source: _bmad-output/planning-artifacts/architecture.md — Sections: Structure projet, CSS approach]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.4]
- [Source: _bmad-output/project-context.md — Règles CSS, accessibilité, anti-patterns]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
