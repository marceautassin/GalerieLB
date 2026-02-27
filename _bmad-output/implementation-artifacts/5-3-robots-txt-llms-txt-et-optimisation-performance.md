# Story 5.3: robots.txt, llms.txt, GEO et optimisation performance

Status: ready-for-dev

## Story

As a crawler (moteur de recherche ou IA),
I want des fichiers de configuration clairs, une stratégie GEO complète et un site performant,
so that l'indexation soit optimale, le contenu citable par les IA et les Core Web Vitals au vert.

## Acceptance Criteria

1. `robots.txt` autorise l'indexation complète, référence le sitemap et autorise explicitement les crawlers IA (GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended)
2. `llms.txt` décrit la galerie selon la spécification llmstxt.org, avec structure art-gallery et liens vers les pages clés
3. `llms-full.txt` est généré au build Astro depuis les données Strapi (artistes, oeuvres, expositions, à propos) et contient le contenu détaillé de chaque section
4. `llms-full.txt` n'est PAS versionné (présent dans `.gitignore`)
5. Core Web Vitals au vert : LCP < 2.5s, FID < 100ms, CLS < 0.1
6. Toutes les images utilisent `<Image>` Astro (WebP/AVIF, lazy loading, dimensionnement adaptatif)
7. Score Lighthouse Performance > 90

## Tasks / Subtasks

- [ ] Task 1 : Compléter robots.txt avec crawlers IA (AC: #1)
  - [ ] 1.1 Conserver `User-agent: * Allow: /` et la référence sitemap
  - [ ] 1.2 Ajouter les User-agent IA explicites : `User-agent: GPTBot Allow: /`, `User-agent: ClaudeBot Allow: /`, `User-agent: PerplexityBot Allow: /`, `User-agent: Applebot-Extended Allow: /`
- [ ] Task 2 : Enrichir llms.txt selon spec llmstxt.org (AC: #2)
  - [ ] 2.1 Structurer selon la spécification llmstxt.org : `# Title`, `> Blockquote description`, `## Sections` avec liens Markdown
  - [ ] 2.2 Ajouter les URLs des pages clés en liens Markdown
  - [ ] 2.3 Ajouter la section spécifique art-gallery : spécialité, types de contenu, artistes représentés
  - [ ] 2.4 Référencer `llms-full.txt` dans `llms.txt`
- [ ] Task 3 : Générer llms-full.txt au build Astro (AC: #3, #4)
  - [ ] 3.1 Créer un endpoint Astro SSG (`src/pages/llms-full.txt.ts`) qui fetch les données Strapi au build
  - [ ] 3.2 Générer le contenu : liste complète des artistes (nom, bio courte), oeuvres (titre, artiste, technique, dimensions), expositions (titre, dates, préface), informations à propos
  - [ ] 3.3 Format texte structuré Markdown, lisible par les LLMs
  - [ ] 3.4 Ajouter `public/llms-full.txt` au `.gitignore` du front (fichier généré)
- [ ] Task 4 : Audit performance (AC: #5, #6, #7)
  - [ ] 4.1 Vérifier que TOUTES les images utilisent `<Image>` Astro
  - [ ] 4.2 Vérifier `loading="lazy"` sur les images sous le fold
  - [ ] 4.3 Vérifier `font-display: swap` sur les fonts
  - [ ] 4.4 Vérifier `client:visible` sur les islands Vue (pas `client:load`)
  - [ ] 4.5 Lancer Lighthouse sur les pages clés, viser > 90 en Performance
  - [ ] 4.6 Corriger tout problème de CLS (images sans dimensions, fonts)
- [ ] Task 5 : Optimisations finales (AC: #5)
  - [ ] 5.1 Ajouter `srcset` et `sizes` si pas déjà géré par `<Image>` Astro
  - [ ] 5.2 Vérifier la taille du bundle JS (devrait être minimal — SSG)
  - [ ] 5.3 Vérifier le cache HTTP sur les assets statiques

## Dev Notes

### robots.txt — Contenu cible

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://www.galerie-louisbarrand.fr/sitemap-index.xml
```

### llms.txt — Contenu cible (format llmstxt.org)

```markdown
# Galerie Louis Barrand

> Galerie d'art parisienne fondée par Louis Barrand, spécialisée dans la redécouverte d'artistes oubliés du XIXe et XXe siècle. Peinture, sculpture, arts graphiques.

## Pages principales
- [Artistes](https://www.galerie-louisbarrand.fr/artistes): Artistes représentés par la galerie — biographies et portfolios
- [Oeuvres](https://www.galerie-louisbarrand.fr/oeuvres): Catalogue des oeuvres disponibles — peinture, sculpture, arts graphiques
- [Expositions](https://www.galerie-louisbarrand.fr/expositions): Expositions en cours et passées
- [À propos](https://www.galerie-louisbarrand.fr/a-propos): Histoire de la galerie, parcours de Louis Barrand, Prix Marcus
- [Presse](https://www.galerie-louisbarrand.fr/presse): Articles de presse et couverture média
- [Contact](https://www.galerie-louisbarrand.fr/contact): Formulaire de prise de rendez-vous

## Contenu détaillé
- [llms-full.txt](https://www.galerie-louisbarrand.fr/llms-full.txt): Contenu complet du site (artistes, oeuvres, expositions, informations galerie)

## Spécialité
Redécouverte et mise en valeur d'artistes oubliés du XIXe et XXe siècle. La galerie propose des oeuvres de peinture, sculpture et arts graphiques, avec une expertise reconnue (Prix Marcus).
```

### llms-full.txt — Stratégie de génération

Le fichier est généré au build via un endpoint Astro SSG (`src/pages/llms-full.txt.ts`). Il fetch toutes les données Strapi et produit un fichier texte structuré :

```
# Galerie Louis Barrand — Contenu complet

## Artistes
### [Nom Artiste]
[Bio courte, dates, nationalité]
Oeuvres : [liste titres]

## Oeuvres
### [Titre Oeuvre]
Artiste : [nom]
Technique : [technique]
Dimensions : [largeur] × [hauteur]
...

## Expositions
### [Titre Expo]
Dates : [début] — [fin]
[Préface courte]

## À propos
[Texte à propos de la galerie]
```

**Important :** `llms-full.txt` est généré dans le dossier `dist/` au build (pas dans `public/`). L'endpoint Astro `src/pages/llms-full.txt.ts` produit le fichier dans le build output directement. Ajouter `public/llms-full.txt` au `.gitignore` par précaution.

### Prérequis

- Toutes les pages et composants créés
- Site fonctionnel en local
- Client API Strapi fonctionnel (Story 2.1)

### References

- [Source: _bmad-output/planning-artifacts/prd.md — FR9, GEO section]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.3]
- [Source: _bmad-output/planning-artifacts/architecture.md — SEO, GEO, Performance]
- [Spec llmstxt.org](https://llmstxt.org)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
