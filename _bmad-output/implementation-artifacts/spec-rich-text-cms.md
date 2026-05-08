---
title: 'Rendu Markdown des champs richtext CMS'
type: 'feature'
created: '2026-05-08'
status: 'done'
baseline_commit: '998cfd52ca094c8ed029d24537c9a967e9ef00d6'
context:
  - '_bmad-output/planning-artifacts/spec-rich-text-cms.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Tous les champs `richtext` Strapi (bio Louis, prix Marcus, biographie/contexteArtistique artistes, préface expositions) sont rendus côté Astro via `text.split('\n').map(p => <p>{p}</p>)` ou `set:html` brut — Louis voit son Markdown apparaître littéralement (`**gras**`, `- item`) à l'écran, et `set:html` sur `preface` est une faille XSS.

**Approach:** Composant `<RichText content={...} />` qui parse le Markdown au build avec `marked` puis assainit le HTML avec `isomorphic-dompurify`, remplace tous les rendus naïfs.

## Boundaries & Constraints

**Always:**
- Parsing au build (SSG) — zéro JS au client.
- Sanitization DOMPurify avec whitelist explicite : `p, br, strong, em, ul, ol, li, a[href], blockquote`.
- Liens externes (href ne commençant pas par `/`) reçoivent automatiquement `target="_blank" rel="noopener noreferrer"`.
- Comportement legacy préservé : un texte sans Markdown (juste des `\n`) doit rendre des sauts de ligne — `marked` config `breaks: true`.
- Typographie cohérente avec la charte (Jost 17px / 1.75, accent `#3b5441` au hover des liens, weight 500 pour `<strong>`).

**Ask First:**
- Migrer les champs Strapi `type: "richtext"` vers le nouveau type `blocks` (rich text JSON v5).
- Ajouter d'autres formats Markdown hors whitelist (titres, images, code blocks, tableaux).

**Never:**
- Pas de rendu côté client (pas de hydration JS).
- Pas de `set:html` sur des données CMS sans passage par `<RichText>`.
- Pas de modification du schéma Strapi dans cette spec.
- Pas de style spécifique pour la citation Gabrielle (sera traité dans la spec Goal B — page À propos).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Markdown simple | `**bold** *italic*` | `<p><strong>bold</strong> <em>italic</em></p>` | N/A |
| Liste à puces | `- a\n- b` | `<ul><li>a</li><li>b</li></ul>` | N/A |
| Saut de ligne simple (legacy) | `ligne 1\nligne 2` | `<p>ligne 1<br>ligne 2</p>` | N/A |
| Paragraphes (double saut) | `para 1\n\npara 2` | `<p>para 1</p><p>para 2</p>` | N/A |
| Lien externe | `[Strapi](https://strapi.io)` | `<a href="..." target="_blank" rel="noopener noreferrer">Strapi</a>` | N/A |
| Lien interne | `[À propos](/a-propos)` | `<a href="/a-propos">À propos</a>` (pas de target) | N/A |
| Citation | `> texte` | `<blockquote><p>texte</p></blockquote>` | N/A |
| Injection XSS | `<script>alert(1)</script>` | `<script>` est strippé par DOMPurify | Aucune exécution |
| Contenu vide / null | `''` ou `undefined` | rien rendu (pas de `<p>` vide) | Composant retourne `null` |
| Tag hors whitelist | `<iframe src="...">` | strippé par DOMPurify | N/A |

</frozen-after-approval>

## Code Map

- `galerie-front/package.json` -- ajouter deps `marked` + `isomorphic-dompurify`
- `galerie-front/src/components/RichText.astro` -- NEW : composant unique parsing + sanitization
- `galerie-front/src/styles/global.css` -- ajouter scope `.rich-text { … }` (typographie)
- `galerie-front/src/pages/a-propos.astro` -- 2 remplacements (`biographieLouis` ligne 46, `textePrixMarcus` ligne 58)
- `galerie-front/src/pages/artistes/[slug].astro` -- 2 remplacements (`biographie` ligne 73, `contexteArtistique` ligne 84)
- `galerie-front/src/pages/expositions/[slug].astro` -- 1 remplacement (`preface` ligne 100, `set:html` → `<RichText>`)

## Tasks & Acceptance

