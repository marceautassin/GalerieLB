# Story 6.2: Déploiement front et webhook rebuild

Status: ready-for-dev

## Story

As a visiteur,
I want accéder au site en ligne avec du contenu à jour,
so that je puisse découvrir la galerie à tout moment.

## Acceptance Criteria

1. Le build Astro SSG se connecte à l'API Strapi en production
2. Le site est accessible via HTTPS sur le domaine choisi
3. Déploiement automatique sur git push
4. Louis publie du contenu dans Strapi → webhook déclenche un rebuild
5. Le nouveau contenu est visible sur le site sans intervention de Marceau
6. Délai publication CMS → mise à jour site < 5 minutes

## Tasks / Subtasks

- [ ] Task 1 : Déployer le front sur le provider statique (AC: #1, #2, #3)
  - [ ] 1.1 Choisir le provider statique free tier (Netlify, Vercel, Cloudflare Pages)
  - [ ] 1.2 Connecter le repo galerie-front
  - [ ] 1.3 Configurer les variables d'environnement : STRAPI_API_URL (prod), STRAPI_API_TOKEN (prod)
  - [ ] 1.4 Build command : `npm run build`, publish directory : `dist/`
  - [ ] 1.5 Vérifier que le build réussit et que le site est accessible
- [ ] Task 2 : Configurer le webhook rebuild (AC: #4, #5, #6)
  - [ ] 2.1 Créer un deploy hook sur le provider (URL de rebuild)
  - [ ] 2.2 Configurer `WEBHOOK_FRONT_REBUILD_URL` dans les env vars Strapi (Clever Cloud)
  - [ ] 2.3 Configurer un webhook dans Strapi admin (Settings → Webhooks) déclenché sur publish/update
  - [ ] 2.4 Tester : publier une oeuvre dans Strapi → vérifier que le rebuild se déclenche
  - [ ] 2.5 Vérifier que le contenu mis à jour apparaît après le rebuild
- [ ] Task 3 : Validation (AC: #6)
  - [ ] 3.1 Mesurer le délai entre publication et apparition sur le site (cible < 5 min)
  - [ ] 3.2 Tester le déploiement automatique via git push

## Dev Notes

### Provider statique — Options free tier

| Provider | Build minutes/mois | Bandwidth | Remarques |
|---|---|---|---|
| Netlify | 300 | 100GB | Deploy hooks natifs |
| Vercel | Illimité (hobby) | 100GB | Deploy hooks natifs |
| Cloudflare Pages | 500 | Illimité | Deploy hooks via API |

Le choix sera fait par Marceau selon ses préférences.

### Webhook Strapi → Rebuild

Strapi v5 a un système de webhooks intégré (Settings → Webhooks dans l'admin). Configurer un webhook sur les événements `entry.publish`, `entry.update`, `entry.delete` qui appelle l'URL de deploy hook du provider.

### Prérequis

- Story 6.1 complétée (CMS en production)
- Tout le front développé et testé (Stories 1.4 à 5.3)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Pipeline rebuild, webhook]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 6, Story 6.2]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
