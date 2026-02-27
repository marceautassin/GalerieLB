---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
status: 'complete'
completedAt: '2026-02-25'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
---

# GallerieLouisBarrand - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for GallerieLouisBarrand, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR1: Fiches artistes avec biographie, contexte artistique et liste des oeuvres associées
- FR2: Fiches oeuvres détaillées (titre, artiste, technique, dimensions, visuel, provenance) avec liens artiste/expo et CTA contact
- FR3: Système de tags/thématiques pour classification et navigation des oeuvres
- FR4: Expositions avec titre, dates, préface, visuels, oeuvres/artistes présentés, distinction passées/en cours
- FR5: Section À propos (parcours Louis Barrand, Prix Marcus, adresse, horaires)
- FR6: Section Presse (articles PDF téléchargeables, liens publications, visuels haute résolution)
- FR7: Formulaire de contact accessible en < 3 clics, notification email, confirmation visiteur
- FR8: CMS back-office avec CRUD complet (artistes, oeuvres, expositions, presse), upload visuels, associations via listes déroulantes et tags
- FR9: SEO technique complet (SSG, sitemap XML, robots.txt, llms.txt, schema.org, meta/Open Graph)
- FR10: Liens externes vers site Despierre et Proantic
- FR11: Mise en avant automatique des nouveautés sur la page d'accueil (tri par date d'ajout CMS)

### NonFunctional Requirements

- NFR1: Performance — LCP < 2.5s, FID < 100ms, CLS < 0.1, images WebP/AVIF, lazy loading
- NFR2: Accessibilité — WCAG 2.1 AA, navigation clavier, alt text sur tous les visuels
- NFR3: Responsive — mobile 320px+ à desktop, aucun scroll horizontal
- NFR4: Disponibilité — 99.5% uptime avec monitoring UptimeRobot
- NFR5: Sécurité — HTTPS, anti-spam formulaire, auth CMS, CORS configuré
- NFR6: Maintenabilité — contenu modifiable par Louis sans intervention développeur

### Additional Requirements

- Starter templates : Astro minimal + Vue (front) / Strapi v5 CLI (CMS) — impacte Epic 1 Story 1
- 2 repos Git séparés (galerie-front + galerie-cms)
- Modèle de données Strapi : 6 collections (Artiste, Oeuvre, Exposition, Thematique, ArticlePresse, MessageContact) + 1 single type (APropos)
- Relations : Artiste→Oeuvre (1:N), Oeuvre↔Thématique (M:N), Oeuvre↔Exposition (M:N)
- Pipeline rebuild : webhook Strapi → rebuild front automatique
- Email transactionnel : Brevo SMTP dans lifecycle message-contact
- ESLint + Prettier à configurer à l'initialisation
- CSS natif moderne, scopé par composant (pas de framework CSS)
- Convention nommage mixte FR/EN (métier français, technique anglais)
- Hébergement : Clever Cloud (CMS + PostgreSQL + S3) + provider statique free tier (front)
- Budget cible : ~15-18€/mois

### FR Coverage Map

| FR | Epic | Description |
|---|---|---|
| FR1 | Epic 2 | Fiches artistes |
| FR2 | Epic 2 | Fiches oeuvres |
| FR3 | Epic 2 | Tags/thématiques |
| FR4 | Epic 3 | Expositions |
| FR5 | Epic 3 | À propos |
| FR6 | Epic 3 | Presse |
| FR7 | Epic 4 | Formulaire de contact |
| FR8 | Epic 1 | CMS back-office |
| FR9 | Epic 5 | SEO technique |
| FR10 | Epic 3 | Liens externes |
| FR11 | Epic 4 | Nouveautés accueil |

## Epic List

### Epic 1 : Fondations & Gestion de contenu
Louis peut créer et gérer ses artistes, oeuvres, expositions et articles presse dans le CMS.
**FRs couverts :** FR8
**NFRs adressés :** NFR5, NFR6

### Epic 2 : Découverte Artistes & Oeuvres
Les visiteurs peuvent parcourir les artistes, explorer les oeuvres et naviguer par thématique.
**FRs couverts :** FR1, FR2, FR3
**NFRs adressés :** NFR1, NFR2, NFR3

### Epic 3 : Expositions & Identité de la galerie
Les visiteurs découvrent les expositions, l'histoire de la galerie et sa couverture presse.
**FRs couverts :** FR4, FR5, FR6, FR10

