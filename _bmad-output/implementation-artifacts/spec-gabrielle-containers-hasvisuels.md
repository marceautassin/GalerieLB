---
title: 'Filtre hasVisuels + système 3-containers'
type: 'feature'
created: '2026-05-07'
status: 'done'
baseline_commit: '54fe79252f033185f2e272b84de0933aac17dabb'
context:
  - '_bmad/_memory/art-director-sidecar/audit-2026-05-07.md'
  - '_bmad/_memory/art-director-sidecar/specs-2026-05-07.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Deux fondations manquantes avant toute refonte de page : (1) les listes d'œuvres affichent des dizaines de placeholders gris (œuvres sans visuel chargées comme tout le reste), ce qui casse instantanément la promesse de prestige sur `/oeuvres`, `/`, `/artistes/[slug]` ; (2) une largeur unique `--max-width: 1280px` est appliquée à tous les contextes, empêchant les pages d'orchestrer plusieurs registres (œuvre plein cadre vs lecture éditoriale vs grille).

**Approach:** Ajouter un filtre `hasVisuels` au client Strapi (n'affecte que les appels qui le demandent), puis introduire 4 nouveaux tokens de largeur (`--w-bleed`, `--w-edge`, `--w-prose`, `--w-nav`) et leurs classes utilitaires `.container--*` dans `global.css`, **sans toucher aux pages existantes** ni supprimer `--max-width`. Les pages migrent dans des PRs successifs.

## Boundaries & Constraints

**Always:**
- Non-breaking pour les pages existantes : `--max-width` reste défini, le `<div class="container">` du layout reste en place
- Tokens existants (`--color-*`, `--space-*`, `--font-*`, `--transition-*`) inchangés
- `fetchOeuvres()` sans option garde son comportement actuel (rétro-compatibilité)
- Chaque appel existant à `fetchOeuvres()` est revu pour décider explicitement s'il doit utiliser `hasVisuels: true` (l'accueil oui, le sitemap/getStaticPaths non)

**Ask First:**
- Suppression de `--max-width` du `:root` — **ne pas** la faire dans cette spec, attendre que toutes les pages soient migrées (spec future)

**Never:**
- Ne pas modifier `LayoutPrincipal.astro` (la migration du `<div class="container">` se fera dans les specs de pages)
- Ne pas modifier les pages `index.astro`, `a-propos.astro`, `oeuvres/[slug].astro`, `artistes/[slug].astro`, `expositions/[slug].astro`, `presse.astro`, `contact.astro`
- Ne pas refactorer les composants `CarteOeuvre`, `CarteArtiste`, `Lightbox`
- Ne pas ajouter de package npm

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| `fetchOeuvres()` (sans option) | Strapi a 50 œuvres dont 35 sans visuel | Retourne 50 œuvres (compat) | N/A |
| `fetchOeuvres({ hasVisuels: true })` | Idem | Retourne 15 œuvres (celles avec ≥1 visuel) | N/A |
| `fetchOeuvres({ hasVisuels: true, sort, limit })` | Idem | Filtres combinés | N/A |
| Page utilisant `.container--edge` en 1920px | viewport 1920 | Container max 1760px, padding latéral 48px | N/A |
| Page utilisant `.container--prose` en 1920px | viewport 1920 | Container max 720px, centré | N/A |
| Page utilisant `.container--bleed` | viewport quelconque | Container 100vw, sort de tout parent flux | N/A |
| Page utilisant `.container--prose` en 375px | viewport 375 | 92vw soit ~345px, padding `clamp(16px, 4vw, 48px)` | N/A |

</frozen-after-approval>

## Code Map

- `galerie-front/src/lib/strapi-client.ts` -- ajouter param `hasVisuels` à `fetchOeuvres()`, réutilisable par tous les appelants
- `galerie-front/src/styles/global.css` -- ajouter tokens `--w-*` + `--gutter` + classes `.container--*`. **Conserver `--max-width` existant.**

## Tasks & Acceptance

**Execution:**

