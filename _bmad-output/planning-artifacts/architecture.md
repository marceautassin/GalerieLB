---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2026-02-22'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
workflowType: 'architecture'
project_name: 'GallerieLouisBarrand'
user_name: 'Marceau'
date: '2026-02-22'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (11 FRs) :**
- Fiches artistes avec biographie et oeuvres liées (FR1)
- Fiches oeuvres détaillées avec liens artiste/expo et CTA contact (FR2)
- Système de tags/thématiques pour classification des oeuvres (FR3)
- Pages expositions avec préface, visuels, oeuvres associées (FR4)
- Section À propos (FR5)
- Section Presse avec PDF, liens, visuels téléchargeables (FR6)
- Formulaire de contact accessible en < 3 clics avec notification email (FR7)
- CMS back-office avec gestion complète du contenu et relations (FR8)
- SEO technique complet : SSG, sitemap, robots.txt, llms.txt, schema.org, Open Graph (FR9)
- Liens externes vers Despierre et Proantic (FR10, à confirmer)
- Mise en avant des nouveautés sur la page d'accueil (FR11)

**Non-Functional Requirements (6 NFRs) :**
- Performance : LCP < 2.5s, FID < 100ms, CLS < 0.1, images optimisées (NFR1)
- Accessibilité : WCAG 2.1 AA, navigation clavier, alt text (NFR2)
- Responsive : mobile 320px+ à desktop, aucun scroll horizontal, breakpoints UX (NFR3)
- Disponibilité : 99.5% uptime (NFR4)
- Sécurité : HTTPS, anti-spam formulaire, auth CMS (NFR5)
- Maintenabilité : contenu modifiable sans intervention développeur (NFR6)

### Scale & Complexity

- Domaine principal : web statique avec CMS headless
- Niveau de complexité : basse-moyenne
- Composants architecturaux estimés : 4 (front Astro, CMS Strapi, base PostgreSQL, stockage S3)

### Technical Constraints & Dependencies

- Stack décidée : Astro (SSG/TypeScript/islands Vue) + Strapi v5 (TypeScript) + PostgreSQL + S3 compatible
- Hébergement : Clever Cloud (CMS) + provider statique free tier (front)
- Budget : 30-40€/mois tout compris
- Email transactionnel : Brevo free tier (SMTP, notification uniquement)
- Portabilité obligatoire : aucun vendor lock-in
- Maintenance : développeur unique (Marceau), zéro devops

### Cross-Cutting Concerns

- Optimisation d'images sur tous les gabarits front
- Données structurées schema.org par type de contenu
- Relations de contenu artiste ↔ oeuvre ↔ exposition ↔ thématique
- Pipeline de rebuild automatique CMS → webhook → front
- RGPD standard sur le formulaire de contact

## Starter Template Evaluation

### Primary Technology Domain

Web statique avec CMS headless — deux composants distincts à initialiser.

### Starter Options Considered

**Front (Astro) :**
- Templates communautaires (Astroplate, AstroWind, Astroship) : rejetés — conçus pour blogs/landing pages, trop de code inutile à supprimer
- Starter minimal Astro + intégrations : retenu — projet propre, on ajoute uniquement ce qu'on utilise

**CMS (Strapi) :**
- Strapi CLI officiel : retenu — seul starter activement maintenu pour Strapi v5
- Templates communautaires (monorepo Next.js) : rejetés — couplés à Next.js, pas pertinents

### Selected Starters

**Front — Astro minimal + Vue**

Rationale : projet vierge TypeScript strict, ajout ciblé de Vue. Pas de framework CSS — CSS natif moderne avec styles scopés par composant (natif dans Astro et Vue). Pas de code superflu, architecture propre dès le départ.

Initialization :
```bash
npm create astro@latest galerie-front -- --typescript strict
cd galerie-front
npx astro add vue
```

Decisions established :
- Language : TypeScript (strict)
- Styling : CSS natif moderne (custom properties, nesting), styles scopés par composant
- Organisation CSS : `src/styles/global.css` (reset, variables, globaux) + `<style>` scopé par composant Astro/Vue
- Interactivité : Vue.js via islands architecture
- Build : SSG par défaut (Vite)
- Structure : pages Astro + composants Vue isolés

