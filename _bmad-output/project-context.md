---
project_name: 'GallerieLouisBarrand'
user_name: 'Marceau'
date: '2026-02-22'
sections_completed: ['technology_stack', 'principles', 'implementation_rules', 'naming_conventions', 'anti_patterns', 'project_structure']
---

# Project Context for AI Agents

_Règles critiques pour l'implémentation du projet GallerieLouisBarrand. Lire AVANT toute implémentation._

---

## Technology Stack & Versions

- **Front :** Astro (SSG) + TypeScript strict + Vue (islands)
- **CMS :** Strapi v5 + TypeScript
- **BDD :** PostgreSQL
- **Stockage médias :** S3 compatible (API AWS S3)
- **Email :** Brevo SMTP (notification uniquement)
- **Styles :** CSS natif moderne (custom properties, nesting) — PAS de framework CSS
- **Monitoring :** UptimeRobot free tier

## Principes de développement

- **DRY** — Ne pas dupliquer la logique. Extraire dans `src/lib/` si utilisé à plus d'un endroit.
- **KISS** — Privilégier la solution la plus simple. Pas d'abstraction prématurée. Trois lignes similaires valent mieux qu'une abstraction inutile.
- **SOLID** — Responsabilité unique par fichier/fonction. Dépendre d'abstractions (types TS), pas d'implémentations concrètes.

## Critical Implementation Rules

### Convention de langue du code
- **Noms métier en français :** Artiste, Oeuvre, Exposition, Thematique, ArticlePresse, MessageContact
- **Code technique en anglais :** fetchData(), handleSubmit(), formatDate()
- **Mixte naturel :** fetchArtistes(), getOeuvreBySlug(), handleContactSubmit()
- NE JAMAIS traduire les noms métier en anglais

### Architecture SSG — règle fondamentale
- Le site est 100% statique (SSG). AUCUN fetch runtime côté visiteur.
- Seule exception : le POST du formulaire de contact vers Strapi.
- Toute donnée affichée est récupérée au BUILD via l'API Strapi.
- Si une page a besoin de données, c'est dans le frontmatter Astro (`getStaticPaths` / fetch au build).

### Styles CSS
- CSS natif UNIQUEMENT — pas de Tailwind, pas de framework CSS
- `src/styles/global.css` : reset, custom properties (couleurs, typos, spacings), styles globaux
- Styles scopés dans chaque composant via `<style>` (Astro) ou `<style scoped>` (Vue)
- NE JAMAIS écrire de CSS global hors de `src/styles/`

### Composants
- Composants Astro : `.astro` — contenu statique, pas de JS côté client
- Islands Vue : `.vue` dans `src/components/islands/` — UNIQUEMENT pour l'interactivité (formulaire, carrousel)
- NE PAS utiliser Vue pour du contenu statique — utiliser Astro

### Images
- TOUJOURS utiliser le composant `<Image>` natif Astro
- NE JAMAIS utiliser `<img>` directement
- Les visuels viennent de S3 via l'API Strapi

### TypeScript
- Mode strict activé — pas de `any`
- Typer toutes les réponses API Strapi dans `src/types/strapi.ts`
- Types métier : Artiste, Oeuvre, Exposition, Thematique, ArticlePresse, MessageContact

### Relation Exposition ↔ Artiste
- PAS de relation directe dans Strapi
- Déduite au build Astro : récupérer les oeuvres d'une expo → en extraire les artistes
- NE JAMAIS créer de relation Exposition-Artiste dans le CMS

### API Strapi
- REST uniquement, pas de GraphQL
- Format de réponse Strapi natif `{ data, meta }` — pas de wrapper custom
- Seul endpoint public : POST `/api/messages-contact`
- Tout le reste est consommé au build avec un token API read-only

### Accessibilité
- HTML sémantique obligatoire : nav, main, article, section, header, footer
- Alt text descriptif sur TOUTES les images d'oeuvres et d'artistes
- Navigation clavier fonctionnelle sur tous les composants interactifs

### SEO
- Chaque page a ses meta, Open Graph et schema.org via `SeoHead.astro`
- schema.org adapté au type de contenu (artiste, oeuvre, exposition, galerie)
- Sitemap via `@astrojs/sitemap`
- `robots.txt` et `llms.txt` dans `public/`

### GEO (Generative Engine Optimization)
- `robots.txt` autorise explicitement les crawlers IA : GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended
- `llms.txt` : fichier statique dans `public/`, format llmstxt.org, description du site et structure
- `llms-full.txt` : généré au build Astro depuis les données Strapi — PAS versionné (dans `.gitignore`)
- Contenu factuel-first : chaque section de page commence par une réponse directe et factuelle, pas de marketing flou
- Paragraphes courts (2-3 phrases max) pour faciliter l'extraction par les LLMs
- Données explicites : dates, dimensions, techniques, provenance — jamais de texte vague
- Meta descriptions factuelles et citables (pas de formulations promotionnelles)
- schema.org enrichi avec champs GEO-critiques : `Person` (birthDate, nationality), `VisualArtwork` (artMedium, dateCreated, width/height), `ExhibitionEvent` (location avec PostalAddress)
- Les biographies d'artistes et descriptions d'oeuvres sont rédigées comme des sources de référence citables

## Naming Conventions

| Contexte | Convention | Exemple |
|---|---|---|
| Pages Astro | kebab-case | `a-propos.astro` |
| Composants Astro | PascalCase | `CarteOeuvre.astro` |
| Composants Vue | PascalCase | `FormulaireContact.vue` |
| Utilitaires | kebab-case | `strapi-client.ts` |
| Variables/fonctions | camelCase | `oeuvreSlug` |
| Types/interfaces | PascalCase | `Artiste` |
| Constantes | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Content types Strapi | PascalCase singulier | `Artiste` |
| Endpoints REST | pluriel | `/api/artistes` |
| Champs Strapi | camelCase | `dateDebut` |

## Anti-Patterns — NE JAMAIS FAIRE

- NE PAS utiliser `any` en TypeScript
- NE PAS faire de fetch runtime côté visiteur (sauf formulaire contact)
- NE PAS écrire de CSS global hors de `src/styles/`
- NE PAS mettre de logique métier dans les pages — extraire dans `src/lib/`
- NE PAS utiliser `<img>` — utiliser `<Image>` d'Astro
- NE PAS créer de relation directe Exposition ↔ Artiste dans Strapi
- NE PAS sur-ingénierer — KISS avant tout
- NE PAS dupliquer du code — extraire si réutilisé (DRY)
- NE PAS créer d'abstractions pour un seul usage

## Project Structure

**Deux repos séparés :**
- `galerie-front/` — Astro SSG
- `galerie-cms/` — Strapi v5

Référence complète : `_bmad-output/planning-artifacts/architecture.md`
