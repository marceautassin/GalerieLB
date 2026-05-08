---
title: 'Refonte page À propos éditoriale (Goal B)'
type: 'feature'
created: '2026-05-08'
status: 'done'
baseline_commit: 'eefc3bd'
context:
  - '_bmad/_memory/art-director-sidecar/specs-2026-05-07.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La page `/a-propos` actuelle a un ton "fiche LinkedIn" : H1 centré, photo Louis ~240 px, paragraphes serrés, infos pratiques en grille basique. Pour une galerie de prestige, l'À propos doit lire comme une **préface de catalogue** (Whitechapel, Hauser & Wirth) — typographie éditoriale, photo agrandie, citation détachée, rythme aéré, containers cohérents avec le système 3-containers (`--edge` / `--prose` / `--bleed`) déjà mergé.

**Approach:** Restructurer `a-propos.astro` en 6 sections distinctes (en-tête éditorial, bio Louis grid 3fr/5fr, citation, Prix Marcus, infos pratiques, réseaux), ajouter 3 champs Strapi (`accroche` text, `citation` richtext, `citationAuteur` string), créer un composant `<Citation>` réutilisable. Section galerie (vues physiques) inchangée — restera 3 vignettes égales.

## Boundaries & Constraints

**Always:**
- Tous les textes utilisent `<RichText>` ou `<Citation>` — pas de `split('\n')` ni `set:html` brut.
- Containers : sections 1, 2 utilisent `.container--edge` ; sections 3 (citation), 4 (Prix Marcus), 6 (infos), 7 (réseaux) utilisent `.container--prose`. Section galerie (5) reste avec son layout actuel `width: 100vw bleed` — pas touchée.
- H1 "À propos" aligné gauche (fin du `text-align: center` actuel).
- Citation détachée : `<blockquote class="citation">` + `<cite>` accessible.
- Mobile (< 900 px) : grid bio 3fr/5fr bascule en single-column (photo en haut, bio en bas).
- Sections successives au même niveau de DOM (pas d'imbrication container) — chaque section a son propre container.
- Schema Strapi v5 : ajouts au `schema.ts` existant (`export default`), pas de migration de données nécessaire (champs nouveaux nullable).
- Reseaux : retirer emojis 📍🔗 si présents, garder pictos linéaires monochromes ou rien (text-only OK).

**Ask First:**
- Migration des champs `accroche` / `citation` vers un component Strapi partagé (réutilisable ailleurs).
- Animations IntersectionObserver (fade + translateY) — la spec design les mentionne mais coût/bénéfice à valider, je propose de les exclure de la v1.
- Photo Louis Barrand au format différent (le champ `photoLouis` reste `media` simple).

**Never:**
- Pas d'effet parallax sur la photo Louis (anti-pattern art director).
- Pas de fond gris derrière la photo (laisser flotter sur le fond crème).
- Pas de modification de la section 5 "La galerie" (rythme 3 égales conservé per Marceau).
- Pas de création de composant Strapi partagé pour `citation` (overkill pour 1 usage — 2 champs plats sur singleType).
- Pas de lead paragraph différencié sur la bio (per Marceau).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Tous champs renseignés | accroche, bio, photo, citation, prixMarcus, vuesGalerie, infos | 6 sections rendues, layout grid 3fr/5fr desktop | N/A |
| `accroche` vide/null | `null` | Section 1 affiche juste le H1, pas de sous-titre | Pas d'élément vide |
| `citation` vide / `citationAuteur` vide | l'un ou l'autre absent | Section 3 entière masquée (pas de citation orpheline ni d'auteur seul) | N/A |
| `photoLouis` absente | `null` | Bio rendue full-width sans grid (single column) | N/A |
| Mobile < 900 px | viewport 375 px | Grid bio bascule en single column, photo en haut | Media query |
| Citation avec Markdown | `**emphase** dans la citation` | Rendu via `<RichText>` à l'intérieur du `<blockquote>` | N/A |
| Aucun apropos en base | `apropos === null` | Page affiche juste H1 + breadcrumb + message "contenu en cours de rédaction" | N/A |

</frozen-after-approval>

## Code Map

- `galerie-cms/src/api/a-propos/content-types/a-propos/schema.ts` -- ajout `accroche` (text), `citation` (richtext), `citationAuteur` (string)
- `galerie-front/src/types/strapi.ts` -- ajout 3 champs sur interface `APropos`
- `galerie-front/src/lib/strapi-client.ts` -- aucun changement de query (champs nouveaux remontent automatiquement, pas de populate requis)
- `galerie-front/src/components/Citation.astro` -- NEW : `<blockquote class="citation">` + `<cite>`, accepte `texte: string` et `auteur: string`
- `galerie-front/src/pages/a-propos.astro` -- restructuration complète : sections 1, 2, 3, 4, 6, 7 avec containers explicites ; section 5 inchangée
- `galerie-front/src/styles/global.css` -- aucun changement (utilise tokens existants ; styles spécifiques restent dans le scope de la page)

## Tasks & Acceptance

**Execution:**
- [x] `galerie-cms/src/api/a-propos/content-types/a-propos/schema.ts` -- ajouter `attributes.accroche: { type: "text" }`, `attributes.citation: { type: "richtext" }`, `attributes.citationAuteur: { type: "string" }` -- 3 champs Strapi nullable, pas de migration
- [x] `galerie-front/src/types/strapi.ts` -- ajouter `accroche: string | null`, `citation: string | null`, `citationAuteur: string | null` à l'interface `APropos` -- typage front aligné
- [x] `galerie-front/src/components/Citation.astro` -- créer composant qui (1) accepte `texte: string` et `auteur: string`, (2) retourne `null` si l'un des deux est vide, (3) rend `<blockquote class="citation"><div class="citation-texte"><RichText content={texte}/></div><cite class="citation-auteur">— {auteur}</cite></blockquote>`, (4) styles scopés dans `<style>` -- composant unique réutilisable
- [x] `galerie-front/src/pages/a-propos.astro` -- restructurer le markup : (1) wrap section 1 (en-tête : H1 + accroche italique) dans `<div class="container--edge">`, (2) wrap section 2 (bio + photo) dans `<div class="container--edge">` avec grid 3fr/5fr desktop, (3) ajouter section 3 (Citation) wrappée dans `<div class="container--prose">`, (4) wrap section 4 (Prix Marcus) dans `<div class="container--prose">`, (5) garder section 5 (galerie) telle quelle, (6) wrap section 6 (infos pratiques) dans `<div class="container--prose">`, (7) wrap section 7 (réseaux) dans `<div class="container--prose">`. Supprimer `text-align: center` du H1 et le `max-width: 720px` ; remplacer par les containers utilitaires. Ajouter `margin-top: 16px` entre label H3 et contenu dans les info-blocs. Photo Louis passe à `width: 100%` dans grid (vraie largeur ~520 px sur 1920) -- coeur de la refonte
- [x] `galerie-front/src/pages/a-propos.astro` -- mettre à jour les styles scopés : retirer `max-width: 720px` sur les sections (containers utilitaires gèrent désormais la largeur), retirer le grid `280px 1fr` desktop (remplacer par `3fr 5fr` avec `gap: var(--space-2xl)` desktop, single-column mobile < 900 px), texte bio limité à `max-width: 56ch` à l'intérieur de la colonne droite, marge supérieure des h2 sections passée à `var(--space-4xl)` (= 96 px) pour le rythme éditorial -- alignement design Gabrielle
- [x] `galerie-front/src/pages/a-propos.astro` -- nettoyer la section réseaux : retirer toute occurrence d'emoji 📍🔗 ou pictogrammes graphiques ; conserver le label flèche ↗ (`&#8599;`) déjà présent qui est typographique (compatible charte) -- homogénéisation pictos
- [x] `galerie-front/src/lib/image-presets.ts` -- vérifier `PORTRAIT_A_PROPOS.width` ; si < 520, augmenter à 520 (ou ajouter un nouveau preset `PORTRAIT_A_PROPOS_LARGE`) pour servir une image suffisamment résolue côté Astro Image -- portrait haute résolution

**Acceptance Criteria:**
- Given la page `/a-propos` rendue sur desktop ≥ 1024 px, when `apropos.accroche`, `apropos.biographieLouis`, `apropos.photoLouis`, `apropos.citation`, `apropos.citationAuteur` sont tous renseignés, then on observe : (1) H1 "À propos" aligné gauche, (2) sous-titre italique sous le H1 = `accroche`, (3) section bio en grid 3fr/5fr avec photo à gauche ~520 px, (4) `<blockquote>` après la bio avec citation et `<cite>` en dessous, (5) section "Prix Marcus" puis galerie, infos pratiques, réseaux dans cet ordre.
- Given un viewport mobile < 900 px, when la page est rendue, then la section bio passe en single column avec photo en haut et bio en bas (pas de débordement, pas de scroll horizontal).
- Given `apropos.citation` ou `apropos.citationAuteur` vide, when la page est rendue, then **aucune section citation** n'apparaît (pas de `<blockquote>` orphelin avec un seul élément).
- Given `apropos.accroche` vide, when la page est rendue, then la section 1 contient uniquement le H1 (pas de sous-titre vide).
- Given un texte de citation contenant du Markdown (`**emphase**`), when rendu, then l'emphase est correctement traitée par `<RichText>` à l'intérieur du `<blockquote>`.
- Given le rendu d'une section sous container, when on inspecte le DOM, then chaque section est un sibling au niveau de l'`<article>` (pas de section dans une section), et chaque section a un container utilitaire explicite (`.container--edge` ou `.container--prose`) — sauf section galerie (5) inchangée.
- Given le schema Strapi déployé, when on visite l'admin, then les 3 nouveaux champs (`Accroche`, `Citation`, `Citation auteur`) apparaissent dans le formulaire d'édition de "APropos" et sont éditables sans erreur.

## Design Notes

**Pourquoi 2 champs plats (`citation` + `citationAuteur`) plutôt qu'un component Strapi** : la spec art-director suggère un component partagé `texte + auteur`. Pour 1 usage unique sur 1 singleType, 2 fields plats sont plus simples (pas de dossier `components/` à créer, pas de relation à gérer côté API), respectent KISS et restent triviaux à migrer en component plus tard si besoin. Le composant **front** `<Citation>` est partagé, lui — c'est là où la réutilisabilité a de la valeur.

**Container imbrication** : la spec design insiste que chaque section a son propre container (pas d'imbrication). Concrètement : `<article>` contient des `<section>` directs, chacun wrappé d'un `<div class="container--edge">` ou `<div class="container--prose">`. Le `<article class="page-a-propos">` lui-même n'a **pas** de container — il s'étend full-width pour permettre aux sections d'avoir leur propre largeur.

**Animations exclues v1** : la spec design propose IntersectionObserver fade+translateY. Coût (JS client + complexité accessibilité) > bénéfice (l'effet existe déjà via le scroll natif). À évaluer dans une spec polish ultérieure si Marceau le souhaite.

## Verification

**Commands:**
- `cd galerie-front && yarn build` -- expected: build SSG passe sans warning ni erreur (suppose Strapi démarré localement avec les 3 nouveaux champs migrés)
- `cd galerie-cms && yarn develop` -- expected: démarrage sans erreur de compilation TypeScript du schema

**Manual checks:**
- Démarrer Strapi → admin → vérifier présence des 3 nouveaux champs dans le formulaire APropos
- Saisir une accroche, une citation + auteur, sauvegarder, publier
- Démarrer Astro dev → visiter `/a-propos` → vérifier les 6 sections dans l'ordre, alignement gauche du H1, grid 3fr/5fr en desktop, single-column mobile (resize navigateur)
- Tester avec citation vide : section 3 doit disparaître
- Tester avec accroche vide : section 1 garde juste le H1
