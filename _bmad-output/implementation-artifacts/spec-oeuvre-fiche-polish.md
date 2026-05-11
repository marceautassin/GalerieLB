---
title: 'Polish page Œuvre fiche (Goal C)'
type: 'feature'
created: '2026-05-08'
status: 'done'
baseline_commit: '4c789e2'
context:
  - '_bmad/_memory/art-director-sidecar/specs-2026-05-07.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La fiche œuvre `/oeuvres/[slug]` est la page la plus critique du site (rendre la rencontre visiteur ↔ œuvre). Aujourd'hui : CTA "Prendre rendez-vous" rendu en pill noir capitales (forme SaaS, pas galerie), image œuvre flottant directement sur le `--color-bg` sans simuler le mur de galerie, méta techniques en grid trop serré, et **rien après le bloc méta** — pas de relance curatoriale (œuvres du même artiste). Cohérence d'ensemble manquante avec les commits récents (containers `--edge`, accent `#3B5441` activé).

**Approach:** 4 corrections ciblées (ne pas refondre la composition 2-cols qui fonctionne bien) : (1) wrapper image avec fond `--color-mur` (mur galerie), (2) CTA "Prendre rendez-vous" → lien souligné fin avec accent au hover (réutilisable), (3) section "Du même artiste" en bas (4 vignettes max, condition ≥ 2 œuvres avec visuel), (4) ajout fonction `fetchOeuvresByArtiste(slug, excludeOeuvreSlug, limit)` dans le client Strapi.

## Boundaries & Constraints

**Always:**
- Page wrappée dans `.container--edge` (cohérence avec accueil + à propos).
- Image œuvre dans un wrapper `.fiche-oeuvre-mur` avec `background: var(--color-mur)`, padding pour décoller l'image du bord.
- CTA "Prendre rendez-vous" : lien souligné fin (`<a>`), pas `<button>` — c'est une navigation. Hover : couleur + soulignement → `--color-accent`, flèche translate +4px.
- Section "Du même artiste" affichée **uniquement si** ≥ 2 œuvres autres que la courante, avec visuel disponible.
- Vignettes "Du même artiste" : utiliser le composant `<CarteOeuvre>` existant, max 4, container `.container--edge`.
- Token CSS `--color-mur: #FFFCF7` ajouté dans `global.css :root` (5% plus chaud que `--color-bg: #FAF8F5`).
- `fetchOeuvresByArtiste` : signature `(artisteSlug: string, opts: { excludeSlug?: string; limit?: number })`, filtre `hasVisuels: true`, `limit` par défaut 4, exclut l'œuvre courante via `filters[slug][$ne]=...`.
- Mobile < 900 px : grid 2-cols → 1-col, image avant méta (priorité visuelle œuvre).
- Image conservée dans le composant `<Lightbox>` existant (click ouvre lightbox plein écran).

**Ask First:**
- Ajout du champ Strapi `oeuvre.noteCuratoriale` (richtext) — proposé optionnel par la spec design pour enrichir la colonne droite. Non inclus v1 sauf demande explicite.
- Ajout du champ Strapi `oeuvre.annee` — la spec design la mentionne dans le bloc méta, mais le schema actuel n'a que technique/dimensions/provenance. Non inclus v1.
- Création d'un composant partagé `<CtaLien>` réutilisable (À propos, Œuvre, etc.) — KISS dit non v1 (1 seul usage), à promouvoir lors d'un 2e usage.

**Never:**
- Pas de modification du composant `<Breadcrumb>` (taille 12 px proposée par design = défère, le breadcrumb sert toutes les pages).
- Pas d'extraction `<MetaDl>` réutilisable (seul usage actuel ici, KISS).
- Pas d'animation IntersectionObserver fade-in stagger sur "Du même artiste" v1 (cohérent avec décision spec À propos).
- Pas de remplacement du composant `<Lightbox>` existant ni modification de son comportement.
- Pas de modification du schema Strapi (pas de nouveau champ).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Œuvre avec artiste + 5 autres œuvres avec visuels | artiste populated, fetchOeuvresByArtiste retourne 4 (limit) | Section "Du même artiste" rendue avec 4 vignettes | N/A |
| Œuvre avec artiste + 1 autre œuvre avec visuel | retourne 1 résultat | Section masquée (seuil ≥ 2) | N/A |
| Œuvre avec artiste + 0 autres œuvres | retourne 0 | Section masquée | N/A |
| Œuvre avec artiste + 3 autres œuvres dont 1 sans visuel | filtre `hasVisuels` retourne 2 | Section rendue avec 2 vignettes | N/A |
| Œuvre sans artiste (`oeuvre.artiste === null`) | pas de fetch lancé | Section masquée | Skip fetch |
| Œuvre avec artiste mais slug artiste vide | guard | Section masquée | Skip fetch |
| Œuvre sans visuel (placeholder lettre) | `visuel === undefined` | Wrapper `.fiche-oeuvre-mur` rendu autour du placeholder, fond beige | N/A |
| Mobile 375 px | viewport étroit | Grid bascule single-col, image en haut, méta dessous | Media query |
| CTA hover | souris hover sur lien | Couleur+border passent à `--color-accent`, flèche translate +4 px | N/A |
| Strapi indisponible pour fetchOeuvresByArtiste | exception | Section masquée (try/catch retournant `[]`) | Pas d'erreur visible |