**CMS — Strapi v5 CLI officiel**

Rationale : CLI officiel, seul starter maintenu, full TypeScript, admin panel intégré.

Initialization :
```bash
npx create-strapi@latest galerie-cms
npm install @strapi/provider-upload-aws-s3
```

Decisions established :
- Language : TypeScript
- API : REST (GraphQL disponible si besoin)
- BDD : PostgreSQL via variables d'environnement
- Stockage : S3 compatible via @strapi/provider-upload-aws-s3
- Admin : panel Strapi intégré avec rôles et permissions

Note : L'initialisation des deux projets sera la première story d'implémentation.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation) :**
- Modèle de données Strapi (content types et relations)
- Pipeline de rebuild webhook CMS → front
- Structure des pages et routes Astro

**Important Decisions (Shape Architecture) :**
- Organisation CSS (global + scopé)
- Stratégie SEO (schema.org, sitemap, meta)
- Optimisation images via Astro `<Image>`

**Deferred Decisions (Post-MVP / Growth) :**
- Anti-spam (Turnstile si nécessaire)
- Rate limiting API
- Environnement de staging
- Multi-langue FR/EN

### Data Architecture

**Content Types Strapi :**
- Artiste : nom, biographie, contexte artistique, photo, slug
- Oeuvre : titre, technique, dimensions, provenance, visuel(s), slug
- Exposition : titre, dates début/fin, préface, visuels, statut (en cours/passée)
- Thematique : nom, slug
- ArticlePresse : titre, type (PDF/lien), fichier PDF, URL externe, visuel
- MessageContact : nom, email, message, oeuvre/expo de référence, date
- APropos (single type) : biographie Louis, texte Prix Marcus, adresse, horaires

**Relations :**
- Artiste → Oeuvre : one-to-many
- Oeuvre ↔ Thematique : many-to-many
- Oeuvre ↔ Exposition : many-to-many
- Exposition ↔ Artiste : pas de relation directe — déduite au build Astro via les oeuvres liées

**Rationale relation déduite :** simplifie le CMS pour Louis, évite les incohérences, le calcul se fait une seule fois au build SSG.

