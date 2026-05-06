# Story 5.1: Données structurées schema.org

Status: done

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

- [x] Task 1 : Étendre SeoHead.astro (AC: #1, #2, #3, #4, #5)
  - [x] 1.1 Ajouter un prop optionnel `schema?: object` ou `schemaType?: string`
  - [x] 1.2 Rendre un `<script type="application/ld+json">` avec le schema
- [x] Task 2 : Schema ArtGallery — accueil (AC: #1)
  - [x] 2.1 Dans `index.astro` : passer le schema ArtGallery à SeoHead
  - [x] 2.2 Champs : name, description, address, url, logo
- [x] Task 3 : Schema Person — fiche artiste (AC: #2)
  - [x] 3.1 Dans `artistes/[slug].astro` : schema Person
  - [x] 3.2 Champs : name, description, image, url
  - [x] 3.3 Champs GEO-critiques : birthDate, deathDate (si applicable), nationality — maximiser la citabilité par les IA
- [x] Task 4 : Schema VisualArtwork — fiche oeuvre (AC: #3)
  - [x] 4.1 Dans `oeuvres/[slug].astro` : schema VisualArtwork
  - [x] 4.2 Champs : name, creator (Person), artMedium, width, height, image, url
  - [x] 4.3 Champs GEO-critiques : dateCreated, width/height avec unité (Distance), artMedium explicite — données factuelles que les IA peuvent citer directement
- [x] Task 5 : Schema ExhibitionEvent — fiche expo (AC: #4)
  - [x] 5.1 Dans `expositions/[slug].astro` : schema ExhibitionEvent
  - [x] 5.2 Champs : name, startDate, endDate, location, description, image
  - [x] 5.3 Champ GEO-critique : location avec PostalAddress complète (streetAddress, addressLocality, postalCode, addressCountry) — permet aux IA de citer le lieu précis
- [x] Task 6 : Créer utilitaire seo-utils.ts (AC: #5)
  - [x] 6.1 Fonctions helper : `buildArtGallerySchema()`, `buildPersonSchema()`, `buildVisualArtworkSchema()`, `buildExhibitionEventSchema()`
  - [x] 6.2 Chaque fonction prend les données CMS et retourne un objet schema.org

## Dev Notes

### ⚠️ CRITIQUE — Champs CMS réellement disponibles

Avant de coder, lire `galerie-front/src/types/strapi.ts`. **Plusieurs champs "GEO-critiques" listés dans les exemples ci-dessous n'existent PAS dans le schéma Strapi actuel.** Ne PAS inventer, ne PAS interroger des champs inexistants. Mapping réel :

| Schema.org cible | Champ CMS existant | Champ CMS manquant (NE PAS utiliser) |
|---|---|---|
| `Person.name` | `Artiste.nom` | — |
| `Person.description` | `Artiste.biographie` | — |
| `Person.image` | `Artiste.photo` (StrapiMedia) | — |
| `Person.birthDate` / `deathDate` / `nationality` | ❌ aucun | ⚠️ NE PAS extraire de la bio en regex — laisser vide |
| `VisualArtwork.name` | `Oeuvre.titre` | — |
| `VisualArtwork.creator` | `Oeuvre.artiste` (relation) | — |
| `VisualArtwork.artMedium` | `Oeuvre.technique` (string) | — |
| `VisualArtwork.dateCreated` | ❌ aucun | ⚠️ laisser vide |
| `VisualArtwork.width` / `height` | `Oeuvre.dimensions` (string libre, ex: "65 × 81 cm") | ⚠️ pas de width/height séparés — sortir la string brute en `description` ou parser uniquement si format strict |
| `VisualArtwork.image` | `Oeuvre.visuels[0]` (StrapiMedia) | — |
| `ExhibitionEvent.name` | `Exposition.titre` | — |
| `ExhibitionEvent.startDate` / `endDate` | `Exposition.dateDebut` / `dateFin` | — |
| `ExhibitionEvent.description` | `Exposition.preface` | — |
| `ExhibitionEvent.location` | `APropos.adresse` (string libre, singleton) | ⚠️ pas de PostalAddress structurée — sortir l'adresse en `Place.address` (PostalAddress) en parsant ou en hardcodant `addressLocality: "Paris"`, `addressCountry: "FR"` |
| `ArtGallery.address` | `APropos.adresse` (idem) | — |

**Règle stricte** : pour les champs CMS manquants, NE PAS inclure la propriété dans le JSON-LD plutôt que d'inventer. `schema.org` accepte des objets partiels.

**Décision Marceau (verrouillée)** : on accepte des **schemas partiels**. Pour les champs CMS manquants, ne PAS inclure la propriété dans le JSON-LD. Pas de parsing best-effort, pas de regex sur la bio. Les champs absents seront ajoutés au CMS dans une story future si besoin.

**URL site (verrouillée)** : `https://www.galerielouisbarrand.fr` — utiliser cette base pour les URLs absolues dans les schemas.

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

### État actuel du code

**SeoHead.astro** (`galerie-front/src/components/SeoHead.astro`) existe et accepte déjà `title`, `description`, `ogImage`, `ogType`, `canonicalUrl`. **Il n'a PAS de prop pour le JSON-LD** — Task 1 doit ajouter un prop `schema?: object | object[]` puis rendre `<script type="application/ld+json" set:html={JSON.stringify(schema)} />` après les meta OG.

**Pages où injecter les schemas** (chemins exacts) :
- `galerie-front/src/pages/index.astro` → ArtGallery (singleton APropos pour adresse/email)
- `galerie-front/src/pages/artistes/[slug].astro` → Person
- `galerie-front/src/pages/oeuvres/[slug].astro` → VisualArtwork
- `galerie-front/src/pages/expositions/[slug].astro` → ExhibitionEvent

**Helpers à créer** : `galerie-front/src/lib/seo-utils.ts` (un seul fichier, 4 fonctions pures `buildXSchema(data) → object`). Utiliser les types de `galerie-front/src/types/strapi.ts` en import.

**URL du site** : récupérer via `Astro.site` (configuré dans `astro.config.ts`). Pour les images, préfixer `Astro.site` au `url` de la `StrapiMedia` si l'URL Strapi est relative ; vérifier le format renvoyé par le client (`galerie-front/src/lib/strapi-client.ts`).

### Prérequis

- Toutes les pages de contenu créées (Stories 2.x, 3.x, 4.3) — ✅ done
- SeoHead.astro existe (Story 1.4) — ✅ done

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — SEO, schema.org]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.1]

### Review Findings

- [x] [Review][Decision] D2 (résolu : garder `provenance` — donnée GEO de valeur) — `VisualArtwork.description` inclut `oeuvre.provenance` non listé dans le mapping CMS→schema.org de la spec (table lignes 50-66). Le champ existe au CMS mais n'a pas été validé par la décision verrouillée "schemas partiels". Inclure ou retirer ?
- [x] [Review][Patch] P-D3 — Parser `apropos.adresse` multi-ligne en `PostalAddress` structuré [seo-utils.ts] (résolu : split sur `\n` → streetAddress / addressLocality / addressCountry, postalCode omis car absent en DB) ; D3 originel — `ExhibitionEvent.location.address.streetAddress` reçoit `apropos.adresse` (probable adresse complète "12 rue X, 75006 Paris") + `addressLocality: "Paris"` hardcodé → duplication ville. Spec ambigu ("parser ou hardcoder"). Garder hardcode + tronquer, parser, ou n'utiliser qu'`address` plain string ?
- [x] [Review][Patch] P1 — 🚨 XSS JSON-LD via `</script>` non échappé [galerie-front/src/components/SeoHead.astro:51-53] — `JSON.stringify` n'échappe pas `</script>`/`<!--`/`<![CDATA[`. Donnée CMS contenant ces séquences → break du script tag → injection HTML/JS. Fix : remplacer `<` par `<` après `JSON.stringify`.
- [x] [Review][Patch] P3 — Images Strapi en JSON-LD potentiellement relatives [galerie-front/src/lib/seo-utils.ts] — `image: visuel?.url`, `image: artiste.photo?.url`, `logo` etc. émis sans `absoluteUrl()`. Strapi en storage local renvoie `/uploads/...`. Schema.org rejette URLs relatives.
- [x] [Review][Patch] P4 — `Astro.site` undefined → `siteUrl=""` silencieux [seo-utils.ts + 4 pages] — produit URLs JSON-LD relatives invalides. Ajouter assertion build-time ou fallback verrouillé.
- [x] [Review][Patch] P5 — `absoluteUrl` `startsWith('http')` faillible [galerie-front/src/lib/seo-utils.ts:12] — matche `httpfoo`, rate `//cdn`. Utiliser `/^https?:\/\//` ou `new URL(url, siteUrl).href`.
- [x] [Review][Patch] P6 — `ArtGallery.address` string brute, incohérent avec `ExhibitionEvent.location.address` [seo-utils.ts buildArtGallerySchema] — utiliser un `PostalAddress` cohérent.
- [x] [Review][Patch] P7 — `compact()` ne strip pas arrays/objets vides [galerie-front/src/lib/seo-utils.ts:6-10] — `sameAs: []` et `PostalAddress` semi-vides restent. Étendre la fonction ou filtrer en amont.
- [x] [Review][Patch] P9 — Normalisation siteUrl dupliquée 5× (violation DRY/CLAUDE.md) [index.astro, artistes/[slug].astro, oeuvres/[slug].astro, expositions/[slug].astro, SeoHead.astro] — `Astro.site?.toString().replace(/\/$/, '') ?? ''` répété. Centraliser dans `seo-utils.ts` ou `base-url.ts`.
- [x] [Review][Defer] `creator.url` slug vide → `/artistes/` [seo-utils.ts:63] — deferred, dépend du lifecycle hook slugify
- [x] [Review][Defer] `logo.svg` comme `ArtGallery.logo` — deferred, verrou Marceau (Google préfère raster mais décision produit)
- [x] [Review][Defer] `instagram`/`linkedin` non normalisés (URL ou handle) [seo-utils.ts:34] — deferred, validation CMS
- [x] [Review][Patch] P11 — `buildPersonSchema.description` strippe désormais le HTML (cohérence avec ExhibitionEvent)
- [x] [Review][Patch] P12 — `stripHtml` décode entités numériques `&#NNN;`/`&#xHH;` + commentaires HTML
- [x] [Review][Defer] `parseAdresse` brittle si format DB change (1-ligne / 4+ lignes / 2-lignes ambiguë) — deferred, format DB actuel verrouillé sur 3 lignes
- [x] [Review][Defer] `ExhibitionEvent.startDate` non validé ISO — deferred, types TS contraignent
- [x] [Review][Defer] `email`/`telephone` sans schémas `mailto:`/`tel:` — deferred, optimisation
- [x] [Review][Defer] `VisualArtwork.image` ne supporte qu'1 visuel (Schema.org accepte array) — deferred, futur enrichissement

## Dev Agent Record

### Agent Model Used

Amelia (claude-opus-4-7)

### Debug Log References

- `npx astro build` compile sans erreur (vite client + transform SSG). Échec runtime au fetch Strapi attendu (CMS local non lancé) — non bloquant pour cette story.
- Pas de framework de tests configuré dans `galerie-front/package.json`. Validation faite par compilation Astro et inspection manuelle des helpers (fonctions pures avec `compact()` qui élimine les champs vides).

### Completion Notes List

- **Helpers `seo-utils.ts`** : 4 builders purs (`buildArtGallerySchema`, `buildPersonSchema`, `buildVisualArtworkSchema`, `buildExhibitionEventSchema`) qui prennent les données CMS et retournent des objets JSON-LD. Une fonction `compact()` élimine les champs `null`/`undefined`/`""` pour respecter la décision "schemas partiels".
- **`SeoHead.astro`** : nouveau prop optionnel `schema?: object | object[]`. Rendu via `<script type="application/ld+json" is:inline set:html={JSON.stringify(schema)}>` (avec `is:inline` pour empêcher Astro de hash le script).
- **`LayoutPrincipal.astro`** : forward du prop `schema` vers SeoHead.
- **Fallback OG** changé de `/og-default.jpg` → `/logo.svg` (verrou Marceau).
- **`astro.config.ts`** : fallback `SITE_URL` corrigé `galerie-louisbarrand.fr` → `galerielouisbarrand.fr` (sans tiret, verrou Marceau). En prod, la variable d'env `SITE_URL` reste prioritaire.
- **Page expositions** : ajout d'un `fetchAPropos()` pour récupérer l'adresse et l'injecter dans `Place.address.streetAddress`. `addressLocality: "Paris"` et `addressCountry: "FR"` sont hardcodés dans le helper.
- **Champs CMS manquants ignorés** comme prévu : `birthDate`/`deathDate`/`nationality` pour `Person`, `dateCreated`/`width`/`height` séparés pour `VisualArtwork`. Les `dimensions` (string libre) sont injectées dans le `description` du VisualArtwork pour rester citables par les IA, sans inventer de parsing.
- **Validation Rich Results Test (AC #6)** : à faire après déploiement sur `https://www.galerielouisbarrand.fr` — Marceau peut tester via [search.google.com/test/rich-results](https://search.google.com/test/rich-results) sur les 4 types de pages.

### File List

- `galerie-front/src/lib/seo-utils.ts` (créé)
- `galerie-front/src/components/SeoHead.astro` (modifié — ajout prop `schema` + script JSON-LD + fallback OG → /logo.svg)
- `galerie-front/src/layouts/LayoutPrincipal.astro` (modifié — forward prop `schema`)
- `galerie-front/src/pages/index.astro` (modifié — schema ArtGallery)
- `galerie-front/src/pages/artistes/[slug].astro` (modifié — schema Person)
- `galerie-front/src/pages/oeuvres/[slug].astro` (modifié — schema VisualArtwork)
- `galerie-front/src/pages/expositions/[slug].astro` (modifié — schema ExhibitionEvent + fetchAPropos)
- `galerie-front/astro.config.ts` (modifié — fallback SITE_URL corrigé)

### Change Log

- 2026-05-06 — Implémentation Story 5.1 : données structurées schema.org sur 4 types de pages via helpers purs.
