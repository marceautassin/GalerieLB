# Deferred Work

## Deferred from: code review of spec-oeuvre-fiche-polish (2026-05-08)

- **Filtre `$notNull` sur relation media v5** : `filters[visuels][id][$notNull]=true` est utilisé dans `fetchOeuvresByArtiste` pour masquer les œuvres sans visuel. Le pattern fonctionne en prod (déjà utilisé par `fetchOeuvres` du home avec `hasVisuels: true`), mais reste non-documenté côté Strapi v5 pour les relations media. À durcir avec un filtre côté JS post-fetch si un bug est un jour observé.
- **N+1 requests au build SSG** : la page `oeuvres/[slug].astro` exécute `fetchOeuvresByArtiste` pour chaque œuvre du catalogue → 1 requête API par fiche × ~100 œuvres = 100 requêtes série au build. Acceptable aujourd'hui mais à surveiller si le build dépasse 30 s. Mitigation : pré-fetcher tous les artistes une fois dans `getStaticPaths` et passer la liste en props.
- **Contraste `--color-mur` vs `--color-bg`** : `#fffcf7` vs `#faf8f5` = différence très subtile (≈ 1% sur la luminosité). Le design veut une variation chaude perceptible derrière l'image. À évaluer visuellement en prod ; si imperceptible, soit augmenter l'écart (ex. `#fffaf0`), soit retirer le wrapper et laisser l'image flotter sur `--color-bg`.
- **XSS potentiel sur `oeuvre.slug` dans `href`** : `href={url(\`/contact?oeuvre=${oeuvre.slug}\`)}` injecte le slug brut. Préexistant à cette spec mais surfacé par la review. À durcir avec `encodeURIComponent(oeuvre.slug)` lors d'une passe sécurité (idem dans tous les `href` qui interpolent des champs Strapi).

---

## Defered le 2026-05-08 — Bord de cas page À propos (post-review)

Findings classés `defer` car tolérables en pratique (Louis maîtrise la saisie éditoriale et ne va pas exploiter ces edge cases).

- **Accroche très longue** : pas de limite verticale (`max-width: 28em` borne juste la largeur). Si Louis colle un paragraphe dans le champ accroche, mur italique avant le contenu. Mitigation possible : `line-clamp` 3 lignes ou validation côté CMS (max 280 caractères).
- **Accroche avec `\n` (sauts de ligne)** : `type: text` Strapi autorise les sauts mais le rendu `<p class="accroche">` n'a pas `white-space: pre-line` — les retours sont écrasés en espaces. À ajouter si Louis veut des retours.
- **Photo Louis source < 520 px** : Astro upscale à `width=520` × densités [1, 2, 3] = jusqu'à 1560 px générés. Aucun garde-fou. Mitigation : préciser dans le guide CMS qu'il faut une photo source ≥ 1500 px (cf. `Guide-CMS-Galerie-Louis-Barrand.docx`).
- **Citation contenant listes/blockquote Markdown** : `<RichText>` les autorise mais le styling `font-family: heading italique` sur listes est inadapté, et un `<blockquote>` imbriqué dans `<blockquote class="citation">` est sémantiquement douteux. Si Louis fait ça volontairement, surcharger le scope `.citation-texte ul/ol/blockquote` ou restreindre la whitelist Markdown du composant Citation.

---

## Defered le 2026-05-08 — Durcissement composant `<RichText>` (post-review)

Findings de la review adversariale de la spec `rich-text-cms` (blind + edge case hunters), classés `defer` car bord de cas et impact faible — Louis ne saisit que du Markdown éditorial classique.

### Robustesse de la regex post-process des liens
Dans `RichText.astro`, la regex qui ajoute `target="_blank" rel="noopener noreferrer"` est `/<a href="(https?:\/\/[^"]+)"/g`. Limites identifiées :
- Si `marked` change l'ordre des attributs (ex: `<a title="x" href="...">`), la regex ne matche plus → pas d'ajout `target/rel`. Aujourd'hui marked v18 émet bien `href` en premier, mais c'est fragile.
- URL contenant un guillemet échappé (`https://x.com/?q="evil`) : la regex tronque au premier `"`. Cas extrême, lien cassé silencieusement.
- Pas d'ajout de `target/rel` sur `mailto:` / `tel:` (volontaire — comportement OK).
- **Action** : remplacer la regex par un walker DOM (`linkedom` ou DOMPurify hook `uponSanitizeAttribute`) lors d'une passe sécurité.

### Vérification du filtre URI DOMPurify
DOMPurify v3 bloque `javascript:` / `data:` / `vbscript:` par défaut via `ALLOWED_URI_REGEXP`, mais ce n'est pas explicite dans la config. À confirmer par un test d'injection (`[click](javascript:alert(1))`) après mise en prod.

