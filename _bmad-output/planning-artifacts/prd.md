---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-03-success
  - step-04-journeys
  - step-e-01-discovery
  - step-e-02-review
  - step-e-03-edit
lastEdited: '2026-02-27'
editHistory:
  - date: '2026-02-27'
    changes: 'Ajout GEO (Generative Engine Optimization) : enrichissement FR9 avec llms.txt/llms-full.txt, schema.org spécifique art, crawlers IA, contenu citable. Ajout métriques GEO dans Measurable Outcomes. Mise à jour Technical Success.'
  - date: '2026-02-25'
    changes: 'Ajout Executive Summary (problème, solution, proposition de valeur, design & identité) + ajout courtage/vendeurs en Growth'
  - date: '2026-02-22'
    changes: 'Ajout Functional Requirements (10 FRs), Non-Functional Requirements (6 NFRs), déplacement multi-langue FR/EN de Vision vers Growth avec specs détaillées'
inputDocuments:
  - spec/SITE GALERIE.pdf
workflowType: 'prd'
documentCounts:
  briefs: 0
  research: 0
  projectDocs: 0
  specs: 1
classification:
  projectType: web_app
  domain: art_gallery
  complexity: low-medium
  projectContext: greenfield
---

# Product Requirements Document - GallerieLouisBarrand

**Author:** Marceau
**Date:** 2026-02-20

## Executive Summary

### Problème

La Galerie Louis Barrand est une galerie d'art parisienne spécialisée dans la redécouverte d'artistes oubliés et de pans méconnus d'artistes majeurs du XIXe et XXe siècle. Malgré un positionnement unique sur le marché et une clientèle en croissance — des connaissances personnelles vers des collectionneurs avertis et des collections d'entreprises — la galerie manque de visibilité en ligne. Son travail de fond (recherches, expositions thématiques, expertise) reste invisible au-delà du cercle existant. Aujourd'hui, les clients étrangers découvrent les oeuvres principalement via Proantic ou Instagram, et toutes les ventes se concluent en main propre.

### Solution

Un site vitrine professionnel qui reflète l'identité intimiste de la galerie et présente son catalogue, ses expositions et son expertise de manière approfondie. Le site doit servir de vitrine permanente entre les salons et expositions : attirer de nouveaux acheteurs via le SEO classique et le GEO (Generative Engine Optimization — visibilité dans les réponses des moteurs IA comme ChatGPT, Perplexity, Google AI Overviews), donner envie de prendre contact, et positionner la galerie comme un acteur crédible du marché de l'art parisien.

### Proposition de valeur

- **Pour les collectionneurs et amateurs d'art** : découvrir des artistes et des oeuvres introuvables ailleurs, avec un contenu riche (biographies, contexte, expositions) qui inspire confiance
- **Pour les professionnels du luxe et institutionnels** : naviguer efficacement un catalogue d'oeuvres pour identifier des pièces correspondant à leurs besoins
- **Pour Louis Barrand** : un outil qu'il gère en autonomie, qui travaille pour lui 24h/24 et génère des demandes de contact qualifiées

### Design & Identité

Esthétique sobre, noir et blanc, typographie Abhaya Libre (cohérente avec les invitations de la galerie). Inspirations : Galerie La Ménagerie, Amélie du Chalard, Stéphane Renard Fine Art.

**Logo de la galerie :**
- `spec/Logo_Gallerie_LouisBarrand.svg` (vectoriel, pour le header et le favicon)
- `spec/Logo_Gallerie_LouisBarrand.jpeg` (bitmap, pour les usages Open Graph / partage réseaux sociaux)

## Success Criteria

### User Success

- **Collectionneur** : il parcourt les artistes et oeuvres, identifie une pièce qui l'intéresse, et prend contact via le formulaire en moins de 3 clics depuis n'importe quelle page
- **Amateur d'art** : il découvre une exposition via une recherche Google ou IA, consulte les détails (préface, visuels), et se déplace à la galerie
- **Groupe de luxe / Directeur artistique** : il navigue le catalogue d'oeuvres et d'artistes de manière fluide pour identifier des pièces correspondant à l'image de sa marque, puis initie un contact professionnel
- **Journaliste** : il accède rapidement aux ressources presse et aux informations de contact