- [ ] `galerie-front/src/lib/strapi-client.ts` -- Ajouter param optionnel `hasVisuels?: boolean` à la signature de `fetchOeuvres({ sort, limit, hasVisuels })`. Si `hasVisuels === true`, ajouter `&filters[visuels][$notNull]=true` à la query. Ne pas modifier les autres fonctions.
- [ ] `galerie-front/src/styles/global.css` -- Sous le commentaire `/* Layout */` (ligne ~36), **ajouter** (sans supprimer `--max-width`) : `--w-bleed: 100vw; --w-edge: min(96vw, 1760px); --w-prose: min(92vw, 720px); --w-nav: min(94vw, 1440px); --gutter: clamp(16px, 4vw, 48px);`. **En fin de fichier**, ajouter un nouveau bloc `/* ---------- Containers utilitaires ---------- */` définissant les 4 classes `.container--bleed/edge/prose/nav` avec les règles spécifiées dans `specs-2026-05-07.md` §SPEC 1 ("Containers utilitaires"). Le sélecteur `.container` (sans modifier) reçoit la même règle que `.container--nav`.

**Acceptance Criteria:**

- Given un dev appelle `fetchOeuvres({ hasVisuels: true })`, when la requête s'exécute contre une instance Strapi, then seules les œuvres ayant au moins un media dans `visuels` sont retournées.
- Given un dev appelle `fetchOeuvres()` sans option, when la requête s'exécute, then le résultat est identique à avant la modification (toutes les œuvres publiées sont retournées).
- Given une page existante (ex: `index.astro` non modifiée), when la build s'exécute, then la page rend exactement comme avant (rétro-compat totale).
- Given un dev applique `class="container--edge"` à une nouvelle section, when la page est rendue en 1920px, then la section a une largeur max de 1760px et est centrée avec padding latéral entre 16 et 48px.
- Given un dev applique `class="container--prose"` à une nouvelle section, when la page est rendue en 1920px, then la section a une largeur max de 720px et est centrée.
- Given un dev applique `class="container--bleed"` à une section, when la page est rendue, then la section occupe 100vw et "sort" de son container parent (technique `margin-inline: calc(50% - 50vw)`).

## Spec Change Log

<!-- Empty until first review loop -->

## Verification

**Commands:**
- `pnpm --dir galerie-front astro check` -- expected: 0 erreurs, 0 warnings
- `pnpm --dir galerie-front build` -- expected: build success
- `pnpm --dir galerie-front dev` puis ouvrir http://localhost:4321/ -- expected: la page accueil rend identiquement à la version live (aucune régression visuelle)

**Manual checks:**
- Capturer `/`, `/oeuvres`, `/a-propos` en 1920×1080 et comparer avec les screenshots de l'audit (`home-1920.jpeg`, `oeuvres-1920.jpeg`, `apropos-1920.jpeg`) — les rendus doivent être **strictement identiques** (cette spec est non-breaking)
- Vérifier dans le devtool Inspector que les classes `.container--edge/prose/bleed/nav` sont bien définies et que leurs `max-width` se résolvent aux valeurs attendues sur 1920 et 768
- Tester manuellement sur une page de demo (créer une route temporaire ou utiliser le dev tool) que `<section class="container--edge">` se comporte comme attendu

## Suggested Review Order

**Filtre `hasVisuels` côté API client**

- Entrée du changement : signature de `fetchOeuvres` et logique de filtre Strapi.
  [`strapi-client.ts:73`](../../galerie-front/src/lib/strapi-client.ts#L73)

- Filtre exclut œuvres sans visuel via clé scalaire `id` du media multiple (correction de review).
  [`strapi-client.ts:84`](../../galerie-front/src/lib/strapi-client.ts#L84)

**Système 3-containers (tokens + classes)**

- 5 nouveaux tokens layout côtoient `--max-width` existant (non-breaking).
  [`global.css:38`](../../galerie-front/src/styles/global.css#L38)

- `.container` aliasé avec `.container--nav` pour migration progressive.
  [`global.css:196`](../../galerie-front/src/styles/global.css#L196)

- `.container--edge` / `--prose` : largeurs orchestrées avec `min()`.
  [`global.css:204`](../../galerie-front/src/styles/global.css#L204)

- `.container--bleed` : technique `margin-inline: calc(50% - 50vw)` pour sortir du flux.
  [`global.css:217`](../../galerie-front/src/styles/global.css#L217)