### Epic 4 : Contact & Page d'accueil
Les visiteurs peuvent contacter Louis depuis n'importe quelle page et découvrir les dernières acquisitions dès l'accueil.
**FRs couverts :** FR7, FR11
**NFRs adressés :** NFR5

### Epic 5 : SEO, GEO & Référencement
La galerie est visible sur Google et référencée correctement par les moteurs IA (ChatGPT, Claude, Perplexity). SEO classique (sitemap, meta, schema.org) et GEO (robots.txt crawlers IA, llms.txt, llms-full.txt dynamique, contenu factuel-first citable).
**FRs couverts :** FR9
**NFRs adressés :** NFR1

### Epic 6 : Déploiement & Mise en production
Le site est en ligne, Louis publie du contenu et il apparaît automatiquement sur le site.
**NFRs adressés :** NFR4, NFR6

---

## Epic 1 : Fondations & Gestion de contenu

Louis peut créer et gérer ses artistes, oeuvres, expositions et articles presse dans le CMS.

### Story 1.1 : Initialisation des projets front et CMS

As a développeur,
I want initialiser les deux repos (Astro + Strapi) avec les starters définis dans l'architecture,
So that j'ai une base de code propre et configurée pour le développement.

**Acceptance Criteria :**

**Given** aucun projet n'existe
**When** j'exécute les commandes d'initialisation
**Then** le repo galerie-front est créé avec Astro + TypeScript strict + Vue
**And** le repo galerie-cms est créé avec Strapi v5 + TypeScript
**And** ESLint + Prettier sont configurés dans les deux repos
**And** les fichiers .env.example sont créés avec toutes les variables documentées dans l'architecture
**And** les deux projets démarrent sans erreur en local

### Story 1.2 : Modèle de données CMS — Artistes & Oeuvres

As a Louis (administrateur),
I want créer et gérer des artistes et des oeuvres dans le CMS,
So that je puisse constituer mon catalogue en ligne.

**Acceptance Criteria :**

**Given** Strapi est démarré en local
**When** je crée les content types Artiste et Oeuvre
**Then** Artiste contient : nom, biographie (rich text), contexte artistique (rich text), photo, slug
**And** Oeuvre contient : titre, technique, dimensions, provenance, visuel(s), slug
**And** la relation Artiste → Oeuvre (one-to-many) est fonctionnelle
**And** le content type Thematique est créé (nom, slug)
**And** la relation Oeuvre ↔ Thematique (many-to-many) est fonctionnelle
**And** je peux créer un artiste, lui associer des oeuvres et des thématiques depuis l'admin panel
**And** le provider S3 est configuré pour l'upload des visuels

### Story 1.3 : Modèle de données CMS — Expositions, Presse & À propos

As a Louis (administrateur),
I want gérer les expositions, les articles presse et les informations de la galerie,
So that tout le contenu du site soit administrable.

**Acceptance Criteria :**

**Given** les content types Artiste, Oeuvre et Thematique existent
**When** je crée les content types restants
**Then** Exposition contient : titre, dates début/fin, préface (rich text), visuels, statut
**And** la relation Oeuvre ↔ Exposition (many-to-many) est fonctionnelle
**And** ArticlePresse contient : titre, type (PDF/lien), fichier PDF, URL externe, visuel
**And** MessageContact contient : nom, email, message, oeuvre/expo de référence, date
**And** le single type APropos contient : biographie Louis, texte Prix Marcus, adresse, horaires
**And** les permissions API sont configurées : seul POST /api/messages-contact est public, tout le reste est verrouillé sauf en lecture avec token

### Story 1.4 : Layout principal et styles globaux

As a visiteur,
I want voir une structure de page cohérente avec header, navigation et footer,
So that je puisse naviguer sur le site de manière intuitive.

**Acceptance Criteria :**

**Given** le repo galerie-front est initialisé
**When** j'accède à n'importe quelle page
**Then** le LayoutPrincipal.astro est en place avec header, nav et footer
**And** le fichier global.css contient le reset, les custom properties (couleurs noir/blanc, typographie Abhaya Libre) et les styles globaux
**And** le composant SeoHead.astro est créé (meta de base, structure extensible)
**And** la navigation contient les liens vers les 6 sections (Artistes, Oeuvres, Expositions, À propos, Presse, Contact)
**And** le layout est responsive (mobile 320px+ → desktop)
**And** le HTML est sémantique (nav, main, header, footer)

---

## Epic 2 : Découverte Artistes & Oeuvres