### Business Success

- Le site est **mentionné spontanément** par des visiteurs lors d'expositions ou via le formulaire de contact
- Louis Barrand reçoit des **demandes de rendez-vous qualifiées** via le formulaire
- Le site positionne la galerie comme un acteur **crédible et professionnel** du marché de l'art parisien, au-delà de la simple page Proantic
- Les groupes de luxe identifient la galerie comme source d'oeuvres via le site

### Technical Success

- **SEO classique** : première page Google sur les recherches clés ("galerie art XIXe Paris", noms d'artistes spécifiques comme "oeuvres René Gruau", "galerie Louis Barrand")
- **GEO (Generative Engine Optimization)** : le site est conçu pour être cité comme source fiable par les moteurs IA (ChatGPT, Perplexity, Google AI Overviews, Claude) lorsque des utilisateurs posent des questions sur les artistes de la galerie, le marché de l'art parisien ou les expositions. Cela passe par : des fichiers `llms.txt` / `llms-full.txt`, des données structurées schema.org riches, un contenu factuel et citable, et l'autorisation des crawlers IA (GPTBot, ClaudeBot, PerplexityBot)
- **Performance** : temps de chargement rapide (Core Web Vitals au vert), images optimisées
- **CMS autonome** : Louis Barrand peut ajouter/modifier artistes, oeuvres, expositions, articles presse sans intervention technique

### Measurable Outcomes

- Demandes de contact reçues via le formulaire (suivi quantitatif)
- Positionnement Google sur les mots-clés cibles (suivi SEO)
- Citations du site dans les réponses des moteurs IA (vérification manuelle périodique sur ChatGPT, Perplexity, Google AI Overviews avec des requêtes clés : noms d'artistes, "galerie art XIXe Paris")
- Trafic organique (Matomo)
- Trafic provenant des moteurs IA (referrer ChatGPT, Perplexity dans les analytics)
- Mentions du site lors d'interactions en galerie (qualitatif)

## Product Scope

### MVP - Minimum Viable Product

- 6 sections du site : Artistes, Oeuvres, Expositions, À propos, Presse, Contact
- CMS headless avec modèles de contenu pour chaque entité
- Formulaire de contact fonctionnel avec notification email
- SEO technique complet (SSR/SSG, sitemap, robots.txt, llms.txt, schema.org)
- Design responsive, élégant, dans les codes du marché de l'art
- Lien vers Proantic pour les oeuvres
- Lien vers le site dédié de Jacques Despierre

### Growth Features (Post-MVP)

- Newsletter / inscription pour suivre l'actualité
- Filtrage avancé des oeuvres (par artiste, époque, style, technique)
- Intégration CRM pour le suivi des demandes
- Galerie photo enrichie pour les expositions (diaporama, vues immersives)
- Blog / actualités pour renforcer le SEO
- Site bilingue FR/EN : détection automatique de la langue du navigateur, sélecteur manuel, URLs distinctes par langue avec balises hreflang, sitemap multi-langue, fallback français si traduction absente, saisie bilingue dans le CMS
- Service de courtage : page ou section dédiée pour attirer des vendeurs potentiels (propriétaires d'oeuvres souhaitant vendre via la galerie), avec appel à l'action et formulaire de contact spécifique

### Vision (Future)

- Espace professionnel pour les groupes de luxe / institutionnels
- Catalogue raisonné en ligne (Despierre, Lami)
- Visite virtuelle de la galerie

## User Journeys

### Parcours 1 : Sophie, Collectionneuse — Recherche ciblée

**Qui :** Sophie, 55 ans, collectionneuse passionnée d'art post-impressionniste. Elle possède déjà deux Valtat et un Lebasque. Elle connaît Louis Barrand depuis une expo à laquelle une amie l'avait emmenée.

**Scène d'ouverture :** Sophie reçoit un faire-part de la galerie annonçant de nouvelles acquisitions. Elle se souvient du site et y accède directement.

**Parcours :**
1. Elle arrive sur la page d'accueil, va directement dans la section **Artistes**
2. Elle cherche **Louis Valtat** — elle clique sur sa fiche, découvre sa biographie et les oeuvres disponibles
3. Une huile sur toile attire son attention — elle consulte les détails (technique, dimensions, provenance)
4. Elle clique sur **"Prendre rendez-vous"** depuis la page de l'oeuvre
5. Elle remplit le formulaire en mentionnant l'oeuvre qui l'intéresse
6. Elle reçoit une confirmation, Louis Barrand la recontacte pour organiser une visite privée

**Moment clé :** La fluidité entre la découverte de l'oeuvre et la prise de contact — moins de 3 clics.

**Ce qui pourrait mal tourner :** L'oeuvre n'a pas assez d'informations (pas de visuel, pas de dimensions), Sophie hésite et quitte le site.

### Parcours 2 : Thomas, Amateur d'art — Découverte SEO

**Qui :** Thomas, 35 ans, amateur d'art qui commence à s'intéresser sérieusement à l'art figuratif français du XXe. Il ne connaît pas la galerie.

**Scène d'ouverture :** Thomas tape "Henri Martin peintre pointilliste oeuvres" sur Google. Le site de la Galerie Louis Barrand apparaît en première page grâce au contenu riche de la fiche artiste.

**Parcours :**
1. Il atterrit sur la **fiche d'Henri Martin** — biographie détaillée, contexte artistique
2. Il parcourt les oeuvres disponibles, impressionné par la qualité de la présentation
3. Il remarque le lien vers l'**exposition passée "Nature-morte - France XXe"** qui incluait des oeuvres de Martin
4. Il consulte les vues de l'exposition, la préface — il comprend le sérieux de la galerie
5. Il va voir la section **À propos** — le Prix Marcus, l'expérience de Louis Barrand le rassurent
6. Il note l'adresse et décide de passer lors de la prochaine exposition
7. Bonus : il explore d'autres artistes qu'il ne connaissait pas — le site lui fait découvrir Edmond Ceria

**Moment clé :** La profondeur du contenu (biographie + oeuvres + expos) transforme une simple recherche Google en découverte d'une galerie de confiance.

**Ce qui pourrait mal tourner :** La fiche artiste est pauvre en contenu, Thomas retourne sur Wikipedia et ne revient jamais.

### Parcours 3 : Claire, Directrice artistique luxe — Brief précis

**Qui :** Claire, 42 ans, directrice artistique chez une grande maison de luxe. Elle cherche des oeuvres originales pour décorer les nouveaux bureaux parisiens de la marque — thème équestre.

**Scène d'ouverture :** Claire a entendu parler de la galerie par un contact du milieu. Elle accède au site pour évaluer le catalogue.

**Parcours :**
1. Elle arrive sur le site, va dans **Oeuvres** ou **Artistes**
2. Elle cherche des oeuvres liées au monde équestre — elle parcourt les artistes, identifie **René Princeteau** (spécialiste animalier/équestre) et l'expo **"BESTIAIRE - Art animalier"**
3. Elle repère plusieurs pièces potentielles, note les références
4. Elle consulte la section **À propos** pour valider le professionnalisme de la galerie (expertise, courtage)
5. Elle utilise le formulaire de contact en précisant son contexte professionnel et le type d'oeuvres recherchées
6. Louis Barrand la rappelle, propose une sélection sur mesure et organise une présentation privée

**Moment clé :** La capacité à naviguer efficacement dans le catalogue pour identifier rapidement des oeuvres correspondant à un brief précis.

**Ce qui pourrait mal tourner :** Pas de moyen de trouver des oeuvres par thématique — Claire doit parcourir chaque artiste un par un et abandonne.

### Parcours 4 : Marc, Journaliste art — Recherche presse

**Qui :** Marc, journaliste pour un magazine d'art. Il prépare un article sur les galeries parisiennes émergentes.

**Scène d'ouverture :** Marc fait des recherches sur les jeunes galeristes parisiens, tombe sur le site via Google ("galerie art XIXe Paris 8e").

**Parcours :**
1. Il consulte la section **À propos** — le parcours de Louis Barrand, le Prix Marcus
2. Il va dans **Presse** pour voir les publications existantes et les médias qui ont déjà couvert la galerie
3. Il parcourt les **Expositions** pour comprendre la ligne éditoriale de la galerie
4. Il utilise le formulaire de **Contact** pour demander une interview

**Moment clé :** Les informations sont facilement accessibles et présentées de manière professionnelle — Marc peut rapidement évaluer si la galerie mérite un article.

### Parcours 5 : Louis Barrand, Administrateur — Gestion du contenu

**Qui :** Louis, galeriste, pas très à l'aise avec le numérique mais motivé. Formé par Marceau sur l'utilisation du CMS.

**Scène d'ouverture :** Louis vient d'acquérir une nouvelle oeuvre de Yves Brayer. Il veut l'ajouter au site.

**Parcours :**
1. Il se connecte au **back-office du CMS**
2. Il va dans la section **Oeuvres** → "Ajouter une oeuvre"
3. Il remplit le formulaire guidé : titre, artiste (sélection dans une liste déroulante), technique, dimensions, photo
4. Il associe l'oeuvre à l'artiste **Yves Brayer** (déjà existant dans le CMS)
5. Il publie — l'oeuvre apparaît sur le site en quelques secondes

**Autre scénario :** Louis prépare une nouvelle exposition. Il crée l'entrée dans **Expositions**, renseigne le titre, les dates, la préface, uploade les visuels. L'expo apparaît automatiquement sur le site.

**Moment clé :** La simplicité — formulaires clairs, liste déroulante pour les artistes existants, upload photo direct.

**Ce qui pourrait mal tourner :** Interface trop complexe, trop de champs obligatoires, Louis se décourage et appelle Marceau à chaque modification.

### Journey Requirements Summary

| Capacité | Parcours source |
|---|---|
| Fiches artistes riches (bio, oeuvres liées) | Collectionneur, Amateur SEO |
| Formulaire de contact contextuel (depuis une oeuvre, une expo) | Tous visiteurs |
| SEO technique fort (SSR, schema.org, contenu riche) | Amateur SEO, Journaliste |
| Navigation par thématique/sujet (équestre, nature-morte...) | Dir. artistique luxe |
| Section presse avec publications et liens | Journaliste |
| CMS simple avec formulaires guidés | Admin (Louis) |
| Liaison oeuvre ↔ artiste ↔ exposition | Tous parcours |
| Mise en avant des nouveautés/dernières acquisitions | Collectionneur fidèle |
| Notification email à la soumission du formulaire | Tous visiteurs |

## Functional Requirements

### FR1 — Fiches Artistes
- Chaque artiste dispose d'une fiche avec biographie, contexte artistique et liste des oeuvres associées
- Navigation directe de la fiche artiste vers ses oeuvres

### FR2 — Fiches Oeuvres
- Chaque oeuvre affiche : titre, artiste, technique, dimensions, visuel haute qualité, provenance
- Lien vers l'artiste associé
- Lien vers les expositions associées
- Bouton "Prendre rendez-vous" accessible depuis la fiche (accès au formulaire de contact en 1 clic)

### FR3 — Système de tags/thématiques
- Chaque oeuvre peut être associée à une ou plusieurs thématiques (équestre, nature-morte, paysage, portrait, etc.)
- Les tags sont gérés dans le CMS dès la saisie des oeuvres
- Le front permet de consulter les oeuvres par thématique

### FR4 — Expositions
- Chaque exposition affiche : titre, dates, préface, visuels, liste des oeuvres/artistes présentés
- Distinction entre expositions passées et en cours

### FR5 — Section À propos
- Présentation de Louis Barrand : parcours, Prix Marcus, expertise, approche
- Informations pratiques : adresse, horaires

### FR6 — Section Presse
- Articles de presse en PDF téléchargeables
- Liens vers les publications en ligne
- Visuels haute résolution téléchargeables (kit presse)

### FR7 — Formulaire de contact
- Accessible depuis n'importe quelle page en moins de 3 clics
- Champs : nom, email, message, oeuvre/expo de référence (optionnel)
- Notification email envoyée à Louis à chaque soumission
- Popup de confirmation affichée au visiteur après envoi

### FR8 — CMS (Back-office)
- Louis peut créer, modifier, supprimer : artistes, oeuvres, expositions, articles presse
- Upload de visuels direct
- Association oeuvre ↔ artiste via liste déroulante
- Association oeuvre ↔ thématiques via tags
- Association oeuvre ↔ exposition
- Interface guidée avec formulaires simples

### FR9 — SEO technique & GEO (Generative Engine Optimization)

**SEO classique :**
- Rendu SSG (HTML statique) pour une indexation optimale
- Sitemap XML générée automatiquement
- Balises meta et Open Graph par page
- Hiérarchie de headings propre (H1 > H2 > H3) — un sujet par section

**GEO — Visibilité dans les moteurs IA :**
- Fichier `robots.txt` autorisant explicitement les crawlers IA : GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended, en plus des crawlers classiques
- Fichier `llms.txt` (format Markdown structuré, spécification llmstxt.org) : description du site, structure, liens vers les pages clés. Placé à la racine `/llms.txt`
- Fichier `llms-full.txt` : version enrichie avec le contenu détaillé de chaque section (artistes, oeuvres, expositions, à propos), générée au build à partir des données Strapi
- Données structurées schema.org riches et spécifiques au domaine :
  - `ArtGallery` (Organization) pour la galerie
  - `VisualArtwork` pour chaque oeuvre (titre, artiste, technique, dimensions, image)
  - `Person` pour chaque artiste (nom, biographie, lien vers les oeuvres)
  - `ExhibitionEvent` pour chaque exposition (titre, dates, lieu, oeuvres)
  - `BreadcrumbList` pour la navigation
  - `ContactPage` pour le formulaire
- Contenu structuré pour la citation IA :
  - Chaque section de page commence par une réponse directe et factuelle avant le développement contextuel
  - Données factuelles explicites : dates, dimensions, techniques, provenance — pas de texte vague
  - Paragraphes courts (2-3 phrases max) pour faciliter l'extraction par les LLMs
  - Les biographies d'artistes et descriptions d'oeuvres sont rédigées comme des sources de référence citables

### FR10 — Liens externes
- Lien vers le site dédié de Jacques Despierre
- Lien vers Proantic (à confirmer avec Louis)

### FR11 — Mise en avant des nouveautés
- La page d'accueil met en avant les dernières oeuvres ajoutées au catalogue
- La mise en avant se fait automatiquement à partir de la date d'ajout dans le CMS
- La présentation visuelle est définie par le travail UX (sobre et professionnelle, dans les codes du marché de l'art)

## Non-Functional Requirements

### NFR1 — Performance
- Temps de chargement initial < 3 secondes sur connexion 4G
- Core Web Vitals au vert (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Images optimisées : formats WebP/AVIF, lazy loading, dimensionnement adaptatif

### NFR2 — Accessibilité
- Conformité WCAG 2.1 niveau AA minimum
- Navigation au clavier fonctionnelle
- Textes alternatifs sur tous les visuels d'oeuvres

### NFR3 — Compatibilité & Responsive
- Design responsive obligatoire sur tous les gabarits : mobile (320px+), tablette, desktop
- Aucun scroll horizontal quelle que soit la résolution
- Breakpoints et comportements adaptatifs définis par le travail UX
- Navigateurs : Chrome, Firefox, Safari, Edge (2 dernières versions)

### NFR4 — Disponibilité
- Uptime 99.5% mesuré par monitoring externe

### NFR5 — Sécurité
- HTTPS obligatoire sur tout le site
- Protection anti-spam sur le formulaire de contact (honeypot ou captcha)
- CMS accessible uniquement via authentification sécurisée

### NFR6 — Maintenabilité
- Louis peut ajouter/modifier du contenu sans intervention technique
- Les modifications de contenu sont visibles sur le site sans intervention de développeur

