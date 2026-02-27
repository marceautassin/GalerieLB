# Story 1.1: Initialisation des projets front et CMS

Status: done

## Story

As a développeur,
I want initialiser les deux repos (Astro + Strapi) avec les starters définis dans l'architecture,
so that j'ai une base de code propre et configurée pour le développement.

## Acceptance Criteria

1. Le repo `galerie-front` est créé avec Astro + TypeScript strict + Vue integration
2. Le repo `galerie-cms` est créé avec Strapi v5 + TypeScript
3. ESLint + Prettier sont configurés dans les deux repos
4. Les fichiers `.env.example` sont créés avec toutes les variables documentées
5. Les deux projets démarrent sans erreur en local

## Tasks / Subtasks

- [x] Task 1 : Initialiser galerie-front (AC: #1)
  - [x] 1.1 Exécuter `npm create astro@latest galerie-front -- --typescript strict`
  - [x] 1.2 Exécuter `npx astro add vue` dans galerie-front
  - [x] 1.3 Créer la structure de dossiers : `src/pages/`, `src/layouts/`, `src/components/`, `src/components/islands/`, `src/lib/`, `src/types/`, `src/styles/`
  - [x] 1.4 Créer `src/styles/global.css` avec reset, design tokens (custom properties) et styles de base
  - [x] 1.5 Créer les fichiers statiques dans `public/` : `robots.txt` (avec crawlers IA), `llms.txt`, `favicon.svg` (placeholder)
  - [x] 1.6 Créer `.env.example` avec les variables documentées
  - [x] 1.7 Configurer `astro.config.ts` avec l'intégration Vue et le sitemap
- [x] Task 2 : Initialiser galerie-cms (AC: #2)
  - [x] 2.1 Exécuter `npx create-strapi@latest galerie-cms`
  - [x] 2.2 Installer le provider S3 : `npm install @strapi/provider-upload-aws-s3`
  - [x] 2.3 Configurer `config/plugins.ts` pour le provider S3 (lecture env vars)
  - [x] 2.4 Configurer `config/middlewares.ts` pour CORS
  - [x] 2.5 Créer `.env.example` avec toutes les variables documentées
- [x] Task 3 : Configurer ESLint + Prettier (AC: #3)
  - [x] 3.1 Installer et configurer ESLint + Prettier dans galerie-front
  - [x] 3.2 Installer et configurer ESLint + Prettier dans galerie-cms
  - [x] 3.3 Ajouter les scripts `lint` et `format` dans les deux `package.json`
- [x] Task 4 : Initialiser les repos Git (AC: #1, #2)
  - [x] 4.1 `git init` + `.gitignore` pour galerie-front (inclure `.env`, `node_modules/`, `dist/`)
  - [x] 4.2 `git init` + `.gitignore` pour galerie-cms (inclure `.env`, `node_modules/`, `.tmp/`, `build/`)
  - [x] 4.3 Commit initial dans les deux repos
- [x] Task 5 : Validation locale (AC: #5)
  - [x] 5.1 `npm run dev` fonctionne sans erreur dans galerie-front
  - [x] 5.2 `npm run develop` fonctionne sans erreur dans galerie-cms
  - [x] 5.3 `npm run lint` passe sans erreur dans les deux repos

## Dev Notes

### Commandes d'initialisation exactes

```bash
# galerie-front
npm create astro@latest galerie-front -- --typescript strict
cd galerie-front
npx astro add vue
npm install @astrojs/sitemap

# galerie-cms
npx create-strapi@latest galerie-cms
cd galerie-cms
npm install @strapi/provider-upload-aws-s3
```

### Versions cibles

- **Astro** : 5.x stable (NE PAS utiliser Astro 6 beta)
- **Strapi** : v5.31.x (dernière stable)
- **TypeScript** : strict mode activé dans les deux projets

### Structure galerie-front complète

```
galerie-front/
├── astro.config.ts
├── tsconfig.json
├── package.json
├── .env
├── .env.example
├── .gitignore
├── public/
│   ├── robots.txt          # Inclut crawlers IA (GPTBot, ClaudeBot, etc.)
│   ├── llms.txt
│   ├── llms-full.txt       # Généré au build — dans .gitignore
│   └── favicon.svg
└── src/
    ├── pages/           # (vides pour l'instant — Story 1.4+)
    │   └── index.astro  # Page placeholder
    ├── layouts/
    │   └── (vide — Story 1.4)
    ├── components/
    │   └── islands/     # Composants Vue interactifs
    ├── lib/             # Utilitaires et services
    ├── types/           # Types TypeScript
    └── styles/
        └── global.css   # Reset + design tokens + styles de base
```

### Structure galerie-cms (générée par Strapi CLI)

```
galerie-cms/
├── package.json
├── tsconfig.json
├── .env
├── .env.example
├── .gitignore
├── config/
│   ├── database.ts      # Connexion PostgreSQL via env vars
│   ├── middlewares.ts    # CORS configuré
│   ├── plugins.ts       # Provider S3 enregistré
│   └── server.ts
└── src/
    ├── admin/
    │   └── app.ts
    ├── api/             # (vide — content types dans Story 1.2+)
    └── extensions/
```

### Design Tokens — global.css

Le fichier `src/styles/global.css` DOIT contenir ces custom properties :

```css
:root {
  /* Couleurs */
  --color-bg: #FAF8F5;
  --color-text: #1A1A1A;
  --color-text-secondary: #4A4A4A;
  --color-text-tertiary: #7A7A7A;
  --color-border: #E5E2DE;
  --color-surface: #FFFFFF;
  --color-black: #000000;
  --color-success: #2D6A4F;
  --color-error: #C1292E;

  /* Typographie */
  --font-heading: 'Abhaya Libre', serif;
  --font-body: 'Inter', sans-serif;

  /* Espacements */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;

  /* Layout */
  --max-width: 1280px;

  /* Transitions */
  --transition-default: 200ms ease-in-out;
  --transition-fade: 150ms ease-in-out;
}
```

Plus : reset CSS, styles body (`background: var(--color-bg)`, `color: var(--color-text)`, `font-family: var(--font-body)`), échelle typographique headings (Abhaya Libre), focus visible global (`outline: 2px solid var(--color-text); outline-offset: 2px`).

**Fonts** : charger via Google Fonts avec `font-display: swap`. Inclure dans le `<head>` avec `<link rel="preconnect">`.

### Variables d'environnement — galerie-front/.env.example

```env
# API Strapi
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your-read-only-api-token

# Site
SITE_URL=http://localhost:4321
```

### Variables d'environnement — galerie-cms/.env.example

```env
# Base de données PostgreSQL
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=galerie_cms
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi

# Stockage S3 (Clever Cloud Cellar)
AWS_ACCESS_KEY_ID=your-access-key
AWS_ACCESS_SECRET=your-secret-key
AWS_REGION=eu-west-1
AWS_BUCKET=galerie-medias

# Email Brevo SMTP
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USERNAME=your-brevo-login
SMTP_PASSWORD=your-brevo-password
NOTIFICATION_EMAIL=louis@galerie.com

# Webhook rebuild front
WEBHOOK_FRONT_REBUILD_URL=https://api.provider.com/deploy/hook

# Strapi secrets (générés automatiquement)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-salt
ADMIN_JWT_SECRET=your-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-salt
JWT_SECRET=your-jwt-secret
```

### Configuration S3 — config/plugins.ts

```typescript
export default ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
        },
      },
    },
  },
});
```

### Configuration CORS — config/middlewares.ts

Ajouter les origines autorisées (localhost:4321 en dev, domaine prod ensuite) dans la config CORS de Strapi.

### Naming Conventions (à respecter dès le jour 1)

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
| Noms métier | **FRANÇAIS** | `Artiste`, `Oeuvre` |
| Code technique | **ANGLAIS** | `fetchData()`, `handleSubmit()` |
| Mixte | naturel | `fetchArtistes()`, `getOeuvreBySlug()` |

### Anti-patterns — NE JAMAIS FAIRE

- NE PAS utiliser `any` en TypeScript
- NE PAS utiliser de framework CSS (Tailwind, etc.)
- NE PAS écrire de CSS global hors de `src/styles/`
- NE PAS mettre de logique métier dans les pages — extraire dans `src/lib/`
- NE PAS utiliser `<img>` directement — utiliser `<Image>` d'Astro
- NE PAS créer de relation directe Exposition ↔ Artiste dans Strapi
- NE PAS installer Astro 6 beta
- NE PAS utiliser GraphQL — REST uniquement

### Project Structure Notes

- **2 repos Git séparés** : `galerie-front/` et `galerie-cms/` — PAS un monorepo
- La structure de dossiers du front doit être créée même si les fichiers seront ajoutés dans les stories suivantes
- `src/components/islands/` est le dossier dédié aux composants Vue interactifs
- `src/lib/` contiendra `strapi-client.ts`, `seo-utils.ts`, `format-utils.ts`
- `src/types/strapi.ts` contiendra les interfaces TypeScript pour les content types

### Scope de cette story

Cette story crée **uniquement l'infrastructure de base**. Les éléments suivants sont hors scope :
- Content types Strapi (Story 1.2, 1.3)
- LayoutPrincipal, Header, Nav, Footer (Story 1.4)
- Client API Strapi (Story 2.1)
- Pages (Stories 2.2+)

La page `index.astro` est un placeholder minimal qui confirme que le projet fonctionne.

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Sections: Stack technologique, Structure projet, Convention de nommage, Initialisation]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Sections: Visual Design Foundation, Design System Foundation]
- [Source: _bmad-output/project-context.md — Toutes les règles et anti-patterns]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.1]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Strapi CLI interactif — impossible de lancer `npx create-strapi@latest` en non-interactif. Résolu en installant manuellement les packages Strapi et en créant la structure.
- `esbuild` manquant — dépendance peer non installée automatiquement. Résolu avec `npm install esbuild`.
- `pg` (driver PostgreSQL) manquant — résolu avec `npm install pg`.
- PostgreSQL non disponible localement — ajout de SQLite comme fallback dev via `DATABASE_CLIENT` env var. PostgreSQL reste la cible production.

### Completion Notes List

- galerie-front : Astro 5.18.0 + Vue 3.5.29 + TypeScript strict + Sitemap
- galerie-cms : Strapi 5.37.1 + TypeScript + S3 provider + CORS configuré
- Design tokens complets dans global.css (couleurs, typo, espacements, transitions)
- Fonts : Abhaya Libre (headings) + Inter (body) via Google Fonts
- ESLint + Prettier configurés avec `no-explicit-any` dans les deux repos
- SQLite configuré comme DB de dev, PostgreSQL comme DB de production
- Les deux projets démarrent et lint sans erreur

### Change Log

- 2026-02-27 : Implémentation complète Story 1.1 — initialisation galerie-front et galerie-cms
- 2026-02-27 : Code review — corrections appliquées :
  - [H1] Import global.css dans index.astro (styles non chargés)
  - [H2] Plugin S3 conditionnel dans plugins.ts (fallback local sans S3)
  - [H3] Ajout .vscode/ au .gitignore du front
  - [M1] Suppression favicon.ico résiduel du starter Astro
  - [M2] Suppression README.md auto-généré
  - [M3] Retrait galerie-cms/.env de la File List (non versionné)
  - [M4] Ajout pattern .vue dans la config ESLint du front
  - [L1] Ajout des package-lock.json dans la File List
- 2026-02-27 : Cascade GEO — mise à jour robots.txt (crawlers IA explicites), ajout public/llms-full.txt au .gitignore

### File List

**galerie-front/ (nouveau repo)**
- galerie-front/astro.config.ts
- galerie-front/tsconfig.json
- galerie-front/package.json
- galerie-front/package-lock.json
- galerie-front/.env.example
- galerie-front/.gitignore
- galerie-front/.prettierrc
- galerie-front/eslint.config.js
- galerie-front/src/pages/index.astro
- galerie-front/src/styles/global.css
- galerie-front/public/robots.txt
- galerie-front/public/llms.txt
- galerie-front/public/favicon.svg

**galerie-cms/ (nouveau repo)**
- galerie-cms/package.json
- galerie-cms/package-lock.json
- galerie-cms/tsconfig.json
- galerie-cms/.env.example
- galerie-cms/.gitignore
- galerie-cms/.prettierrc
- galerie-cms/eslint.config.js
- galerie-cms/config/database.ts
- galerie-cms/config/server.ts
- galerie-cms/config/admin.ts
- galerie-cms/config/plugins.ts
- galerie-cms/config/middlewares.ts
- galerie-cms/src/admin/app.ts
