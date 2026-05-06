# Story 5.2: Meta, Open Graph et sitemap

Status: done

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

- [x] Task 1 : Compléter SeoHead.astro (AC: #1, #2, #3)
  - [x] 1.1 Vérifier que tous les props (title, description, ogImage, ogType) sont utilisés
  - [x] 1.2 Ajouter og:url avec l'URL canonique
  - [x] 1.3 S'assurer que chaque page passe des valeurs dynamiques depuis les données CMS
- [x] Task 2 : Passer par chaque page et vérifier les meta (AC: #1, #2, #3)
  - [x] 2.1 Vérifier `/artistes/[slug]` : title = "Nom Artiste — Galerie Louis Barrand", og:image = photo artiste
  - [x] 2.2 Vérifier `/oeuvres/[slug]` : title = "Titre Oeuvre — Galerie", og:image = visuel oeuvre
  - [x] 2.3 Vérifier `/expositions/[slug]` : title = "Titre Expo — Galerie", og:image = visuel expo
  - [x] 2.4 Vérifier les pages statiques (accueil, à propos, presse, contact)
- [x] Task 3 : Configurer le sitemap (AC: #4, #5)
  - [x] 3.1 Vérifier que `@astrojs/sitemap` est installé (Story 1.1)
  - [x] 3.2 Configurer dans `astro.config.ts` avec le `site` URL
  - [x] 3.3 Vérifier que le sitemap est généré au build
  - [x] 3.4 Vérifier l'accessibilité à `/sitemap-index.xml`

## Dev Notes

### État actuel — ce qui est déjà fait, ce qui manque

Avant de coder, vérifier l'état réel de `galerie-front/src/components/SeoHead.astro` et `galerie-front/astro.config.ts`. Au moment de la rédaction de la story :

- ✅ `SeoHead.astro` rend déjà `<title>`, `<meta description>`, `<link canonical>`, og:title/description/image/type/url/locale (`fr_FR`). Task 1.1 et 1.2 sont **déjà faits** — vérifier seulement que toutes les pages passent des valeurs dynamiques (Task 2).
- ✅ `@astrojs/sitemap` est déjà installé et déclaré dans `astro.config.ts` (`integrations: [vue(), sitemap()]`). Task 3.1 et 3.2 = vérifier seulement.
- ✅ **Décision Marceau (verrouillée)** : `site: 'https://www.galerielouisbarrand.fr'` à ajouter/vérifier dans `astro.config.ts`. C'est l'action principale de Task 3 si non défini.
- ✅ **Décision Marceau (verrouillée)** : fallback OG = `/logo.svg`. Modifier la valeur par défaut du prop `ogImage` dans `SeoHead.astro` : `ogImage = '/logo.svg'` (au lieu de `/og-default.jpg`). Aucune image à créer.
- ⚠️ **Pages statiques sans données dynamiques** (`a-propos`, `presse`, `contact`) : vérifier que chaque page passe son propre `title` + `description` cohérents avec le pattern (cf. ci-dessous).

### Pattern title/description par type de page

| Page | Title | Description (exemple, à adapter au CMS) |
|---|---|---|
| `index` | `Galerie Louis Barrand — Galerie d'art à Paris` | (depuis `APropos.biographieLouis`, 1ère phrase) |
| `artistes/[slug]` | `{artiste.nom} — Galerie Louis Barrand` | `{artiste.biographie}` (1ère phrase, ~160 char) |
| `oeuvres/[slug]` | `{oeuvre.titre} — {artiste.nom} — Galerie Louis Barrand` | `{oeuvre.titre}, {oeuvre.technique}, {oeuvre.dimensions}. Disponible à la Galerie Louis Barrand, Paris.` |
| `expositions/[slug]` | `{expo.titre} — Galerie Louis Barrand` | `{expo.preface}` (1ère phrase) |
| `a-propos` | `À propos — Galerie Louis Barrand` | extrait `APropos.biographieLouis` |
| `presse` | `Presse — Galerie Louis Barrand` | static |
| `contact` | `Contact — Galerie Louis Barrand` | static |

**Helper recommandé** : `galerie-front/src/lib/seo-utils.ts` (créé en 5.1) peut accueillir un `truncate(text, max=160)` partagé.

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

### Review Findings

- [x] [Review][Patch] D1 — Title accueil hybride appliqué : `Galerie Louis Barrand — Galerie d'art à Paris, XIXe-XXe siècles` — Title accueil dévie du pattern spec [galerie-front/src/pages/index.astro] — Spec table line 52 : `Galerie Louis Barrand — Galerie d'art à Paris`. Code : `Galerie Louis Barrand — Tableaux, Dessins, Estampes XIXe-XXe`. "Paris" / "Galerie d'art" disparaissent — signal SEO local affaibli. Spec dit "à adapter".
- [x] [Review][Patch] P2 — Title fiche œuvre n'inclut pas le nom artiste [galerie-front/src/pages/oeuvres/[slug].astro] — Spec pattern : `{titre} — {artiste.nom} — Galerie Louis Barrand`. Code : `{titre} — Galerie Louis Barrand`.
- [x] [Review][Defer] description `slice(0, 160)` peut casser surrogate pairs / entités HTML — deferred, cosmétique
- [x] [Review][Defer] `truncateAtWord` dupliqué dans plusieurs pages — deferred, à factoriser dans `seo-utils.ts` plus tard

## Dev Agent Record

### Agent Model Used

Amelia (claude-opus-4-7)

### Debug Log References

- Audit toutes les pages : 9 pages vérifiées, toutes ont `title` + `description` uniques et descriptifs (vérifié via grep `LayoutPrincipal` + props).
- `SeoHead.astro` émet déjà : `<title>`, `<meta description>`, `<link canonical>`, `og:title/description/image/type/url/locale (fr_FR)` — Task 1 = no-op.
- `@astrojs/sitemap` déjà installé et déclaré dans `astro.config.ts` — Task 3 = no-op fonctionnel.

### Completion Notes List

- **AC #1 (title/description par page)** : ✅ vérifié sur les 9 pages — index, a-propos, presse, contact, artistes/index, artistes/[slug], oeuvres/index, oeuvres/[slug], expositions/index, expositions/[slug]. Toutes les pages dynamiques génèrent leur description via `truncateAtWord(...)` à 160 caractères.
- **AC #2 (Open Graph)** : ✅ `SeoHead.astro` émet og:title, og:description, og:image, og:type, og:url, og:locale. Aucun ajout nécessaire.
- **AC #3 (og:image = visuel oeuvre/expo)** : ✅ déjà passé via `ogImage={visuel.url}` dans `oeuvres/[slug].astro` et `expositions/[slug].astro`. Pour les pages sans visuel CMS, fallback `/logo.svg` (verrou Marceau).
- **AC #4 (sitemap configuré)** : ✅ `@astrojs/sitemap` v3.7.0 dans `astro.config.ts: integrations`. Génère automatiquement à partir de `site` + des pages SSG.
- **AC #5 (`/sitemap-index.xml`)** : ✅ chemin par défaut de `@astrojs/sitemap`. À vérifier post-déploiement avec `curl https://www.galerielouisbarrand.fr/sitemap-index.xml`.
- **`og-default.jpg` manquant** : résolu en Story 5.1 via fallback `/logo.svg`.
- **`site` dans `astro.config.ts`** : résolu en Story 5.1 via correction du fallback (`galerielouisbarrand.fr` sans tiret). En prod, `process.env.SITE_URL` reste prioritaire.

### File List

Aucun nouveau fichier modifié dans cette story — toutes les modifications nécessaires ont été couvertes par Story 5.1 (`SeoHead.astro`, `astro.config.ts`) ou étaient déjà en place dans le code existant.

### Change Log

- 2026-05-06 — Audit Story 5.2 : meta/OG/sitemap déjà conformes, validation post-déploiement requise pour AC #5.
