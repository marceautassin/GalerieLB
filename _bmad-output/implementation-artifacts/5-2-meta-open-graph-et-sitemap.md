# Story 5.2: Meta, Open Graph et sitemap

Status: ready-for-dev

## Story

As a moteur de recherche ou réseau social,
I want des balises meta et Open Graph optimisées sur chaque page et un sitemap complet,
so that chaque page soit correctement indexée et partageable.

## Acceptance Criteria

1. Chaque page a un `<title>` et `<meta description>` uniques et descriptifs, générés depuis le CMS
2. Chaque page a des balises Open Graph (og:title, og:description, og:image, og:type)
3. Les fiches oeuvres utilisent le visuel de l'oeuvre comme og:image
4. `@astrojs/sitemap` est configuré et génère un sitemap XML
5. Sitemap accessible à `/sitemap-index.xml`

## Tasks / Subtasks

- [ ] Task 1 : Compléter SeoHead.astro (AC: #1, #2, #3)
  - [ ] 1.1 Vérifier que tous les props (title, description, ogImage, ogType) sont utilisés
  - [ ] 1.2 Ajouter og:url avec l'URL canonique
  - [ ] 1.3 S'assurer que chaque page passe des valeurs dynamiques depuis les données CMS
- [ ] Task 2 : Passer par chaque page et vérifier les meta (AC: #1, #2, #3)
  - [ ] 2.1 Vérifier `/artistes/[slug]` : title = "Nom Artiste — Galerie Louis Barrand", og:image = photo artiste
  - [ ] 2.2 Vérifier `/oeuvres/[slug]` : title = "Titre Oeuvre — Galerie", og:image = visuel oeuvre
  - [ ] 2.3 Vérifier `/expositions/[slug]` : title = "Titre Expo — Galerie", og:image = visuel expo
  - [ ] 2.4 Vérifier les pages statiques (accueil, à propos, presse, contact)
- [ ] Task 3 : Configurer le sitemap (AC: #4, #5)
  - [ ] 3.1 Vérifier que `@astrojs/sitemap` est installé (Story 1.1)
  - [ ] 3.2 Configurer dans `astro.config.ts` avec le `site` URL
  - [ ] 3.3 Vérifier que le sitemap est généré au build
  - [ ] 3.4 Vérifier l'accessibilité à `/sitemap-index.xml`

## Dev Notes

### GEO — Meta descriptions factuelles et citables

Les meta descriptions sont un signal important pour le GEO. Les moteurs IA extraient souvent la meta description comme résumé d'une page. Les descriptions DOIVENT être :
- **Factuelles** : données concrètes (dates, techniques, lieux), pas de superlatifs marketing
- **Citables** : rédigées comme une source de référence, pas comme un slogan
- **Spécifiques** : chaque page a une description unique qui décrit précisément son contenu

**Exemples :**
- Bien : "Louis Valtat (1869-1952), peintre fauviste français. Oeuvres disponibles : huiles sur toile, aquarelles. Galerie Louis Barrand, Paris."
- Mal : "Découvrez l'univers fascinant de cet artiste exceptionnel dans notre magnifique galerie."

### Titres — Pattern

```
[Nom Page/Entité] — Galerie Louis Barrand
```

### Prérequis

- Toutes les pages de contenu créées
- SeoHead.astro existe (Story 1.4)
- `@astrojs/sitemap` installé (Story 1.1)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.2]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
