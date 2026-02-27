# Story 4.1: Formulaire de contact

Status: ready-for-dev

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

- [ ] Task 1 : Créer FormulaireContact.vue (AC: #1, #2, #3, #8, #9, #10)
  - [ ] 1.1 Champs : nom (text, required), email (email, required), message (textarea, required, min 10 chars), referenceOeuvre (text, readonly si pré-rempli)
  - [ ] 1.2 Champ honeypot caché (`<input name="website" style="display:none">`)
  - [ ] 1.3 Validation au blur : champs requis, format email, longueur message
  - [ ] 1.4 Re-validation au submit
  - [ ] 1.5 Messages d'erreur en français sous chaque champ (`aria-describedby`)
  - [ ] 1.6 Bordure `--color-error` sur les champs en erreur
  - [ ] 1.7 Labels au-dessus des champs, légende "* Champ obligatoire"
  - [ ] 1.8 États : idle → submitting (spinner + bouton désactivé) → success / error
  - [ ] 1.9 Navigation Tab logique, focus visible
  - [ ] 1.10 2 colonnes (nom/email) sur desktop, pleine largeur sur mobile
- [ ] Task 2 : Soumission vers Strapi (AC: #4, #5, #9)
  - [ ] 2.1 POST JSON vers `STRAPI_API_URL/api/messages-contact` (public endpoint)
  - [ ] 2.2 Si honeypot rempli → ignorer silencieusement (pas d'erreur visible)
  - [ ] 2.3 Gestion erreur serveur : message sobre "Un problème est survenu..."
  - [ ] 2.4 `role="alert"` pour l'erreur serveur
- [ ] Task 3 : Confirmation succès (AC: #7)
  - [ ] 3.1 Remplacer le formulaire par le message de confirmation
  - [ ] 3.2 Texte : "Votre message a été envoyé. Louis vous répondra rapidement."
  - [ ] 3.3 Couleur `--color-success`, `role="status"`, `aria-live="polite"`
- [ ] Task 4 : Lifecycle email Brevo (AC: #6)
  - [ ] 4.1 Créer `src/api/message-contact/lifecycles.ts` dans galerie-cms
  - [ ] 4.2 Hook `afterCreate` : envoyer un email à `NOTIFICATION_EMAIL` via Brevo SMTP
  - [ ] 4.3 Contenu email : nom, email, message, référence oeuvre/expo
  - [ ] 4.4 Utiliser nodemailer ou le module email Strapi avec les env vars SMTP
- [ ] Task 5 : Lire le query param pour pré-remplissage (AC: #1)
  - [ ] 5.1 Au mount, lire `URLSearchParams` pour `?oeuvre=slug` ou `?exposition=slug`
  - [ ] 5.2 Pré-remplir le champ référence en readonly
- [ ] Task 6 : Page contact `/contact.astro` (AC: #1, #10)
  - [ ] 6.1 LayoutPrincipal avec titre "Contact"
  - [ ] 6.2 Intégrer `<FormulaireContact client:visible />`
  - [ ] 6.3 Informations pratiques sous le formulaire (adresse, horaires — optionnel)
  - [ ] 6.4 SeoHead

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

### Debug Log References

### Completion Notes List

### File List
