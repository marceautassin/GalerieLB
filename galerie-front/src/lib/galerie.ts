/**
 * Source unique des données factuelles de la galerie (adresse structurée, fondateur).
 * Utilisée par le JSON-LD, le pied de page, la page « à propos » et les fichiers llms.
 * Le téléphone, l'email, les réseaux et les horaires restent éditables dans le CMS (singleType À propos).
 */

export interface AdressePostale {
  streetAddress: string;
  postalCode?: string;
  addressLocality?: string;
  addressCountry?: string;
}

export const GALERIE = {
  nom: 'Galerie Louis Barrand',
  description:
    "Galerie d'art parisienne spécialisée dans la redécouverte d'artistes des XIXe et XXe siècles — peinture, dessin, estampe.",
  adresse: {
    streetAddress: '7, avenue Franklin Roosevelt',
    postalCode: '75008',
    addressLocality: 'Paris',
    addressCountry: 'FR',
  } satisfies AdressePostale,
  horairesParDefaut: 'Sur rendez-vous',
  fondateur: { nom: 'Louis Barrand', distinction: 'Prix Marcus 2025' },
} as const;

/** Horaires saisis dans le CMS, ou « Sur rendez-vous » à défaut. */
export function horairesGalerie(apropos: { horaires?: string | null } | null | undefined): string {
  return apropos?.horaires?.trim() || GALERIE.horairesParDefaut;
}

/** Horaires sur une ligne : retours à la ligne en « ; », point final retiré. */
export function horairesEnLigne(apropos: { horaires?: string | null } | null | undefined): string {
  return horairesGalerie(apropos)
    .replace(/\s*\r?\n\s*/g, ' ; ')
    .replace(/\.+$/, '')
    .trim();
}

/** Lignes d'affichage d'une adresse : rue, puis « code postal localité ». */
export function lignesAdresse(a: AdressePostale): string[] {
  const ville = [a.postalCode, a.addressLocality].filter(Boolean).join(' ');
  return [a.streetAddress, ville].filter(Boolean);
}

/** Adresse sur une seule ligne, pour les fichiers texte. */
export function adresseEnLigne(a: AdressePostale): string {
  return lignesAdresse(a).join(', ');
}

const ADRESSE_FR_RE = /^(?:(.*?)[,\s]+)?(\d{5})\s+(.+)$/;
const PAYS_FRANCE_RE = /^(france|fr)$/i;

/**
 * Convertit une adresse saisie en texte libre (« Île des Impressionnistes, 78400 Chatou ») en adresse postale.
 * Le pays `FR` n'est posé que pour une adresse française reconnue (code postal à 5 chiffres, « France » final
 * facultatif). Un autre pays en fin de saisie (« …, 10115 Berlin, Allemagne »), ou aucun code postal reconnu :
 * le texte reste dans `streetAddress` et le pays est omis.
 */
export function parseAdresseLibre(texte: string | null | undefined): AdressePostale | undefined {
  const parts = (texte ?? '')
    .split(/\s*(?:,|\r?\n)\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return undefined;
  if (PAYS_FRANCE_RE.test(parts[parts.length - 1]) && parts.length > 1) parts.pop();
  const brut = parts.join(', ');
  const paysEtranger = parts.length >= 2 && !/\d/.test(parts[parts.length - 1]);
  const m = paysEtranger ? null : ADRESSE_FR_RE.exec(brut);
  if (!m) return { streetAddress: brut };
  const [, rue, postalCode, addressLocality] = m;
  return { streetAddress: rue ?? '', postalCode, addressLocality, addressCountry: 'FR' };
}

export interface LieuExposition {
  nom: string;
  adresse?: AdressePostale;
  /** `true` si l'exposition a lieu hors de la galerie. */
  horsLesMurs: boolean;
}

/** Lieu d'une exposition : celui renseigné dans le CMS, sinon la galerie. */
export function lieuExposition(e: { lieu?: string | null; adresseLieu?: string | null }): LieuExposition {
  const nom = e.lieu?.trim();
  if (!nom) return { nom: GALERIE.nom, adresse: GALERIE.adresse, horsLesMurs: false };
  return { nom, adresse: parseAdresseLibre(e.adresseLieu), horsLesMurs: true };
}
