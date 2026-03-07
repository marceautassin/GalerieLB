# Story 4.1: Formulaire de contact

Status: done

## Story

As a visiteur (collectionneur, professionnel, journaliste),
I want envoyer un message à la galerie depuis un formulaire simple,
so that je puisse prendre rendez-vous ou poser une question.

**Prérequis externe :** Créer un compte Brevo pour Louis et récupérer les credentials SMTP.

## Acceptance Criteria

1. `/contact` affiche un formulaire avec : nom (requis), email (requis, validé), message (requis), oeuvre/expo de référence (optionnel)
2. Le formulaire est un island Vue (`FormulaireContact.vue`)
3. Validation côté client avant envoi (champs requis, format email)
4. Le formulaire envoie un POST JSON vers `/api/messages-contact` sur Strapi
5. Le message est enregistré dans la collection MessageContact
6. Un email de notification est envoyé à Louis via Brevo SMTP (lifecycle `message-contact`)
7. Confirmation affichée au visiteur
8. Données invalides → messages d'erreur en français à côté des champs
9. Protection anti-spam : champ honeypot caché
10. Formulaire navigable au clavier, responsive, états gérés (idle → submitting → success / error)

## Tasks / Subtasks

- [x] Task 1 : Créer FormulaireContact.vue (AC: #1, #2, #3, #8, #9, #10)
  - [x] 1.1 Champs : nom (text, required), email (email, required), message (textarea, required, min 10 chars), referenceOeuvre (text, readonly si pré-rempli)
  - [x] 1.2 Champ honeypot caché (`<input name="website" style="display:none">`)
  - [x] 1.3 Validation au blur : champs requis, format email, longueur message
  - [x] 1.4 Re-validation au submit
  - [x] 1.5 Messages d'erreur en français sous chaque champ (`aria-describedby`)
  - [x] 1.6 Bordure `--color-error` sur les champs en erreur
  - [x] 1.7 Labels au-dessus des champs, légende "* Champ obligatoire"
  - [x] 1.8 États : idle → submitting (bouton désactivé + texte) → success / error
  - [x] 1.9 Navigation Tab logique, focus visible
  - [x] 1.10 2 colonnes (nom/email) sur desktop, pleine largeur sur mobile
- [x] Task 2 : Soumission vers Strapi (AC: #4, #5, #9)
  - [x] 2.1 POST JSON vers `PUBLIC_STRAPI_API_URL/api/messages-contact` (public endpoint)
  - [x] 2.2 Si honeypot rempli → ignorer silencieusement (pas d'erreur visible)
  - [x] 2.3 Gestion erreur serveur : message sobre "Un problème est survenu..."
  - [x] 2.4 `role="alert"` pour l'erreur serveur
- [x] Task 3 : Confirmation succès (AC: #7)
  - [x] 3.1 Remplacer le formulaire par le message de confirmation
  - [x] 3.2 Texte : "Votre message a été envoyé. Louis vous répondra rapidement."
  - [x] 3.3 Couleur `--color-success`, `role="status"`, `aria-live="polite"`
- [x] Task 4 : Lifecycle email Brevo (AC: #6)
  - [x] 4.1 Mise à jour `lifecycles.ts` existant dans galerie-cms (ajout afterCreate)
  - [x] 4.2 Hook `afterCreate` : envoi email à `NOTIFICATION_EMAIL` via Brevo SMTP
  - [x] 4.3 Contenu email : nom, email, message, référence oeuvre
  - [x] 4.4 Utilise nodemailer avec env vars SMTP — guard si non configuré
- [x] Task 5 : Lire le query param pour pré-remplissage (AC: #1)
  - [x] 5.1 Au mount, lire `URLSearchParams` pour `?oeuvre=slug` ou `?exposition=slug`
  - [x] 5.2 Pré-remplir le champ référence en readonly
- [x] Task 6 : Page contact `/contact.astro` (AC: #1, #10)
  - [x] 6.1 LayoutPrincipal avec titre "Contact"
  - [x] 6.2 Intégrer `<FormulaireContact client:visible />`
  - [x] 6.3 Informations pratiques — omises (déjà dans footer + page à-propos)
  - [x] 6.4 SeoHead

## Dev Notes

### STRAPI_API_URL côté client

Le FormulaireContact.vue s'exécute côté client (island Vue). Il doit connaître l'URL Strapi pour le POST. Options :
- Passer l'URL en prop depuis Astro : `<FormulaireContact apiUrl={import.meta.env.PUBLIC_STRAPI_API_URL} />`
- Utiliser une variable d'environnement publique Astro (`PUBLIC_STRAPI_API_URL`)

**Attention :** seules les variables préfixées `PUBLIC_` sont accessibles côté client dans Astro.

### Brevo SMTP — Configuration lifecycle

```typescript
// galerie-cms/src/api/message-contact/lifecycles.ts
import nodemailer from 'nodemailer';

export default {
  async afterCreate(event) {
    const { result } = event;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: `"Galerie Louis Barrand" <${process.env.SMTP_USERNAME}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `Nouveau message de ${result.nom}`,
      text: `Nom: ${result.nom}\nEmail: ${result.email}\nMessage: ${result.message}\nRéférence: ${result.referenceOeuvre || 'Aucune'}`,
    });
  },
};
```

**Installer nodemailer dans galerie-cms :** `npm install nodemailer @types/nodemailer`

### Prérequis

- Story 1.3 complétée (content type MessageContact, permissions POST public)
- Compte Brevo créé pour Louis, credentials SMTP disponibles
- Variable `PUBLIC_STRAPI_API_URL` ajoutée dans `.env` et `.env.example` du front

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Sections: Component Strategy (FormulaireContact), UX Patterns (Form, Feedback)]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 4, Story 4.1]
- [Source: _bmad-output/planning-artifacts/architecture.md — Lifecycle email, Brevo SMTP]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- TypeScript check front (`tsc --noEmit`) : pass
- TypeScript check CMS (`tsc --noEmit`) : pass
- nodemailer + @types/nodemailer installés dans galerie-cms

### Completion Notes List
- FormulaireContact.vue : composant Vue complet avec validation blur+submit, honeypot, états, a11y
- POST vers Strapi via PUBLIC_STRAPI_API_URL (variable publique Astro passée en prop)
- Lifecycle afterCreate ajouté — email nodemailer avec guard si SMTP non configuré
- Query params ?oeuvre= et ?exposition= lus au mount pour pré-remplissage readonly
- Page contact.astro avec FormulaireContact client:visible

### Senior Developer Review (AI)
- Date : 2026-03-07
- Outcome : Changes Requested (1 High, 1 Medium, 1 Low)

#### Action Items
- [x] [HIGH] Focus outline supprimé — remplacé `outline: none` par `:focus-visible` pour respecter WCAG 2.4.7
- [x] [MEDIUM] referenceExposition non envoyé — ajout champ séparé, distinction oeuvre/exposition dans le POST et l'email
- [ ] [LOW] Pas de .env.example documentant PUBLIC_STRAPI_API_URL

### File List
- `galerie-front/src/components/islands/FormulaireContact.vue` (nouveau)
- `galerie-front/src/pages/contact.astro` (nouveau)
- `galerie-front/.env` (modifié — ajout PUBLIC_STRAPI_API_URL)
- `galerie-cms/src/api/message-contact/content-types/message-contact/lifecycles.ts` (modifié — ajout afterCreate)
- `galerie-cms/package.json` (modifié — ajout nodemailer)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modifié)
- `_bmad-output/implementation-artifacts/4-1-formulaire-de-contact.md` (modifié)
