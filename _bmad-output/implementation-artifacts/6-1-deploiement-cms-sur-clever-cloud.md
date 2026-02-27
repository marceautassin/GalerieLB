# Story 6.1: Déploiement CMS sur Clever Cloud

Status: ready-for-dev

## Story

As a Louis (administrateur),
I want que le CMS soit accessible en ligne de manière permanente,
so that je puisse gérer le contenu du site depuis n'importe où.

## Acceptance Criteria

1. Instance Node.js nano héberge Strapi v5 sur Clever Cloud
2. PostgreSQL provisionné et connecté via variables d'environnement
3. Cellar S3 provisionné pour le stockage des visuels
4. Variables d'environnement configurées (BDD, S3, Brevo SMTP, secrets Strapi)
5. Déploiement automatique sur git push
6. Panel admin Strapi accessible via HTTPS
7. Louis peut se connecter et gérer le contenu

## Tasks / Subtasks

- [ ] Task 1 : Provisionner Clever Cloud (AC: #1, #2, #3)
  - [ ] 1.1 Créer une application Node.js (plan nano, ~6€/mois)
  - [ ] 1.2 Provisionner un add-on PostgreSQL (~5-8€/mois)
  - [ ] 1.3 Provisionner un add-on Cellar S3 (~2-3€/mois)
  - [ ] 1.4 Lier les add-ons à l'application
- [ ] Task 2 : Configurer les variables d'environnement (AC: #4)
  - [ ] 2.1 Variables BDD : DATABASE_CLIENT, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD
  - [ ] 2.2 Variables S3 : AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET, AWS_REGION, AWS_BUCKET
  - [ ] 2.3 Variables SMTP : SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, NOTIFICATION_EMAIL
  - [ ] 2.4 Secrets Strapi : APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, TRANSFER_TOKEN_SALT, JWT_SECRET
  - [ ] 2.5 Variable webhook : WEBHOOK_FRONT_REBUILD_URL (placeholder si pas encore le front)
- [ ] Task 3 : Déployer (AC: #5, #6)
  - [ ] 3.1 Connecter le repo galerie-cms à Clever Cloud
  - [ ] 3.2 Premier déploiement via git push
  - [ ] 3.3 Vérifier que Strapi démarre sans erreur
  - [ ] 3.4 Accéder au panel admin via HTTPS
- [ ] Task 4 : Créer le compte admin et tester (AC: #7)
  - [ ] 4.1 Créer le compte admin pour Louis
  - [ ] 4.2 Créer le token API read-only en production
  - [ ] 4.3 Tester : créer un artiste, uploader une image, vérifier S3
  - [ ] 4.4 Tester : soumettre un message contact, vérifier l'email Brevo

## Dev Notes

### Budget estimé

- Node.js nano : ~6€/mois
- PostgreSQL : ~5-8€/mois
- Cellar S3 : ~2-3€/mois
- **Total CMS : ~13-17€/mois**

### Clever Cloud — Spécificités

- Le déploiement se fait via `git push clever master`
- Clever Cloud détecte automatiquement Node.js et exécute `npm run build` puis `npm start`
- Vérifier que le `package.json` de Strapi a les bons scripts

### Prérequis

- Tout le CMS développé et testé en local (Stories 1.1 à 1.3, 4.1)
- Compte Brevo créé avec credentials SMTP
- Compte Clever Cloud actif

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Déploiement, Clever Cloud, budget]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 6, Story 6.1]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
