# Galerie Louis Barrand

Site vitrine de la Galerie Louis Barrand, galerie d'art spécialisée en peinture moderne et contemporaine à Aix-en-Provence.

- **Front** : [Astro](https://astro.build/) (SSG) + TypeScript + Vue (islands)
- **CMS** : [Strapi v5](https://strapi.io/) + TypeScript
- **Stockage medias** : S3-compatible (Minio en dev, Clever Cloud Cellar en prod)
- **Base de donnees** : PostgreSQL (Docker en dev, Clever Cloud en prod)

## Prerequis

- [Node.js](https://nodejs.org/) >= 20
- [Yarn](https://classic.yarnpkg.com/) >= 1.22
- [Docker](https://www.docker.com/) et Docker Compose (pour PostgreSQL et Minio)

## Installation

```bash
# Cloner le repo
git clone git@github.com:<org>/GalerieLouisBarrand.git
cd GalerieLouisBarrand

# Installer les dependances
cd galerie-cms && yarn install && cd ..
cd galerie-front && yarn install && cd ..
```

## Configuration

### CMS (Strapi)

Copier le fichier d'exemple et adapter si besoin :

```bash
cp galerie-cms/.env.example galerie-cms/.env
```

Variables importantes :

| Variable            | Description            | Dev                     |
| ------------------- | ---------------------- | ----------------------- |
| `DATABASE_CLIENT`   | `postgres`             | `postgres`              |
| `AWS_ACCESS_KEY_ID` | Cle S3                 | `minioadmin`            |
| `AWS_ACCESS_SECRET` | Secret S3              | `minioadmin`            |
| `AWS_BUCKET`        | Nom du bucket          | `galerie-medias`        |
| `S3_ENDPOINT`       | Endpoint S3 custom     | `http://localhost:9000` |

### Front (Astro)

```bash
cp galerie-front/.env.example galerie-front/.env
```

| Variable           | Description         | Dev                       |
| ------------------ | ------------------- | ------------------------- |
| `STRAPI_API_URL`   | URL de l'API Strapi | `http://localhost:1337`   |
| `STRAPI_API_TOKEN` | Token API read-only | A creer dans Strapi admin |
| `SITE_URL`         | URL du site         | `http://localhost:4321`   |

## Demarrage

### 1. Lancer les services Docker (PostgreSQL + Minio)

```bash
docker compose up -d
```

Services disponibles :

- **PostgreSQL** : `localhost:5432` (user: `strapi`, password: `strapi`, db: `galerie_cms`)
- **Minio API S3** : http://localhost:9000
- **Minio Console** : http://localhost:9001 (login : `minioadmin` / `minioadmin`)

Le bucket `galerie-medias` est cree automatiquement au premier lancement.

### 2. Lancer Strapi

```bash
cd galerie-cms
yarn develop
```

Strapi demarre sur http://localhost:1337.

Au premier lancement, creer le compte admin :

- Email : `admin@galerie.test`
- Mot de passe : `Admin12345`

Puis creer un **API Token** (Settings > API Tokens) :

- Name : `front-read`
- Type : `Full access` (ou `Read-only` si custom)
- Copier le token dans `galerie-front/.env` (`STRAPI_API_TOKEN`)

### 3. Peupler avec des donnees de test

```bash
cd galerie-cms

# Creer un token full-access dans Strapi admin (Settings > API Tokens)
# Puis lancer le seed :
STRAPI_URL=http://localhost:1337 STRAPI_TOKEN=<votre-token> npx tsx scripts/seed.ts
```

Le script cree :

- 5 thematiques (Paysages, Portraits, Natures mortes, Abstraction, Scenes de genre)
- 5 artistes avec biographies et photos
- 14 oeuvres avec visuels, techniques, dimensions et relations
- 3 expositions avec prefaces et oeuvres associees
- 3 articles de presse
- Page A propos complete

Le script est idempotent : relancez-le sans crainte de doublons.

### 4. Lancer le front Astro

```bash
cd galerie-front
yarn dev
```

Le site est accessible sur http://localhost:4321.

## Structure du projet

```
GalerieLouisBarrand/
  galerie-cms/          # Strapi v5 — CMS headless
    config/             # Configuration Strapi (DB, plugins, middlewares)
    src/api/            # Content-types (artiste, oeuvre, exposition, ...)
    src/lib/            # Utilitaires (slugify)
    scripts/            # Scripts (seed)
  galerie-front/        # Astro — Site statique
    src/components/     # Composants Astro + islands Vue
    src/layouts/        # Layout principal
    src/lib/            # Client API Strapi, utilitaires
    src/pages/          # Pages (artistes, oeuvres, expositions, ...)
    src/styles/         # CSS global (design tokens, reset)
    src/types/          # Types TypeScript
  docker-compose.yml    # PostgreSQL + Minio (S3 local)
```

## Scripts utiles

### CMS

```bash
cd galerie-cms
yarn develop    # Dev avec hot reload
yarn build      # Build pour production
yarn start      # Demarrer en production
yarn lint       # ESLint
yarn format     # Prettier
```

### Front

```bash
cd galerie-front
yarn dev        # Dev avec hot reload
yarn build      # Build SSG (genere dist/)
yarn preview    # Preview du build
yarn lint       # ESLint
yarn format     # Prettier
```

## Deploiement

- **CMS** : Clever Cloud (Node.js) + PostgreSQL + Cellar (S3)
- **Front** : Build statique, deploiement via webhook Strapi

En production, remplacer les variables S3 :

```env
AWS_ACCESS_KEY_ID=<cellar-key>
AWS_ACCESS_SECRET=<cellar-secret>
AWS_BUCKET=galerie-medias
S3_ENDPOINT=https://cellar-c2.services.clever-cloud.com
```

## Licence

Projet prive — Galerie Louis Barrand.