</frozen-after-approval>

## Code Map

- `galerie-front/src/styles/global.css` -- ajouter token `--color-mur: #FFFCF7` dans `:root`
- `galerie-front/src/lib/strapi-client.ts` -- ajouter `fetchOeuvresByArtiste(artisteSlug, opts)` (filtre artiste + exclusion + hasVisuels + limit)
- `galerie-front/src/pages/oeuvres/[slug].astro` -- (1) wrap image dans `<div class="fiche-oeuvre-mur">`, (2) remplacer CTA `btn-primary` par `<a class="cta-rdv">` souligné fin, (3) ajouter section "Du même artiste" en bas avec `getStaticPaths` async fetch des œuvres liées, (4) wrapper la page dans `.container--edge`, (5) styles scopés mis à jour

## Tasks & Acceptance

**Execution:**
- [x] `galerie-front/src/styles/global.css` -- ajouter `--color-mur: #FFFCF7;` dans le bloc `:root` (section "Couleurs"), juste après `--color-error` -- nouveau token "mur galerie"
- [x] `galerie-front/src/lib/strapi-client.ts` -- ajouter export `async function fetchOeuvresByArtiste(artisteSlug: string, opts: { excludeSlug?: string; limit?: number } = {}): Promise<Oeuvre[]>` qui (1) construit query : `status=published&populate[0]=visuels&populate[1]=artiste&populate[2]=thematiques&populate[3]=expositions&filters[artiste][slug][$eq]={artisteSlug}&filters[visuels][id][$notNull]=true&pagination[pageSize]={limit ?? 4}`, (2) ajoute `&filters[slug][$ne]={excludeSlug}` si fourni, (3) try/catch retourne `[]` en cas d'erreur, (4) normalize via `normalizeOeuvre` -- nouveau client API
- [x] `galerie-front/src/pages/oeuvres/[slug].astro` -- dans le frontmatter Astro : importer `fetchOeuvresByArtiste` et `CarteOeuvre`, après le `const { oeuvre }` ajouter `const memeArtiste = oeuvre.artiste ? await fetchOeuvresByArtiste(oeuvre.artiste.slug, { excludeSlug: oeuvre.slug, limit: 4 }) : []` puis `const showMemeArtiste = memeArtiste.length >= 2` -- fetch œuvres liées
- [x] `galerie-front/src/pages/oeuvres/[slug].astro` -- restructurer le markup : wrap toute la page dans `<div class="container--edge">`, wrap l'image dans `<div class="fiche-oeuvre-mur">{Lightbox|placeholder}</div>`, remplacer `<a class="btn-primary cta-rdv">` par `<a class="cta-rdv">Prendre rendez-vous <span aria-hidden="true">→</span></a>` -- markup polish
- [x] `galerie-front/src/pages/oeuvres/[slug].astro` -- ajouter avant `</article>` la section : `{showMemeArtiste && <section class="section-meme-artiste"><h2>Du même artiste</h2><ul class="grille-meme-artiste">{memeArtiste.map(o => <li><CarteOeuvre oeuvre={o} /></li>)}</ul></section>}` -- relance curatoriale
- [x] `galerie-front/src/pages/oeuvres/[slug].astro` -- styles scopés : (1) `.fiche-oeuvre-mur` : `background: var(--color-mur); padding: var(--space-2xl); display: flex; align-items: center; justify-content: center;` ; (2) `.cta-rdv` : `display: inline-flex; align-items: center; gap: var(--space-sm); font-size: 0.9375rem; font-weight: 400; color: var(--color-text); border-bottom: 1px solid var(--color-text); padding-bottom: 4px; transition: color 400ms, border-color 400ms; margin-bottom: var(--space-xl);` + `:hover { color: var(--color-accent); border-color: var(--color-accent); }` + `span { transition: transform 400ms; }` + `:hover span { transform: translateX(4px); }` ; (3) `.section-meme-artiste` : `margin-top: var(--space-4xl); padding-top: var(--space-2xl); border-top: 1px solid var(--color-border);` + h2 marge inférieure 32 px ; (4) `.grille-meme-artiste` : `list-style: none; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-lg);` + `@media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }` ; supprimer les anciennes règles `.cta-rdv` (border, padding 14×28, capitales) -- typographie + mur galerie + section relance

