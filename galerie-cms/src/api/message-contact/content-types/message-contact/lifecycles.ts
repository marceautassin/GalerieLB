import nodemailer from 'nodemailer';

export default {
  beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    const { data } = event.params;
    if (!data.dateEnvoi) {
      data.dateEnvoi = new Date().toISOString();
    }
  },

  async afterCreate(event: { result: Record<string, string | null> }) {
    const { result } = event;

    const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, NOTIFICATION_EMAIL } = process.env;
    if (!SMTP_HOST || !SMTP_USERNAME || !SMTP_PASSWORD || !NOTIFICATION_EMAIL) {
      console.warn('[message-contact] SMTP non configuré — email de notification non envoyé.');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Galerie Louis Barrand" <${SMTP_USERNAME}>`,
        to: NOTIFICATION_EMAIL,
        subject: `Nouveau message de ${result.nom}`,
        text: [
          `Nom : ${result.nom}`,
          `Email : ${result.email}`,
          `Message : ${result.message}`,
          `Référence oeuvre : ${result.referenceOeuvre || 'Aucune'}`,
          `Référence exposition : ${result.referenceExposition || 'Aucune'}`,
        ].join('\n'),
      });
    } catch (error) {
      console.error('[message-contact] Erreur envoi email :', error);
    }
  },
};