**Validation :** native Strapi (champs requis, types)
**Rebuild :** complet à chaque modification (pas d'incrémental — le volume est faible)
**Anti-spam formulaire :** aucun dans le MVP — Louis modère dans Strapi. Turnstile en Growth si nécessaire.

### Authentication & Security

- Visiteurs : aucune auth, site public
- Admin : auth Strapi native (login/mot de passe)
- HTTPS : géré par les providers
- CORS : origines autorisées configurées dans Strapi pour le formulaire de contact
- Permissions API : seul POST /api/messages-contact est public, tout le reste est verrouillé

### API & Communication Patterns

- API REST Strapi (pas de GraphQL — inutile pour 6 content types)
- Consommation API au build uniquement (SSG) — pas de calls runtime côté visiteur
- Seul appel runtime : POST formulaire de contact directement sur Strapi
- Webhook Strapi → provider front pour trigger le rebuild après publication de contenu

### Frontend Architecture

**Structure des pages :**
- `src/pages/index.astro` — accueil + nouveautés
- `src/pages/artistes/index.astro` — liste artistes
- `src/pages/artistes/[slug].astro` — fiche artiste
- `src/pages/oeuvres/index.astro` — catalogue oeuvres
- `src/pages/oeuvres/[slug].astro` — fiche oeuvre
- `src/pages/expositions/index.astro` — liste expos
- `src/pages/expositions/[slug].astro` — fiche expo
- `src/pages/a-propos.astro` — à propos
- `src/pages/presse.astro` — section presse
- `src/pages/contact.astro` — formulaire

**Composants :**
- Layout principal (header, nav, footer)
- Composants réutilisables : carte oeuvre, carte artiste, carte expo, galerie d'images
- Islands Vue : formulaire de contact, carrousel/lightbox visuels

**Styles :**
- CSS natif moderne (custom properties, nesting)
- `src/styles/global.css` : reset, variables, styles globaux
- Styles scopés par composant (natif Astro et Vue)

**Images :**
- Composant `<Image>` natif Astro : redimensionnement, WebP/AVIF, lazy loading
- Visuels stockés sur S3, optimisés au build

**SEO :**
- Layout SEO avec meta, Open Graph, schema.org dynamiques par page
- `@astrojs/sitemap` pour le sitemap XML
- `robots.txt` et `llms.txt` en fichiers statiques dans `public/`

**GEO (Generative Engine Optimization) :**
- `robots.txt` : crawlers IA autorisés explicitement (GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended)
- `llms.txt` : fichier statique dans `public/`, format llmstxt.org, description du site et liens vers les pages clés
- `llms-full.txt` : fichier généré au build Astro depuis les données Strapi (artistes, oeuvres, expositions, à propos) — PAS versionné, ajouté au `.gitignore`
- Contenu structuré factuel-first : chaque section commence par une réponse directe, paragraphes courts (2-3 phrases), données explicites (dates, dimensions, techniques)
- schema.org enrichi GEO-critiques : `Person` (birthDate, nationality), `VisualArtwork` (artMedium, dateCreated, width/height), `ExhibitionEvent` (location avec PostalAddress)

### Infrastructure & Deployment

**Repos :** deux repos Git séparés (front + CMS)
**Environnements :** local + production (pas de staging)
**Prévisualisation contenu :** système draft/publish natif de Strapi

**Pipeline de déploiement :**
- CMS : git push → Clever Cloud (auto-deploy)
- Front : git push → provider statique (auto-build + deploy)
- Contenu : Louis publie dans Strapi → webhook → rebuild front automatique

**Coûts estimés :**
- Clever Cloud Node.js nano (Strapi) : ~6€/mois
- Clever Cloud PostgreSQL : ~5-8€/mois
- Clever Cloud Cellar S3 : ~2-3€/mois
- Provider statique front : 0€ (free tier)
- Brevo SMTP : 0€ (free tier)
- Total : ~15-18€/mois

### Decision Impact Analysis

**Séquence d'implémentation :**
1. Init repos + starters (Astro + Strapi)
2. Modèle de données Strapi (content types + relations)
3. Configuration S3 + PostgreSQL
4. Layout principal + styles globaux
5. Pages et composants front
6. Intégration API Strapi → Astro (fetch au build)
7. Formulaire de contact (island Vue + endpoint Strapi + Brevo)
8. SEO (schema.org, sitemap, meta, robots.txt, llms.txt)
9. Webhook rebuild
10. Déploiement production

**Dépendances cross-composants :**
- Le front dépend du modèle de données Strapi (API shape)
- Le webhook dépend des deux déploiements en production
- Le formulaire dépend de la config Brevo SMTP dans Strapi

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Langue du code :**
- Noms métier en français : Artiste, Oeuvre, Exposition, Thematique, ArticlePresse, MessageContact
- Code technique en anglais : fetchData(), handleSubmit(), formatDate(), useQuery()
- Mixte naturel : fetchArtistes(), getOeuvreBySlug(), handleContactSubmit()

**Fichiers et dossiers :**
- Pages Astro : kebab-case — `a-propos.astro`, `[slug].astro`
- Composants Astro : PascalCase — `CarteOeuvre.astro`, `LayoutPrincipal.astro`
- Composants Vue : PascalCase — `FormulaireContact.vue`, `CarrouselImages.vue`
- Utilitaires/services : kebab-case — `strapi-client.ts`, `seo-utils.ts`
- CSS : kebab-case — `global.css`, `variables.css`

**Code TypeScript :**
- Variables et fonctions : camelCase — `oeuvreSlug`, `getArtistes()`
- Types et interfaces : PascalCase — `Artiste`, `Oeuvre`, `Exposition`
- Constantes : UPPER_SNAKE_CASE — `API_BASE_URL`, `SITE_TITLE`

**Strapi / API :**
- Content types : PascalCase singulier — `Artiste`, `Oeuvre`
- Endpoints REST : pluriel — `/api/artistes`, `/api/oeuvres`
- Champs : camelCase — `dateDebut`, `contexteArtistique`

### Structure Patterns

**Organisation du repo front (Astro) :**
- `src/pages/` — pages et routes
- `src/components/` — composants Astro réutilisables
- `src/components/islands/` — composants Vue (islands interactives)
- `src/layouts/` — layouts de page
- `src/styles/` — CSS global et variables
- `src/lib/` — utilitaires, client API, helpers
- `src/types/` — types TypeScript partagés
- `public/` — fichiers statiques (robots.txt, llms.txt, favicons)

**Organisation du repo CMS (Strapi) :**
- Structure Strapi standard générée par le CLI
- `src/api/` — content types et contrôleurs custom
- `config/` — configuration (database, plugins, middleware)

### Format Patterns

**API Strapi → Front :**
- Réponses REST Strapi standard (format `{ data, meta }`)
- Dates en ISO 8601 string
- Pas de wrapper custom — on utilise la structure Strapi native

**Formulaire de contact :**
- POST JSON vers `/api/messages-contact`
- Réponse succès : HTTP 200 + `{ data: { id } }`
- Réponse erreur : HTTP 400/500 + structure d'erreur Strapi standard

### Process Patterns

**Gestion des erreurs (front) :**
- Erreurs au build (fetch API échoué) : le build échoue, pas de déploiement silencieux avec des pages vides
- Erreurs runtime (formulaire) : message d'erreur utilisateur clair en français, pas de stack trace

**Loading states :**
- Pas de loading states côté visiteur — le site est statique (SSG)
- Seul le formulaire de contact a un état de soumission : idle → submitting → success/error

### Monitoring

**Uptime (MVP) :**
- UptimeRobot free tier : ping toutes les 5 min sur le site front + Strapi admin
- Alerte email si down

**Analytics (Growth) :**
- Solution à choisir en Growth (Plausible, Matomo Cloud, Cloudflare Analytics)
- Objectif : tracking visiteurs, pages vues, parcours utilisateur

### Enforcement Guidelines

**Tous les agents IA DOIVENT :**
- Respecter la convention mixte FR/EN (métier français, technique anglais)
- Utiliser les conventions de nommage de fichiers définies ci-dessus
- Ne jamais exposer d'endpoint Strapi public autre que POST /api/messages-contact
- Utiliser le composant `<Image>` natif Astro pour tout visuel
- Écrire les styles en CSS scopé dans les composants, styles globaux uniquement dans `src/styles/`
- Utiliser du HTML sémantique (nav, main, article, section, header, footer)
- Ajouter un alt text descriptif sur toutes les images d'oeuvres et d'artistes
- Tester la navigation clavier sur tous les composants interactifs

**Règles GEO (Generative Engine Optimization) :**
- Contenu factuel-first : chaque section de page commence par une réponse directe et factuelle, pas de marketing flou
- Paragraphes courts (2-3 phrases max) pour faciliter l'extraction par les LLMs
- Données explicites : dates, dimensions, techniques, provenance — jamais de texte vague
- schema.org complet avec tous les champs spécifiques au domaine de l'art
- Meta descriptions factuelles et citables (pas de formulations promotionnelles)

**Anti-patterns à éviter :**
- Pas de `any` en TypeScript — typer toutes les réponses API
- Pas de fetch runtime côté visiteur (sauf formulaire) — tout est SSG
- Pas de CSS global hors de `src/styles/` — utiliser le scoping natif
- Pas de logique métier dans les pages — extraire dans `src/lib/`

## Project Structure & Boundaries

### Complete Project Directory Structure

**Front — galerie-front/**

```
galerie-front/
├── astro.config.ts
├── tsconfig.json
├── package.json
├── .env
├── .env.example
├── .gitignore
├── public/
│   ├── robots.txt
│   ├── llms.txt
│   ├── llms-full.txt          # Généré au build — PAS versionné
│   └── favicon.svg
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── a-propos.astro
│   │   ├── presse.astro
│   │   ├── contact.astro
│   │   ├── artistes/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── oeuvres/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── expositions/
│   │       ├── index.astro
│   │       └── [slug].astro
│   ├── layouts/
│   │   └── LayoutPrincipal.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Nav.astro
│   │   ├── CarteArtiste.astro
│   │   ├── CarteOeuvre.astro
│   │   ├── CarteExposition.astro
│   │   ├── GalerieImages.astro
│   │   ├── SeoHead.astro
│   │   └── islands/
│   │       ├── FormulaireContact.vue
│   │       └── CarrouselImages.vue
│   ├── lib/
│   │   ├── strapi-client.ts
│   │   ├── seo-utils.ts
│   │   └── format-utils.ts
│   ├── types/
│   │   └── strapi.ts
│   └── styles/
│       └── global.css
```

**CMS — galerie-cms/**

```
galerie-cms/
├── package.json
├── tsconfig.json
├── .env
├── .env.example
├── .gitignore
├── config/
│   ├── database.ts
│   ├── middlewares.ts
│   ├── plugins.ts
│   └── server.ts
├── src/
│   ├── admin/
│   │   └── app.ts
│   ├── api/
│   │   ├── artiste/
│   │   │   ├── content-types/artiste/schema.json
│   │   │   ├── controllers/artiste.ts
│   │   │   ├── routes/artiste.ts
│   │   │   └── services/artiste.ts
│   │   ├── oeuvre/
│   │   │   ├── content-types/oeuvre/schema.json
│   │   │   ├── controllers/oeuvre.ts
│   │   │   ├── routes/oeuvre.ts
│   │   │   └── services/oeuvre.ts
│   │   ├── exposition/
│   │   │   ├── content-types/exposition/schema.json
│   │   │   ├── controllers/exposition.ts
│   │   │   ├── routes/exposition.ts
│   │   │   └── services/exposition.ts
│   │   ├── thematique/
│   │   │   ├── content-types/thematique/schema.json
│   │   │   ├── controllers/thematique.ts
│   │   │   ├── routes/thematique.ts
│   │   │   └── services/thematique.ts
│   │   ├── article-presse/
│   │   │   ├── content-types/article-presse/schema.json
│   │   │   ├── controllers/article-presse.ts
│   │   │   ├── routes/article-presse.ts
│   │   │   └── services/article-presse.ts
│   │   └── message-contact/
│   │       ├── content-types/message-contact/schema.json
│   │       ├── controllers/message-contact.ts
│   │       ├── routes/message-contact.ts
│   │       ├── services/message-contact.ts
│   │       └── lifecycles.ts
│   └── extensions/
└── types/
    └── generated/
```

### Architectural Boundaries

**API Boundaries :**
- Front → Strapi : fetch REST au build uniquement (toutes les collections)
- Visiteur → Strapi : POST `/api/messages-contact` uniquement (runtime)
- Strapi → Brevo : SMTP sortant pour notification email (dans `lifecycles.ts` de message-contact)
- Strapi → Provider front : webhook POST pour trigger rebuild

**Data Flow :**
```
Louis (CMS) → Strapi → PostgreSQL + S3
                 ↓ webhook
         Provider front rebuild
                 ↓
     Astro fetch API → build SSG → dist/ statique
                 ↓
         Visiteur (HTML statique)
                 ↓ formulaire
         POST → Strapi → email Louis (Brevo)
```

### Requirements to Structure Mapping

| FR | Front | CMS |
|---|---|---|
| FR1 Artistes | `pages/artistes/`, `CarteArtiste.astro` | `api/artiste/` |
| FR2 Oeuvres | `pages/oeuvres/`, `CarteOeuvre.astro` | `api/oeuvre/` |
| FR3 Tags | `pages/oeuvres/` (filtrage) | `api/thematique/` |
| FR4 Expositions | `pages/expositions/`, `CarteExposition.astro` | `api/exposition/` |
| FR5 À propos | `pages/a-propos.astro` | Page single type Strapi |
| FR6 Presse | `pages/presse.astro` | `api/article-presse/` |
| FR7 Contact | `pages/contact.astro`, `FormulaireContact.vue` | `api/message-contact/` + `lifecycles.ts` |
| FR8 CMS | — | Admin panel Strapi |
| FR9 SEO | `SeoHead.astro`, `lib/seo-utils.ts`, `public/` | — |
| FR10 Liens | `components/Footer.astro` | — |
| FR11 Nouveautés | `pages/index.astro` | Query tri par date |

### Environment Variables

**galerie-front/.env :**
- `STRAPI_API_URL` — URL de l'API Strapi
- `STRAPI_API_TOKEN` — Token API read-only pour le build
- `SITE_URL` — URL du site en production

**galerie-cms/.env :**
- `DATABASE_CLIENT`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` — PostgreSQL
- `AWS_ACCESS_KEY_ID`, `AWS_ACCESS_SECRET`, `AWS_REGION`, `AWS_BUCKET` — S3 compatible
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` — Brevo SMTP
- `NOTIFICATION_EMAIL` — adresse email de Louis
- `WEBHOOK_FRONT_REBUILD_URL` — URL du webhook de rebuild front
- `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET` — secrets Strapi

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility :** toutes les technologies fonctionnent ensemble sans conflit. Astro SSG + Strapi REST + TypeScript + S3 + Brevo SMTP = stack cohérente et bien documentée.

**Pattern Consistency :** conventions de nommage alignées avec les standards de chaque technologie. Convention mixte FR/EN appliquée uniformément.

**Structure Alignment :** la structure des deux repos supporte toutes les décisions architecturales. Les boundaries sont claires.

### Requirements Coverage ✅

**Functional Requirements :** 11/11 FRs couverts architecturalement.

**Non-Functional Requirements :** 6/6 NFRs adressés. NFR2 (Accessibilité) traité au niveau composants via enforcement guidelines (HTML sémantique, alt text, navigation clavier).

### Implementation Readiness ✅

**Decision Completeness :** toutes les décisions critiques documentées avec rationale.
**Structure Completeness :** arborescence complète et spécifique pour les deux repos.
**Pattern Completeness :** conventions de nommage, structure, formats et process couverts.

### Gaps Addressed

1. **Single type `APropos` ajouté** au modèle de données Strapi — contenu éditable par Louis (bio, Prix Marcus, horaires, adresse)
2. **Accessibilité** ajoutée aux enforcement guidelines — HTML sémantique, alt text obligatoire, navigation clavier
3. **Tests** — stratégie à définir, non bloquant pour le MVP
4. **Linter/Formatter** — ESLint + Prettier recommandés, à configurer à l'init

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Contexte projet analysé
- [x] Scale et complexité évalués
- [x] Contraintes techniques identifiées
- [x] Préoccupations transversales mappées

**✅ Architectural Decisions**
- [x] Décisions critiques documentées
- [x] Stack technique complètement spécifiée
- [x] Patterns d'intégration définis
- [x] Considérations de performance adressées

**✅ Implementation Patterns**
- [x] Conventions de nommage établies
- [x] Patterns de structure définis
- [x] Patterns de communication spécifiés
- [x] Patterns de process documentés

**✅ Project Structure**
- [x] Arborescence complète définie
- [x] Boundaries de composants établies
- [x] Points d'intégration mappés
- [x] Mapping FRs → structure complet

### Architecture Readiness Assessment

**Overall Status : READY FOR IMPLEMENTATION**

**Confidence Level : High**

**Points forts :**
- Architecture simple et pragmatique — adaptée au scope du projet
- Portabilité totale — aucun vendor lock-in
- CMS simple pour Louis — content types clairs, relations explicites
- SEO-first — SSG + schema.org + sitemap dès le MVP
- Budget maîtrisé — ~15-18€/mois

**Améliorations futures (Growth) :**
- Analytics (Plausible/Matomo)
- Anti-spam (Turnstile)
- Multi-langue FR/EN
- Rate limiting API
- Stratégie de test formalisée

### Implementation Handoff

**Tous les agents IA doivent :**
- Suivre toutes les décisions architecturales exactement comme documenté
- Utiliser les patterns d'implémentation de manière consistante
- Respecter la structure projet et les boundaries
- Utiliser du HTML sémantique, des alt text sur toutes les images, et tester la navigation clavier
- Se référer à ce document pour toute question architecturale

**Première priorité d'implémentation :**
1. Init des deux repos avec les commandes starter
2. Configuration ESLint + Prettier
3. Modèle de données Strapi (6 collections + 1 single type APropos)
