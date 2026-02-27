# Story 6.3: Nom de domaine, monitoring et go-live

Status: ready-for-dev

## Story

As a Louis (propriétaire de la galerie),
I want que le site soit accessible sur un nom de domaine professionnel et surveillé,
so that la galerie ait une présence en ligne crédible et fiable.

## Acceptance Criteria

1. Site accessible sur le domaine choisi (ex: galerielouisbarrand.com)
2. HTTPS actif sur le domaine
3. Redirections www → non-www (ou inverse) configurées
4. UptimeRobot configuré : site front et Strapi admin monitorés (ping 5 min)
5. Alerte email à Marceau en cas de downtime
6. Sitemap soumis à Google Search Console
7. robots.txt vérifié dans Search Console
8. Test complet du parcours utilisateur (navigation, fiches, formulaire, email)

## Tasks / Subtasks

- [ ] Task 1 : Configurer le nom de domaine (AC: #1, #2, #3)
  - [ ] 1.1 Acheter/configurer le domaine (par Louis ou Marceau)
  - [ ] 1.2 Configurer les DNS vers le provider statique (front)
  - [ ] 1.3 Activer HTTPS (certificat Let's Encrypt automatique)
  - [ ] 1.4 Configurer la redirection www → non-www (ou inverse)
  - [ ] 1.5 Mettre à jour `SITE_URL` dans les env vars du front
  - [ ] 1.6 Mettre à jour `site` dans `astro.config.ts`
- [ ] Task 2 : Configurer le monitoring (AC: #4, #5)
  - [ ] 2.1 Créer un compte UptimeRobot free tier
  - [ ] 2.2 Ajouter un monitor HTTP(S) pour le site front (ping 5 min)
  - [ ] 2.3 Ajouter un monitor pour le Strapi admin
  - [ ] 2.4 Configurer les alertes email vers Marceau
- [ ] Task 3 : Google Search Console (AC: #6, #7)
  - [ ] 3.1 Vérifier la propriété du domaine dans Search Console
  - [ ] 3.2 Soumettre le sitemap (`sitemap-index.xml`)
  - [ ] 3.3 Vérifier que robots.txt est correctement lu
- [ ] Task 4 : Test go-live complet (AC: #8)
  - [ ] 4.1 Parcours Sophie : Accueil → Artistes → Fiche artiste → Oeuvre → CTA → Formulaire → Confirmation
  - [ ] 4.2 Parcours Thomas : Google → Fiche artiste → Explorer → Contact
  - [ ] 4.3 Parcours Claire : Oeuvres → Filtre thématique → Fiches → Contact
  - [ ] 4.4 Vérifier la réception de l'email de notification (Brevo)
  - [ ] 4.5 Tester sur mobile (iPhone Safari, Android Chrome)
  - [ ] 4.6 Lancer Lighthouse : Performance > 90, Accessibility > 95, SEO > 90

## Dev Notes

### Domaine

Louis n'a pas encore de domaine. Le choix sera fait conjointement. Options : galerielouisbarrand.com, galeriebarrand.com, etc.

### Budget monitoring

UptimeRobot free tier : 50 monitors, ping 5 min. Largement suffisant.

### Checklist go-live

C'est la dernière story du projet. Une fois validée :
- Le site est en production
- Louis peut gérer son contenu
- Le contenu se met à jour automatiquement
- Le monitoring est en place
- Le SEO est configuré

### Prérequis

- Stories 6.1 et 6.2 complétées (CMS et front déployés)
- Nom de domaine choisi et acheté
- Tout le contenu de test remplacé par du vrai contenu

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Déploiement, monitoring, domaine]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 6, Story 6.3]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
