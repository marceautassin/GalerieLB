# CLAUDE.md

## Principes de code
- Suivre scrupuleusement les principes **DRY**, **KISS** et **SOLID** dans tout le code produit.
- Ne pas dupliquer la logique. Extraire dans `src/lib/` si utilisé à plus d'un endroit.
- Privilégier la solution la plus simple. Pas d'abstraction prématurée.
- Responsabilité unique par fichier/fonction.

## Git Commits
- Ne JAMAIS ajouter `Co-Authored-By: Claude` ou toute signature Claude dans les messages de commit.
- Toujours commiter dans les **3 repos** quand c'est pertinent :
  - `galerie-front/` pour le code front-end Astro
  - `galerie-cms/` pour le code CMS Strapi
  - Repo racine (`/home/marceautassin/Code/GalerieLouisBarrand/`) pour les fichiers spec (`_bmad-output/`)

## Project Structure
- Deux repos git séparés : `galerie-cms/` (Strapi v5) et `galerie-front/` (Astro). Le `.gitignore` racine exclut les deux.
- Strapi v5 utilise `schema.ts` avec `export default` (pas `schema.json`).
- Strapi v5 singleType nécessite des `singularName` et `pluralName` distincts.

## Key Patterns
- Utilitaire slugify partagé : `galerie-cms/src/lib/slugify.ts` — importé par tous les lifecycle hooks.
- Permissions API stockées en DB uniquement (volatiles) — risque documenté pour Story 6.1.

## Admin Dev
- Credentials dev : `admin@galerie.test` / `Admin12345` (SQLite)