Les visiteurs peuvent parcourir les artistes, explorer les oeuvres et naviguer par thématique.

### Story 2.1 : Client API Strapi et types TypeScript

As a développeur,
I want un client API typé pour récupérer les données Strapi au build,
So that toutes les pages front puissent consommer les données du CMS de manière fiable.

**Acceptance Criteria :**

**Given** le repo galerie-front est initialisé et Strapi tourne en local avec des données de test
**When** j'importe le client API
**Then** `src/lib/strapi-client.ts` expose des fonctions typées : `fetchArtistes()`, `fetchArtisteBySlug()`, `fetchOeuvres()`, `fetchOeuvreBySlug()`, `fetchThematiques()`
**And** `src/types/strapi.ts` définit les interfaces TypeScript pour Artiste, Oeuvre, Thematique (alignées sur le schéma Strapi)
**And** le token API read-only est lu depuis `STRAPI_API_URL` et `STRAPI_API_TOKEN`
**And** aucun `any` n'est utilisé — toutes les réponses sont typées
**And** une erreur de fetch au build fait échouer le build (pas de page vide silencieuse)

### Story 2.2 : Pages Artistes (liste et fiche)

As a visiteur,
I want parcourir la liste des artistes et consulter la fiche détaillée de chacun,
So that je puisse découvrir les artistes représentés par la galerie.

**Acceptance Criteria :**

**Given** des artistes existent dans le CMS avec biographies et oeuvres associées
**When** j'accède à `/artistes`
**Then** je vois la liste de tous les artistes avec leur nom et photo
**And** chaque artiste est cliquable et mène vers `/artistes/[slug]`

**Given** je suis sur la fiche d'un artiste (`/artistes/[slug]`)
**When** la page se charge
**Then** je vois sa biographie, son contexte artistique et sa photo
**And** je vois la liste de ses oeuvres associées (composant CarteOeuvre)
**And** chaque oeuvre est cliquable et mène vers sa fiche
**And** les images utilisent le composant `<Image>` Astro (WebP/AVIF, lazy loading)
**And** les images ont un alt text descriptif
**And** la page est responsive (mobile 320px+ → desktop)

### Story 2.3 : Pages Oeuvres (liste et fiche)

As a visiteur,
I want parcourir le catalogue d'oeuvres et consulter les détails d'une oeuvre,
So that je puisse identifier des pièces qui m'intéressent.

**Acceptance Criteria :**

**Given** des oeuvres existent dans le CMS avec artistes et thématiques associés
**When** j'accède à `/oeuvres`
**Then** je vois la liste de toutes les oeuvres avec visuel, titre et nom de l'artiste

