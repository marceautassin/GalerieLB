---
title: "Spec — Rendu Markdown des champs richtext CMS"
date: 2026-05-08
status: à démarrer
priorité: P0
effort_estimé: 0,5 — 1 j
source: deferred-work.md (Defered le 2026-05-08)
---

# Spec — Rendu Markdown des champs richtext CMS

## Contexte & problème

Tous les champs éditoriaux du CMS sont typés `richtext` côté Strapi v5 (éditeur Markdown natif). Louis y saisit du Markdown qui est stocké tel quel (string) dans la base.

Côté front Astro, le rendu actuel utilise un naïf `text.split('\n').filter(p => p.trim()).map(p => <p>{p}</p>)`. **Conséquence** : tout formatage Markdown (gras, italique, listes, liens, sauts simples, citations) est rendu *littéralement* — Louis voit `**gras**` et `- item` à l'écran.

Cas particulier : `expositions/[slug].astro` ligne 100 utilise `set:html={exposition.preface}` — pire encore, ça rend le Markdown comme du HTML (les `**` restent visibles, les `-` ne deviennent pas des listes). Et c'est une **faille XSS potentielle** si Louis écrit `<script>` dans un préface.

## Champs concernés

| Page front | Champ Strapi | Rendu actuel |
|---|---|---|
| `pages/a-propos.astro:46` | `biographieLouis` | `split('\n')` |
| `pages/a-propos.astro:58` | `textePrixMarcus` | `split('\n')` |
| `pages/artistes/[slug].astro:73` | `biographie` | `split('\n')` |
| `pages/artistes/[slug].astro:84` | `contexteArtistique` | `split('\n')` |
| `pages/expositions/[slug].astro:100` | `preface` | `set:html` (cassé + XSS) |

## Solution retenue

- **Lieu de parsing** : front Astro, au build (SSG). Strapi reste source de vérité Markdown brut.
- **Lib** : [`marked`](https://github.com/markedjs/marked) (~30 KB, zero deps, GFM, rapide) — combiné avec [`isomorphic-dompurify`](https://github.com/kkomelin/isomorphic-dompurify) pour sanitization XSS.
  - *Rejet `markdown-it`* : plus lourd, plugins à configurer pour le même résultat.
  - *Rejet `astro-remark` direct* : on ne peut pas alimenter remark depuis une string runtime sans `MDX`, et on n'a pas de fichier `.md` source.
- **Composant** : `src/components/RichText.astro` — props `{ content: string }`, renvoie HTML sanitisé.
- **Style** : la typographie reste pilotée par le scope `.rich-text` dans `global.css` (Jost 17px / 1.75, `<strong>` 500, `<em>` italique, `<ul>` puces fines, `<a>` souligné).

## Périmètre Markdown supporté

| Syntaxe | Sortie HTML |
|---|---|
| Saut de ligne simple (CR seul) | `<br>` (option `marked: { breaks: true }`) |
| Paragraphes (CR×2) | `<p>` |
| `**gras**` | `<strong>` |
| `*italique*` | `<em>` |
| `- item` / `1. item` | `<ul>` / `<ol>` |
| `[texte](url)` | `<a>` |
| `> citation` | `<blockquote>` |

Hors scope : titres `#`, images, tableaux, code blocks (Louis n'en a pas besoin).

## User Story

**En tant que** Louis,
**je veux** que le formatage Markdown que je saisis dans Strapi (gras, italique, listes, sauts de ligne, liens, citations) apparaisse correctement sur le site,
**afin de** ne pas voir mes textes éditoriaux rendus comme du texte brut.

## Acceptance Criteria

- [ ] Composant `<RichText content={...} />` créé dans `galerie-front/src/components/RichText.astro`.
- [ ] Lib `marked` + `isomorphic-dompurify` ajoutées comme deps de `galerie-front/`.
- [ ] Sanitization DOMPurify activée (whitelist : `p, br, strong, em, ul, ol, li, a[href], blockquote`).
- [ ] Liens externes : ajout automatique `target="_blank" rel="noopener noreferrer"` quand le href ne commence pas par `/` ou le domaine site.
- [ ] Les 5 lieux de rendu listés dans le tableau « Champs concernés » utilisent `<RichText>`.
- [ ] CSS `.rich-text` dans `global.css` (ou inline scope du composant) couvre `<strong>`, `<em>`, `<ul>`, `<ol>`, `<a>`, `<blockquote>` cohérent avec la charte typographique Jost (17px / 1.75, weight 500 pour gras, accent `#3B5441` au hover des liens).
- [ ] Test manuel sur les 4 pages : la bio Louis (`/a-propos`), une fiche artiste (`/artistes/[slug]`), une fiche exposition (`/expositions/[slug]`), section Prix Marcus.
- [ ] Test XSS : insertion d'un `<script>alert(1)</script>` dans un champ Strapi → ne s'exécute pas en prod.
- [ ] `expositions/[slug].astro` : remplacement de `set:html={exposition.preface}` par `<RichText content={exposition.preface} />`.

## Risques & mitigations

| Risque | Mitigation |
|---|---|
| Texte legacy déjà saisi sans Markdown (paragraphes \n simples) | `marked` avec `breaks: true` rend les `\n` en `<br>` — comportement identique à l'actuel pour ce cas. |
| `marked` ajoute du poids au bundle | Build SSG → exécuté à la build, **zéro JS au client**. |
| Citation Gabrielle (spec à venir) demande un style spécifique | Couvert par `.rich-text blockquote` — la spec Gabrielle pourra surcharger le style sans toucher au composant. |
| Strapi v5 retournerait du HTML pré-rendu ? | Non — vérifié : `richtext` retourne bien le Markdown brut en string via REST/GraphQL. |

## Hors scope

- Migration vers le nouveau type `blocks` (rich text JSON) de Strapi v5.
- Style spécifique citation Gabrielle (sera traité dans la spec Goal B — page À propos éditoriale).
- Champs richtext qui pourraient être ajoutés ultérieurement (œuvres, articles presse) — le composant `<RichText>` les supportera de facto.

## Fichiers touchés (estimation)

```
galerie-front/package.json                              # + marked, isomorphic-dompurify
galerie-front/src/components/RichText.astro             # NEW
galerie-front/src/styles/global.css                     # + scope .rich-text
galerie-front/src/pages/a-propos.astro                  # 2 remplacements
galerie-front/src/pages/artistes/[slug].astro           # 2 remplacements
galerie-front/src/pages/expositions/[slug].astro        # 1 remplacement (set:html → RichText)
```

## Definition of Done

- Build SSG passe sans warning.
- Les 5 rendus affichent du HTML correct en local et sur la prod.
- Marceau valide visuellement le rendu d'au moins 1 texte de chaque page.
- Test XSS passé.
- Commit unique avec message `feat(front): rendu Markdown des champs richtext CMS`.