**Execution:**
- [x] `galerie-front/package.json` -- ajouter `marked` (latest stable) et `isomorphic-dompurify` (latest stable) en dependencies, puis `npm install` -- nouvelles deps requises pour parsing + sanitization
- [x] `galerie-front/src/components/RichText.astro` -- créer composant qui (1) accepte prop `content: string | null | undefined`, (2) retourne `null` si vide, (3) parse via `marked.parse(content, { breaks: true, gfm: true })`, (4) post-process pour ajouter `target="_blank" rel="noopener noreferrer"` sur les `<a>` externes, (5) sanitize via `DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p','br','strong','em','ul','ol','li','a','blockquote'], ALLOWED_ATTR: ['href','target','rel'] })`, (6) wrappe dans un `<div class="rich-text" set:html={cleanHtml} />` -- composant unique réutilisé
- [x] `galerie-front/src/styles/global.css` -- ajouter section `.rich-text` avec styles pour `p` (espacement vertical), `strong` (weight 500), `em` (italic), `ul`/`ol` (puces fines, padding-left), `li` (marge), `a` (souligné, hover accent), `blockquote` (italic, padding-left, border-left fine) -- cohérence charte typographique
- [x] `galerie-front/src/pages/a-propos.astro` -- remplacer les 2 blocs `{apropos.X.split('\n').filter(...).map(p => <p>{p}</p>)}` par `<RichText content={apropos.X} />` (`biographieLouis` puis `textePrixMarcus`) -- import du composant en frontmatter
- [x] `galerie-front/src/pages/artistes/[slug].astro` -- remplacer les 2 blocs `split('\n')` par `<RichText content={artiste.biographie} />` et `<RichText content={artiste.contexteArtistique} />` -- import du composant
- [x] `galerie-front/src/pages/expositions/[slug].astro` -- remplacer `<div class="fiche-exposition-preface" set:html={exposition.preface} />` par `<RichText content={exposition.preface} />` (la classe `.rich-text` du composant remplace `.fiche-exposition-preface` ; supprimer le CSS spécifique si présent) -- corrige aussi la faille XSS

**Acceptance Criteria:**
- Given un champ richtext Strapi contenant `**Louis Barrand** est *galeriste* à Paris.\n- expert Belle Époque\n- Prix Marcus 2023`, when la page est buildée, then le HTML rendu contient `<strong>Louis Barrand</strong>`, `<em>galeriste</em>`, et un `<ul>` à 2 `<li>`.
- Given un champ richtext contenant `<script>alert(1)</script>texte légitime`, when la page est buildée, then le `<script>` est absent du HTML, seul `texte légitime` apparaît.
- Given un lien `[Article](https://lemonde.fr)` dans un champ, when rendu, then le `<a>` a `target="_blank"` et `rel="noopener noreferrer"`.
- Given un lien `[Voir](/artistes)`, when rendu, then le `<a>` a `href="/artistes"` sans `target`.
- Given un champ vide ou `undefined`, when rendu, then aucun élément DOM n'est créé (pas de `<div class="rich-text">` vide).
- Given un texte legacy sans Markdown contenant des `\n` simples, when rendu, then les sauts de ligne sont préservés via `<br>` (continuité visuelle avec l'ancien rendu).

## Design Notes

DOMPurify côté serveur (Node) requiert `isomorphic-dompurify` (wrap autour de `jsdom`). Build SSG d'Astro = environnement Node, donc ça fonctionne sans bundling client. Pour le post-process des liens externes : faire une regex simple sur le HTML de sortie de `marked` avant DOMPurify, ou utiliser un walker DOM. Approche regex suffisante :

```ts
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

const raw = marked.parse(content, { breaks: true, gfm: true, async: false }) as string;
const withTargets = raw.replace(
  /<a href="(https?:\/\/[^"]+)"/g,
  '<a href="$1" target="_blank" rel="noopener noreferrer"'
);
const clean = DOMPurify.sanitize(withTargets, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'blockquote'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
});
```

## Verification

**Commands:**
- `cd galerie-front && npm run build` -- expected: build SSG passe sans warning ni erreur
- `cd galerie-front && npm run lint` -- expected: aucune erreur ESLint sur les fichiers modifiés

**Manual checks:**
- Démarrer Strapi + Astro en dev (`galerie-cms: npm run develop` + `galerie-front: npm run dev`).
- Visiter `/a-propos`, `/artistes/<slug>`, `/expositions/<slug>` — vérifier que tout Markdown saisi par Louis est correctement rendu (gras, italique, listes, sauts simples, citations, liens).
- Insérer temporairement `<script>alert('xss')</script>` dans un champ Strapi (admin), rebuild, confirmer absence d'alerte et de `<script>` dans le HTML.
- Inspecter un lien externe rendu : `target="_blank"` et `rel="noopener noreferrer"` doivent être présents.
