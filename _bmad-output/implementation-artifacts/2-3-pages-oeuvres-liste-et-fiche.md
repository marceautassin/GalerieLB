# Story 2.3: Pages Oeuvres (liste et fiche)

Status: ready-for-dev

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

- [ ] Task 1 : Page liste oeuvres `/oeuvres/index.astro` (AC: #1, #6)
  - [ ] 1.1 Fetch de toutes les oeuvres au build via `fetchOeuvres()`
  - [ ] 1.2 Créer GalerieImages.astro — grille CSS Grid asymétrique
  - [ ] 1.3 Utiliser CarteOeuvre (créé en 2.2) pour chaque oeuvre
  - [ ] 1.4 Grille : 3-4 cols desktop, 2 tablette, 1 mobile
  - [ ] 1.5 Certaines oeuvres en span 2 (grid-row ou grid-column) pour l'asymétrie
- [ ] Task 2 : Page fiche oeuvre `/oeuvres/[slug].astro` (AC: #2, #3, #4, #5, #6)
  - [ ] 2.1 `getStaticPaths()` avec `fetchOeuvres()`
  - [ ] 2.2 Split layout : image 60% gauche, métadonnées 40% droite (desktop)
  - [ ] 2.3 Empilé sur mobile (image en haut, métadonnées en dessous)
  - [ ] 2.4 Métadonnées : titre (h1), artiste (lien `/artistes/[slug]`), technique, dimensions, provenance
  - [ ] 2.5 Section thématiques : chips/liens vers `/oeuvres?thematique=[slug]`
  - [ ] 2.6 Section expositions associées : liens vers `/expositions/[slug]`
  - [ ] 2.7 CTA "Prendre rendez-vous" : lien vers `/contact?oeuvre=[slug]`, style bouton primaire
  - [ ] 2.8 Click sur image → ouverture Lightbox (ou lien fullscreen pour l'instant)
  - [ ] 2.9 Breadcrumb : Artistes > Nom Artiste > Titre Oeuvre
  - [ ] 2.10 SeoHead avec title, description et og:image dynamiques
- [ ] Task 3 : Créer GalerieImages.astro (AC: #1)
  - [ ] 3.1 Props : `oeuvres: Oeuvre[]`
  - [ ] 3.2 CSS Grid avec auto-fill et gap `var(--space-lg)`
  - [ ] 3.3 Logique d'asymétrie : certaines oeuvres en span 2 (ex: chaque 5ème)
  - [ ] 3.4 Responsive : colonnes adaptatives
- [ ] Task 4 : SectionLiensRelies.astro (AC: #3)
  - [ ] 4.1 Props : `titre: string`, `items: { label: string, href: string, image?: string }[]`
  - [ ] 4.2 Grille horizontale scrollable sur mobile, fixe sur desktop
  - [ ] 4.3 Max 6 éléments, lien "Voir tout" si plus

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

### Debug Log References

### Completion Notes List

### File List