### Régression potentielle sur `exposition.preface`
Le rendu précédent utilisait `set:html` brut → si une préface en base contient du HTML inline (ex: `<h2>`, `<img>`, `<iframe>`), elle est désormais strippée par DOMPurify. Marceau a testé en local et validé visuellement, mais surveiller en prod sur les anciennes expositions.

---

## Defered le 2026-05-07 — Findings de review spec `gabrielle-containers-hasvisuels`

Surfacés par les 3 reviewers (blind / edge / acceptance) lors du step-04. Classés `defer` car non causés par cette spec ou explicitement hors scope.

### Mitigation `100vw` scrollbar
- `--w-bleed: 100vw` et `.container--bleed { width: 100vw; margin-inline: calc(50% - 50vw) }` peuvent provoquer une scrollbar horizontale parasite (~15px) sur navigateurs à scrollbar classique (Windows/Linux non-overlay).
- **Mitigation à prévoir** : ajouter `overflow-x: clip` sur `body` (ou `html`) dans `global.css` lors de la prochaine spec qui touche le layout. Pattern déjà utilisé par `index.astro` actuel sans poser problème (à confirmer en QA).
- Sources : Blind hunter §2, Edge hunter §6.

### Browserslist non déclaré
- `package.json` (galerie-front) ne déclare pas de `browserslist`. Les nouvelles propriétés (`min()`, `clamp()`, `margin-inline`) requièrent Safari ≥ 14.1 et autres modernes.
- **Action** : déclarer `browserslist` explicite dans `package.json`, ou documenter le support cible dans `architecture.md`.
- Source : Edge hunter §5.

### Injection query string sur `sort` / `limit` (pré-existant)
- Dans `strapi-client.ts:fetchOeuvres`, les params `options.sort` et `options.limit` sont concaténés bruts dans la query (`&sort=${options.sort}`). Pas exploitable depuis le contenu Strapi (les valeurs viennent du code), mais pratique de durcissement.
- **Action** : `encodeURIComponent()` sur les valeurs dans une passe sécurité dédiée.
- Source : Blind hunter §3.

---

## Defered le 2026-05-07 — Refontes de pages (suite spec gabrielle-refonte-prestige)

Les 3 livrables suivants étaient initialement prévus dans une spec unique, splittés au CHECKPOINT 1 pour respecter la budget de 1600 tokens. Source design : `_bmad/_memory/art-director-sidecar/specs-2026-05-07.md`.

Chaque livrable est shippable indépendamment **après** que la spec courante (3-containers + hasVisuels) soit mergée — les containers `--w-edge`, `--w-prose`, `--w-bleed` sont une dépendance dure.

### Goal A — Refonte page d'accueil (`spec-accueil-overlay-hero.md`)
- Hero passe de grid 3fr/2fr à plein cadre avec texte en overlay (bottom-left)
- Suppression de l'overlay desktop sur `CarteOeuvre` (info toujours visible sous l'image)
- Ajout ligne éditoriale `prose` entre hero et grille
- Grille acquisitions wrappée dans `container--edge`
- CTA "Voir toutes les œuvres" en lien souligné (pas pill noir)
- Source : `specs-2026-05-07.md` §SPEC 2

### Goal B — Refonte page À propos (`spec-a-propos-editorial.md`)
- Titre H1 aligné gauche (suppression `text-align: center`)
- Photo Louis Barrand agrandie ~480-520px wide en grid 3fr/5fr
- Nouveau champ Strapi `citation` (component `texte` + `auteur`) sur singleType `a-propos` — **demande validation Marceau avant ajout schéma**
- Section "La galerie" rythme 1 grande + 2 petites (au lieu de 3 égales)
- Sections wrappées dans `container--edge` ou `container--prose` selon contexte
- Suppression dépendance `--max-width` ligne 309
- Source : `specs-2026-05-07.md` §SPEC 3

### Goal C — Refonte page Œuvre fiche (`spec-oeuvre-fiche-polish.md`)
- CTA "Prendre rendez-vous" : pill noir → lien souligné fin avec accent `#3B5441` au hover
- Méta `<dl>` polishing (already partial)
- Fond `--color-mur: #FFFCF7` derrière l'image œuvre (effet mur galerie)
- Nouvelle section "Du même artiste" en bas (4 vignettes max, condition ≥ 2 œuvres avec visuel)
- Nouvelle fonction `fetchOeuvresByArtiste(slug, opts)` dans `strapi-client.ts`
- Source : `specs-2026-05-07.md` §SPEC 4

### Ordre recommandé
1. Spec courante (containers + hasVisuels) → mergée d'abord
2. Goal A (accueil) → impact visuel maximum
3. Goal C (œuvre fiche) → polish rapide
4. Goal B (À propos) → le plus complexe (nouveau champ Strapi)
