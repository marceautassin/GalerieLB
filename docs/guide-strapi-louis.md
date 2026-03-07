# Guide Strapi — Galerie Louis Barrand

Guide de prise en main du CMS pour gerer le contenu du site.

## Se connecter

1. Aller sur l'admin Strapi : **https://cms.galerie-louisbarrand.fr/admin** (en dev : http://localhost:1337/admin)
2. Entrer votre email et mot de passe

## Tableau de bord

Apres connexion, le menu de gauche affiche les types de contenu :

- **Artistes** — Fiches des artistes avec biographie et photo
- **Oeuvres** — Catalogue des oeuvres avec visuels, technique, dimensions
- **Expositions** — Expositions passees et en cours
- **ArticlePresse** — Articles et liens presse
- **Thematique** — Categories pour classer les oeuvres
- **APropos** — Page a propos (texte unique, pas de liste)
- **MessageContact** — Messages recus via le formulaire du site (lecture seule)

## Gerer les artistes

### Ajouter un artiste

1. Menu gauche > **Content Manager** > **Artiste**
2. Cliquer **Create new entry**
3. Remplir :
   - **Nom** (obligatoire) — ex: "Camille Pissarro"
   - **Biographie** — texte riche (gras, italique, liens possibles)
   - **Contexte artistique** — texte riche complementaire
   - **Photo** — cliquer pour uploader une image (portrait de l'artiste)
   - **Slug** — se genere automatiquement a partir du nom
4. Cliquer **Save** puis **Publish**

### Modifier un artiste

1. Cliquer sur le nom dans la liste
2. Modifier les champs souhaites
3. **Save** puis **Publish**

## Gerer les oeuvres

### Ajouter une oeuvre

1. Menu gauche > **Content Manager** > **Oeuvre**
2. Cliquer **Create new entry**
3. Remplir :
   - **Titre** (obligatoire) — ex: "Paysage a Pontoise"
   - **Technique** — ex: "Huile sur toile", "Eau-forte et aquatinte"
   - **Dimensions** — ex: "65 x 81 cm"
   - **Provenance** — ex: "Collection particuliere, Paris"
   - **Visuels** — uploader une ou plusieurs photos de l'oeuvre
   - **Artiste** — selectionner l'artiste dans la liste deroulante
   - **Thematiques** — selectionner une ou plusieurs thematiques
4. **Save** puis **Publish**

### Associer une oeuvre a une exposition

L'association se fait depuis la fiche **Exposition** (pas depuis l'oeuvre).

## Gerer les expositions

### Ajouter une exposition

1. Menu gauche > **Content Manager** > **Exposition**
2. Cliquer **Create new entry**
3. Remplir :
   - **Titre** (obligatoire) — ex: "Camille Pissarro — Dessinateur et Graveur"
   - **Date debut** (obligatoire) — date d'ouverture
   - **Date fin** — date de cloture
   - **Preface** — texte de presentation (texte riche)
   - **Statut** — "en-cours" ou "passee"
   - **Visuels** — photos de l'exposition
   - **Oeuvres** — selectionner les oeuvres presentees dans l'exposition
4. **Save** puis **Publish**

### Passer une exposition en "passee"

1. Ouvrir la fiche de l'exposition
2. Changer le champ **Statut** de "en-cours" a "passee"
3. **Save** puis **Publish**

## Gerer les articles de presse

### Ajouter un article

1. Menu gauche > **Content Manager** > **ArticlePresse**
2. Cliquer **Create new entry**
3. Remplir :
   - **Titre** (obligatoire)
   - **Type** : choisir "lien" (lien vers un site) ou "pdf" (fichier a telecharger)
   - Si **lien** : remplir **URL externe**
   - Si **pdf** : uploader le fichier dans **Fichier PDF**
   - **Visuel** (optionnel) — image/capture de l'article
4. **Save** puis **Publish**

## Modifier la page A propos

1. Menu gauche > **Content Manager** > **APropos**
2. Il n'y a qu'une seule entree (pas de liste)
3. Modifier les champs :
   - **Biographie Louis** — texte de presentation
   - **Texte Prix Marcus** — texte sur le Prix Marcus
   - **Adresse** — adresse de la galerie
   - **Horaires** — horaires d'ouverture
4. **Save** puis **Publish**

## Les messages de contact

Les messages recus via le formulaire du site apparaissent dans **MessageContact**. Ils sont en lecture seule — nom, email, message, et eventuellement la reference de l'oeuvre ou exposition concernee.

## Gerer les visuels / medias

### Bibliotheque de medias

Menu gauche > **Media Library** pour voir tous les fichiers uploades (images, PDFs). On peut :
- Uploader de nouveaux fichiers
- Organiser en dossiers
- Supprimer des fichiers inutilises

### Formats d'image recommandes

- **Photos d'oeuvres** : JPEG, bonne qualite, au moins 1200px de large
- **Portraits d'artistes** : JPEG, au moins 800px de large
- **Visuels d'exposition** : JPEG, au moins 1200px de large

## Publier / Depublier

Chaque contenu a deux etats :
- **Draft** (brouillon) — visible uniquement dans l'admin, pas sur le site
- **Published** (publie) — visible sur le site

Apres chaque modification, il faut cliquer **Publish** pour que les changements apparaissent sur le site. Le site se reconstruit automatiquement a chaque publication.

## Bonnes pratiques

- Toujours remplir les champs **Titre/Nom** avec soin — ils servent a generer les URLs du site
- Uploader des images de bonne qualite mais pas trop lourdes (< 2 Mo idealement)
- Penser a **publier** apres chaque modification
- Les **slugs** (URLs) se generent automatiquement — ne pas les modifier sauf raison speciale
