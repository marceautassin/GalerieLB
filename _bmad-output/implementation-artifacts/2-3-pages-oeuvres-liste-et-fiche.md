# Story 2.3: Pages Oeuvres (liste et fiche)

Status: done

## Story

As a visiteur,
I want parcourir le catalogue d'oeuvres et consulter les détails d'une oeuvre,
so that je puisse identifier des pièces qui m'intéressent.

## Acceptance Criteria

1. `/oeuvres` affiche la liste de toutes les oeuvres avec visuel, titre et artiste
2. La fiche oeuvre affiche : titre, artiste (lien), technique, dimensions, provenance, visuel(s)
3. La fiche affiche les expositions associées (liens) et thématiques (liens vers filtre)
4. Bouton "Prendre rendez-vous" visible → `/contact?oeuvre=[slug]`
5. Images `<Image>` Astro avec optimisation et alt text incluant titre + artiste
6. Pages responsives

## Tasks / Subtasks

- [x] Task 1 : Page liste oeuvres `/oeuvres/index.astro` (AC: #1, #6)
  - [x] 1.1 Fetch de toutes les oeuvres au build via `fetchOeuvres()`
  - [x] 1.2 Créer GalerieImages.astro — grille CSS Grid asymétrique
  - [x] 1.3 Utiliser CarteOeuvre (créé en 2.2) pour chaque oeuvre
  - [x] 1.4 Grille : 3-4 cols desktop, 2 tablette, 1 mobile
  - [x] 1.5 Certaines oeuvres en span 2 (grid-row ou grid-column) pour l'asymétrie
- [x] Task 2 : Page fiche oeuvre `/oeuvres/[slug].astro` (AC: #2, #3, #4, #5, #6)
  - [x] 2.1 `getStaticPaths()` avec `fetchOeuvres()`
  - [x] 2.2 Split layout : image 60% gauche, métadonnées 40% droite (desktop)
  - [x] 2.3 Empilé sur mobile (image en haut, métadonnées en dessous)
  - [x] 2.4 Métadonnées : titre (h1), artiste (lien `/artistes/[slug]`), technique, dimensions, provenance
  - [x] 2.5 Section thématiques : chips/liens vers `/oeuvres?thematique=[slug]`
  - [x] 2.6 Section expositions associées : liens vers `/expositions/[slug]`
  - [x] 2.7 CTA "Prendre rendez-vous" : lien vers `/contact?oeuvre=[slug]`, style bouton primaire
  - [x] 2.8 Click sur image → ouverture Lightbox (ou lien fullscreen pour l'instant)
  - [x] 2.9 Breadcrumb : Accueil > Œuvres > [Artiste si présent] > Titre Oeuvre
  - [x] 2.10 SeoHead avec title, description et og:image dynamiques
- [x] Task 3 : Créer GalerieImages.astro (AC: #1)
  - [x] 3.1 Props : `oeuvres: Oeuvre[]`
  - [x] 3.2 CSS Grid avec auto-fill et gap `var(--space-lg)`
  - [x] 3.3 Logique d'asymétrie : certaines oeuvres en span 2 (ex: chaque 5ème)
  - [x] 3.4 Responsive : colonnes adaptatives
- [x] Task 4 : SectionLiensRelies.astro (AC: #3)
  - [x] 4.1 Props : `titre: string`, `items: { label: string, href: string, image?: string }[]`
  - [x] 4.2 Grille horizontale scrollable sur mobile, fixe sur desktop
  - [x] 4.3 Max 6 éléments, lien "Voir tout" si plus

## Dev Notes

### Split layout — Fiche oeuvre

```css
.fiche-oeuvre {
  display: grid;
  grid-template-columns: 3fr 2fr; /* 60/40 */
  gap: var(--space-2xl);
  align-items: start;
}
@media (max-width: 767px) {
  .fiche-oeuvre {
    grid-template-columns: 1fr;
  }
}
```

L'image doit conserver ses proportions réelles — PAS de recadrage. Le CTA "Prendre rendez-vous" doit être visible sans scroller sur desktop (dans la colonne métadonnées).

### CTA — Pré-remplissage contact

Le lien CTA passe la référence oeuvre en query param :
```
/contact?oeuvre=paysage-du-midi
```
Le formulaire de contact (Story 4.1) lira ce paramètre pour pré-remplir le champ référence.

### Lightbox

Pour l'instant, le click sur l'image peut ouvrir l'image en plein écran dans un nouvel onglet ou une lightbox basique. La lightbox Vue complète sera affinée si nécessaire.

### Prérequis

- Story 2.2 complétée (CarteOeuvre, Breadcrumb existent)
- Story 2.1 complétée (client API)
- Données de test avec oeuvres, artistes, thématiques

### Hors scope

- Filtrage par thématique côté client (Story 2.4)
- Lightbox Vue complète (peut être ajoutée plus tard)

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Sections: Design Direction (split layout A, grille A), Component Strategy (FicheOeuvre, GalerieImages)]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 2, Story 2.3]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References

### Completion Notes List
- GalerieImages: grille asymétrique avec span-2 sur chaque 5ème élément, 1→2→3→4 colonnes responsive
- SectionLiensRelies: chips/liens avec scroll horizontal mobile, max 6 items + lien "Voir tout"
- Fiche oeuvre: split layout 60/40 (grid 3fr 2fr), empilé mobile, dl pour métadonnées
- Lightbox: lien target="_blank" vers image pleine taille (cursor: zoom-in)
- Breadcrumb: Accueil > Œuvres > [Artiste si présent] > Titre
- CTA: `.btn-primary` global, lien vers `/contact?oeuvre=[slug]`
- og:image dynamique depuis premier visuel
- getStaticPaths passe oeuvre via props (fetchOeuvres populate expositions, 1 seul appel API)
- Build: 11 pages (5 oeuvres + 3 artistes + 2 listes + index)

### File List
- `src/pages/oeuvres/index.astro` — Page liste oeuvres avec GalerieImages
- `src/pages/oeuvres/[slug].astro` — Fiche oeuvre avec split layout, métadonnées, CTA, liens reliés
- `src/components/GalerieImages.astro` — Grille CSS Grid asymétrique pour oeuvres
- `src/components/SectionLiensRelies.astro` — Chips de liens (thématiques, expositions)
- `src/lib/strapi-client.ts` — Ajout populate expositions dans fetchOeuvres (fix N+1)