**Given** je suis sur la fiche d'une oeuvre (`/oeuvres/[slug]`)
**When** la page se charge
**Then** je vois : titre, artiste (lien vers sa fiche), technique, dimensions, provenance, visuel(s) haute qualité
**And** je vois les expositions associées (liens vers les fiches expos)
**And** je vois les thématiques associées (liens vers le filtre par thématique)
**And** un bouton "Prendre rendez-vous" est visible et mène vers la page contact (avec pré-remplissage de l'oeuvre en référence)
**And** les images utilisent `<Image>` Astro avec optimisation
**And** les images ont un alt text descriptif incluant le titre et l'artiste
**And** la page est responsive

### Story 2.4 : Navigation par thématique

As a visiteur (notamment directeur artistique luxe),
I want filtrer les oeuvres par thématique (équestre, nature-morte, paysage...),
So that je puisse trouver rapidement des oeuvres correspondant à mon brief.

**Acceptance Criteria :**

**Given** des oeuvres sont associées à des thématiques dans le CMS
**When** j'accède à `/oeuvres`
**Then** je vois la liste des thématiques disponibles comme filtres
**And** je peux sélectionner une thématique pour ne voir que les oeuvres correspondantes

**Given** je clique sur une thématique depuis la fiche d'une oeuvre
**When** la page oeuvres se charge
**Then** le filtre est appliqué automatiquement sur cette thématique
**And** je peux retirer le filtre pour revenir à la liste complète
**And** le filtrage fonctionne côté client (pas de rechargement de page — island Vue ou filtrage JS léger)
**And** le filtrage est accessible au clavier

---

## Epic 3 : Expositions & Identité de la galerie

Les visiteurs découvrent les expositions, l'histoire de la galerie et sa couverture presse.

### Story 3.1 : Pages Expositions (liste et fiche)

As a visiteur,
I want parcourir les expositions de la galerie et consulter le détail de chacune,
So that je comprenne la ligne éditoriale de la galerie et les événements passés ou en cours.

**Acceptance Criteria :**

**Given** des expositions existent dans le CMS avec oeuvres associées
**When** j'accède à `/expositions`
**Then** je vois les expositions séparées en deux sections : "En cours" et "Passées"
**And** chaque exposition affiche son titre, ses dates et un visuel
**And** chaque exposition est cliquable et mène vers `/expositions/[slug]`

**Given** je suis sur la fiche d'une exposition (`/expositions/[slug]`)
**When** la page se charge
**Then** je vois : titre, dates, préface (rich text), visuels de l'exposition
**And** je vois la liste des oeuvres présentées (composant CarteOeuvre, liens vers les fiches)
**And** je vois les artistes déduits des oeuvres (liens vers les fiches artistes)
**And** les images sont optimisées (`<Image>` Astro, alt text)
**And** la page est responsive

**Given** le client API Strapi
**When** les fonctions d'exposition sont ajoutées
**Then** `fetchExpositions()` et `fetchExpositionBySlug()` sont disponibles dans `strapi-client.ts`
**And** les types Exposition sont ajoutés dans `strapi.ts`

### Story 3.2 : Page À propos

As a visiteur (collectionneur, journaliste, professionnel),
I want découvrir le parcours de Louis Barrand et les informations pratiques de la galerie,
So that j'évalue la crédibilité et le professionnalisme de la galerie.

**Acceptance Criteria :**

**Given** le single type APropos est renseigné dans le CMS
**When** j'accède à `/a-propos`
**Then** je vois la biographie de Louis Barrand
**And** je vois la mention du Prix Marcus et l'expertise/approche de la galerie
**And** je vois les informations pratiques : adresse, horaires
**And** le contenu est récupéré depuis le CMS (modifiable par Louis sans intervention dev)
**And** la page est responsive et accessible

**Given** le client API Strapi
**When** la fonction À propos est ajoutée
**Then** `fetchAPropos()` est disponible dans `strapi-client.ts`
**And** le type APropos est ajouté dans `strapi.ts`

### Story 3.3 : Section Presse

As a journaliste,
I want accéder rapidement aux articles de presse et aux ressources média de la galerie,
So that je puisse évaluer la couverture existante et préparer mon propre article.

**Acceptance Criteria :**

**Given** des articles presse existent dans le CMS (PDF et/ou liens)
**When** j'accède à `/presse`
**Then** je vois la liste des articles avec titre et type (PDF/lien)
**And** les articles PDF sont téléchargeables directement (lien vers le fichier S3)
**And** les articles de type lien ouvrent l'URL externe dans un nouvel onglet
**And** les visuels haute résolution sont affichés et téléchargeables (kit presse)
**And** la page est responsive et accessible

**Given** le client API Strapi
**When** les fonctions presse sont ajoutées
**Then** `fetchArticlesPresse()` est disponible dans `strapi-client.ts`
**And** le type ArticlePresse est ajouté dans `strapi.ts`

### Story 3.4 : Liens externes (Despierre & Proantic)

As a visiteur,
I want accéder au site dédié de Jacques Despierre et à la page Proantic de la galerie,
So that je puisse approfondir mes recherches.

**Acceptance Criteria :**

**Given** le footer et/ou des pages pertinentes du site
**When** je cherche les liens vers les sites partenaires
**Then** un lien vers le site dédié Jacques Despierre est visible dans le footer
**And** un lien vers Proantic est visible dans le footer
**And** les deux liens s'ouvrent dans un nouvel onglet (`target="_blank"` avec `rel="noopener"`)
**And** les liens sont également accessibles depuis les pages artistes/oeuvres pertinentes si applicable

---

## Epic 4 : Contact & Page d'accueil

Les visiteurs peuvent contacter Louis depuis n'importe quelle page et découvrir les dernières acquisitions dès l'accueil.

### Story 4.1 : Formulaire de contact

As a visiteur (collectionneur, professionnel, journaliste),
I want envoyer un message à la galerie depuis un formulaire simple,
So that je puisse prendre rendez-vous ou poser une question.

**Prérequis :** Créer un compte Brevo pour Louis et récupérer les credentials SMTP.

**Acceptance Criteria :**

**Given** je suis sur la page `/contact`
**When** je remplis le formulaire
**Then** les champs sont : nom (requis), email (requis, validé), message (requis), oeuvre/expo de référence (optionnel)
**And** le formulaire est un island Vue (`FormulaireContact.vue`)
**And** la validation se fait côté client avant envoi (champs requis, format email)
**And** le formulaire envoie un POST JSON vers `/api/messages-contact` sur Strapi

**Given** je soumets le formulaire avec des données valides
**When** Strapi reçoit le message
**Then** le message est enregistré dans la collection MessageContact
**And** un email de notification est envoyé à Louis via Brevo SMTP (lifecycle `message-contact`)
**And** une confirmation est affichée au visiteur (popup ou message inline)

**Given** je soumets le formulaire avec des données invalides
**When** la validation échoue
**Then** des messages d'erreur clairs sont affichés en français à côté des champs concernés
**And** le formulaire n'est pas soumis

**Given** un bot spam tente de soumettre le formulaire
**When** le champ honeypot caché est rempli
**Then** la soumission est silencieusement ignorée

**And** le formulaire est entièrement navigable au clavier
**And** le formulaire est responsive
**And** les états sont gérés : idle → submitting → success / error

### Story 4.2 : CTA "Prendre rendez-vous" contextuel

As a visiteur,
I want accéder au formulaire de contact en moins de 3 clics depuis n'importe quelle page,
So that je puisse facilement initier un échange avec la galerie.

**Acceptance Criteria :**

**Given** je suis sur la fiche d'une oeuvre
**When** je clique sur "Prendre rendez-vous"
**Then** je suis redirigé vers `/contact` avec le champ "oeuvre de référence" pré-rempli avec le titre de l'oeuvre

**Given** je suis sur la fiche d'une exposition
**When** je clique sur "Prendre rendez-vous" ou "Contact"
**Then** je suis redirigé vers `/contact` avec le champ "expo de référence" pré-rempli

**Given** je suis sur n'importe quelle page du site
**When** je veux contacter la galerie
**Then** le lien "Contact" est toujours accessible dans la navigation principale (< 3 clics)

### Story 4.3 : Page d'accueil avec nouveautés

As a visiteur,
I want voir les dernières acquisitions de la galerie dès la page d'accueil,
So that je découvre immédiatement les oeuvres récentes sans chercher.

**Acceptance Criteria :**

**Given** des oeuvres existent dans le CMS avec des dates d'ajout différentes
**When** j'accède à `/` (page d'accueil)
**Then** je vois une section mettant en avant les dernières oeuvres ajoutées (triées par date d'ajout CMS, les plus récentes en premier)
**And** le nombre d'oeuvres affichées est limité (ex: 6 à 8 dernières)
**And** chaque oeuvre est présentée avec son visuel, titre et artiste (composant CarteOeuvre)
**And** chaque oeuvre est cliquable et mène vers sa fiche

**Given** la page d'accueil
**When** elle se charge
**Then** elle présente aussi un texte d'introduction sobre sur la galerie
**And** la mise en avant se fait automatiquement (pas d'intervention manuelle de Louis pour sélectionner les nouveautés)
**And** la page est responsive et les images sont optimisées
**And** le design est sobre et professionnel, dans les codes du marché de l'art

---

## Epic 5 : SEO, GEO & Référencement

La galerie est visible sur Google et référencée correctement par les moteurs IA (ChatGPT, Claude, Perplexity). SEO classique et GEO (Generative Engine Optimization).

### Story 5.1 : Données structurées schema.org

As a moteur de recherche (Google) ou IA,
I want des données structurées sur chaque page du site,
So that la galerie, ses artistes et ses oeuvres soient correctement indexés et présentés dans les résultats enrichis.

**Acceptance Criteria :**

**Given** le composant SeoHead.astro existe (Epic 1)
**When** les données structurées sont ajoutées
**Then** la page d'accueil contient un schema `ArtGallery` (nom, adresse, description, logo)
**And** chaque fiche artiste contient un schema `Person` (nom, description, image)
**And** chaque fiche oeuvre contient un schema `VisualArtwork` (titre, artiste, technique, dimensions, image)
**And** chaque fiche exposition contient un schema `ExhibitionEvent` (titre, dates, lieu, description)
**And** les données structurées sont générées dynamiquement à partir des données CMS
**And** les schemas sont validés sans erreur via le Rich Results Test de Google

### Story 5.2 : Meta, Open Graph et sitemap

As a moteur de recherche ou réseau social,
I want des balises meta et Open Graph optimisées sur chaque page et un sitemap complet,
So that chaque page soit correctement indexée et partageable.

**Acceptance Criteria :**

**Given** le composant SeoHead.astro existe
**When** les balises meta sont ajoutées
**Then** chaque page a un `<title>` et `<meta description>` uniques et descriptifs, générés depuis les données CMS
**And** chaque page a des balises Open Graph (og:title, og:description, og:image, og:type)
**And** les fiches oeuvres utilisent le visuel de l'oeuvre comme og:image
**And** `@astrojs/sitemap` est configuré et génère un sitemap XML automatiquement
**And** le sitemap est accessible à `/sitemap-index.xml`

### Story 5.3 : robots.txt, llms.txt et optimisation performance

As a crawler (moteur de recherche ou IA),
I want des fichiers de configuration clairs et un site performant,
So that l'indexation soit optimale et les Core Web Vitals au vert.

**Acceptance Criteria :**

**Given** le dossier `public/` du front
**When** les fichiers statiques sont ajoutés
**Then** `robots.txt` autorise l'indexation complète du site et référence le sitemap
**And** `llms.txt` décrit la galerie, ses sections et son contenu pour les IA
**And** les Core Web Vitals sont au vert : LCP < 2.5s, FID < 100ms, CLS < 0.1
**And** toutes les images utilisent le composant `<Image>` Astro (WebP/AVIF, lazy loading, dimensionnement adaptatif)
**And** une vérification Lighthouse confirme un score Performance > 90

---

## Epic 6 : Déploiement & Mise en production

Le site est en ligne, Louis publie du contenu et il apparaît automatiquement sur le site.

### Story 6.1 : Déploiement CMS sur Clever Cloud

As a Louis (administrateur),
I want que le CMS soit accessible en ligne de manière permanente,
So that je puisse gérer le contenu du site depuis n'importe où.

**Acceptance Criteria :**

**Given** le repo galerie-cms est prêt et testé en local
**When** je déploie sur Clever Cloud
**Then** une instance Node.js nano héberge Strapi v5
**And** PostgreSQL est provisionné et connecté via variables d'environnement
**And** Cellar S3 est provisionné pour le stockage des visuels
**And** les variables d'environnement sont configurées (BDD, S3, Brevo SMTP, secrets Strapi)
**And** le déploiement se fait automatiquement sur git push
**And** le panel admin Strapi est accessible via HTTPS
**And** Louis peut se connecter et gérer le contenu

### Story 6.2 : Déploiement front et webhook rebuild

As a visiteur,
I want accéder au site en ligne avec du contenu à jour,
So that je puisse découvrir la galerie à tout moment.

**Acceptance Criteria :**

**Given** le repo galerie-front est prêt et le CMS est en production
**When** je déploie le front sur le provider statique
**Then** le build Astro SSG se connecte à l'API Strapi en production et génère le site statique
**And** le site est accessible via HTTPS sur le domaine choisi
**And** le déploiement se fait automatiquement sur git push

**Given** Louis publie ou modifie du contenu dans Strapi
**When** le webhook de rebuild est déclenché
**Then** le provider front lance un rebuild automatique
**And** le nouveau contenu est visible sur le site sans intervention de Marceau
**And** le délai entre publication CMS et mise à jour du site est < 5 minutes

### Story 6.3 : Nom de domaine, monitoring et go-live

As a Louis (propriétaire de la galerie),
I want que le site soit accessible sur un nom de domaine professionnel et surveillé,
So that la galerie ait une présence en ligne crédible et fiable.

**Acceptance Criteria :**

**Given** les deux déploiements (CMS + front) sont fonctionnels
**When** le nom de domaine est configuré
**Then** le site est accessible sur le domaine choisi (ex: galerielouisbarrand.com ou similaire)
**And** le HTTPS est actif sur le domaine
**And** les redirections www → non-www (ou inverse) sont configurées

**Given** le site est en production
**When** UptimeRobot est configuré
**Then** le site front et le Strapi admin sont monitorés (ping toutes les 5 min)
**And** une alerte email est envoyée à Marceau en cas de downtime
**And** l'objectif de 99.5% uptime est mesurable

**Given** tout est en place
**When** on valide le go-live
**Then** le sitemap est soumis à Google Search Console
**And** le robots.txt est vérifié dans Search Console
**And** un test complet du parcours utilisateur est effectué (navigation, fiches, formulaire de contact, email notification)