**Acceptance Criteria:**
- Given une fiche œuvre avec visuel, when la page est rendue, then l'image œuvre apparaît dans un wrapper avec fond `var(--color-mur)` (#FFFCF7) qui forme un padding visible autour de l'image (effet mur de galerie).
- Given le CTA rendez-vous, when on hover, then la couleur du texte et la bordure inférieure passent à `var(--color-accent)` (#3B5441) et la flèche `→` translate de +4 px à droite, tout en 400 ms.
- Given une œuvre dont l'artiste a 5 autres œuvres avec visuel, when la page est rendue, then la section "Du même artiste" apparaît avec exactement 4 vignettes (limit=4), aucune n'étant l'œuvre courante.
- Given une œuvre dont l'artiste a 1 seule autre œuvre avec visuel, when la page est rendue, then **aucune** section "Du même artiste" n'apparaît (seuil ≥ 2).
- Given une œuvre sans artiste, when la page est rendue, then aucun fetch des œuvres liées n'est tenté, et la section "Du même artiste" n'apparaît pas.
- Given un viewport mobile < 900 px, when la page est rendue, then l'image apparaît au-dessus du bloc méta (single column), et "Du même artiste" est en grid 2 colonnes.
- Given un viewport ≥ 768 px, when la section "Du même artiste" est visible, then la grille est en 4 colonnes.
- Given Strapi indisponible (réseau ou erreur 500) au moment du build pour `fetchOeuvresByArtiste`, when la page est buildée, then la section "Du même artiste" est masquée silencieusement (pas de crash du build).

### Review Findings

- [x] [Review][Patch] `catch {}` silencieux dans `fetchOeuvresByArtiste` masque les erreurs Strapi en prod [galerie-front/src/lib/strapi-client.ts:108] — corrigé : ajout `console.warn` avec contexte (slug artiste + erreur)
- [x] [Review][Patch] Breakpoint mobile à 768 px au lieu de 900 px contredit Always §8 ; ratio 3fr/2fr au lieu de 5fr/3fr [galerie-front/src/pages/oeuvres/[slug].astro:177-183] — corrigé : breakpoint 900 px + ratio 5fr/3fr alignés sur la spec design
- [x] [Review][Patch] Grille « Du même artiste » à `repeat(4, 1fr)` laisse colonnes vides quand l'artiste a 2-3 œuvres [galerie-front/src/pages/oeuvres/[slug].astro:297-301] — corrigé : `repeat(auto-fill, minmax(220px, 1fr))` pour remplir naturellement
- [x] [Review][Defer] Filtre `filters[visuels][id][$notNull]=true` sur relation media v5 fragile (Blind Hunter) — pattern déjà utilisé en prod par `fetchOeuvres` avec succès, à durcir si bug observé
- [x] [Review][Defer] N+1 requests au build SSG (1 fetch par fiche œuvre × ~100 œuvres) — performance build, non bloquant ; à reprendre si build > 30s
- [x] [Review][Defer] Contraste `--color-mur: #fffcf7` vs `--color-bg: #faf8f5` à valider visuellement (Edge Hunter) — différence très subtile par design (5% plus chaud), à juger en prod
- [x] [Review][Defer] XSS potentiel sur `oeuvre.slug` dans `href={url(\`/contact?oeuvre=${oeuvre.slug}\`)}` (Blind Hunter) — préexistant, hors scope ; à durcir avec `encodeURIComponent` lors d'une passe sécurité

## Design Notes

**Pourquoi pas de composant `<CtaLien>` partagé v1** : seul usage est ici (À propos a son CTA "Prendre rendez-vous" sous une autre forme — flèche `↗` Proantic/Instagram). À extraire dès qu'un 2e usage apparaît (DRY-3 rule).

**Pourquoi `--color-mur` plutôt que `--color-surface` (blanc pur déjà existant)** : `--color-surface: #FFFFFF` est trop froid sur le fond crème global. `#FFFCF7` est 5% plus chaud, garde la sensation de papier/galerie. Ratio contraste avec image œuvre dépend de l'œuvre — ce token est uniquement décoratif (jamais texte sur ce fond).

**Try/catch sur fetchOeuvresByArtiste** : c'est une fonction "best-effort" non critique pour la fiche œuvre. Si Strapi rate, on masque la section silencieusement plutôt que de crash le build des 100+ fiches œuvres.

**Pas d'animation scroll v1** : cohérent avec la décision sur la spec À propos (`Never §3`). À reprendre dans une spec polish ultérieure si demandé.

## Verification

**Commands:**
- `cd galerie-front && yarn build` -- expected: build SSG passe sans warning ni erreur (suppose Strapi démarré localement)

**Manual checks:**
- Démarrer Strapi + Astro dev → visiter une fiche œuvre dont l'artiste a plusieurs œuvres (ex: Despierre)
- Vérifier : image dans cadre `--color-mur`, CTA souligné fin avec hover accent, section "Du même artiste" en bas avec 4 vignettes max
- Tester avec une œuvre dont l'artiste n'a qu'1 autre œuvre → section absente
- Resize navigateur < 768 px → grille relance passe en 2 colonnes
- Click sur l'image → lightbox plein écran s'ouvre (régression)
- Click sur une vignette "Du même artiste" → navigation vers la nouvelle fiche œuvre
