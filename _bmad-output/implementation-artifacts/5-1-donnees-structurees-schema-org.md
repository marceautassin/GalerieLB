# Story 5.1: Données structurées schema.org

Status: ready-for-dev

## Story

As a moteur de recherche (Google) ou IA,
I want des données structurées sur chaque page du site,
so that la galerie, ses artistes et ses oeuvres soient correctement indexés et présentés dans les résultats enrichis.

## Acceptance Criteria

1. Page d'accueil : schema `ArtGallery` (nom, adresse, description, logo)
2. Fiche artiste : schema `Person` (nom, description, image)
3. Fiche oeuvre : schema `VisualArtwork` (titre, artiste, technique, dimensions, image)
4. Fiche exposition : schema `ExhibitionEvent` (titre, dates, lieu, description)
5. Données générées dynamiquement depuis le CMS
6. Schemas validés via Rich Results Test de Google

## Tasks / Subtasks

- [ ] Task 1 : Étendre SeoHead.astro (AC: #1, #2, #3, #4, #5)
  - [ ] 1.1 Ajouter un prop optionnel `schema?: object` ou `schemaType?: string`
  - [ ] 1.2 Rendre un `<script type="application/ld+json">` avec le schema
- [ ] Task 2 : Schema ArtGallery — accueil (AC: #1)
  - [ ] 2.1 Dans `index.astro` : passer le schema ArtGallery à SeoHead
  - [ ] 2.2 Champs : name, description, address, url, logo
- [ ] Task 3 : Schema Person — fiche artiste (AC: #2)
  - [ ] 3.1 Dans `artistes/[slug].astro` : schema Person
  - [ ] 3.2 Champs : name, description, image, url
  - [ ] 3.3 Champs GEO-critiques : birthDate, deathDate (si applicable), nationality — maximiser la citabilité par les IA
- [ ] Task 4 : Schema VisualArtwork — fiche oeuvre (AC: #3)
  - [ ] 4.1 Dans `oeuvres/[slug].astro` : schema VisualArtwork
  - [ ] 4.2 Champs : name, creator (Person), artMedium, width, height, image, url
  - [ ] 4.3 Champs GEO-critiques : dateCreated, width/height avec unité (Distance), artMedium explicite — données factuelles que les IA peuvent citer directement
- [ ] Task 5 : Schema ExhibitionEvent — fiche expo (AC: #4)
  - [ ] 5.1 Dans `expositions/[slug].astro` : schema ExhibitionEvent
  - [ ] 5.2 Champs : name, startDate, endDate, location, description, image
  - [ ] 5.3 Champ GEO-critique : location avec PostalAddress complète (streetAddress, addressLocality, postalCode, addressCountry) — permet aux IA de citer le lieu précis
- [ ] Task 6 : Créer utilitaire seo-utils.ts (AC: #5)
  - [ ] 6.1 Fonctions helper : `buildArtGallerySchema()`, `buildPersonSchema()`, `buildVisualArtworkSchema()`, `buildExhibitionEventSchema()`
  - [ ] 6.2 Chaque fonction prend les données CMS et retourne un objet schema.org

## Dev Notes

### Importance GEO du schema.org complet

Les données structurées schema.org sont un signal majeur pour le GEO (Generative Engine Optimization). Les moteurs IA (ChatGPT, Claude, Perplexity) utilisent ces données pour extraire des informations factuelles citables. Plus les schemas sont complets et spécifiques au domaine de l'art, plus la galerie sera citée avec précision dans les réponses IA.

**Règle : toujours inclure les champs GEO-critiques** même si certains sont optionnels côté schema.org. Un schema `Person` sans `birthDate` ou un `VisualArtwork` sans `dateCreated` sont des opportunités GEO manquées. Si la donnée existe dans le CMS, elle DOIT être dans le schema.

### Exemple schema VisualArtwork (enrichi GEO)

```json
{
  "@context": "https://schema.org",
  "@type": "VisualArtwork",
  "name": "Paysage du Midi",
  "creator": {
    "@type": "Person",
    "name": "Louis Valtat",
    "birthDate": "1869-08-08",
    "nationality": "Française"
  },
  "artMedium": "Huile sur toile",
  "dateCreated": "1920",
  "width": { "@type": "Distance", "name": "65 cm" },
  "height": { "@type": "Distance", "name": "81 cm" },
  "image": "https://s3.../image.webp",
  "url": "https://galerie.../oeuvres/paysage-du-midi"
}
```

### Exemple schema ExhibitionEvent (enrichi GEO)

```json
{
  "@context": "https://schema.org",
  "@type": "ExhibitionEvent",
  "name": "Valtat, le fauve indépendant",
  "startDate": "2026-03-01",
  "endDate": "2026-04-30",
  "location": {
    "@type": "Place",
    "name": "Galerie Louis Barrand",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "...",
      "addressLocality": "Paris",
      "postalCode": "75006",
      "addressCountry": "FR"
    }
  },
  "description": "Exposition consacrée à Louis Valtat...",
  "image": "https://s3.../expo.webp"
}
```

### Prérequis

- Toutes les pages de contenu créées (Stories 2.x, 3.x, 4.3)
- SeoHead.astro existe (Story 1.4)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — SEO, schema.org]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.1]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
