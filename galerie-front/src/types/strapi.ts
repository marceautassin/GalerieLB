// Types TypeScript alignés sur les schémas Strapi v5
// En Strapi v5, les attributs sont directement sur l'objet data (pas de .attributes)

// --- Strapi response wrappers ---

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: StrapiMeta;
}

// --- Media ---

export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  } | null;
}

// --- Content types ---

export interface Artiste {
  id: number;
  documentId: string;
  nom: string;
  biographie: string | null;
  contexteArtistique: string | null;
  photo: StrapiMedia | null;
  slug: string;
  oeuvres: Oeuvre[];
}

export interface Oeuvre {
  id: number;
  documentId: string;
  titre: string;
  technique: string | null;
  dimensions: string | null;
  provenance: string | null;
  visuels: StrapiMedia[];
  slug: string;
  artiste: Artiste | null;
  thematiques: Thematique[];
  expositions: Exposition[];
}

export interface Thematique {
  id: number;
  documentId: string;
  nom: string;
  slug: string;
  oeuvres: Oeuvre[];
}

export interface Exposition {
  id: number;
  documentId: string;
  titre: string;
  dateDebut: string;
  dateFin: string | null;
  preface: string | null;
  visuels: StrapiMedia[];
  statut: 'en-cours' | 'passee';
  slug: string;
  oeuvres: Oeuvre[];
}

export interface ArticlePresse {
  id: number;
  documentId: string;
  titre: string;
  type: 'pdf' | 'lien';
  fichierPdf: StrapiMedia | null;
  urlExterne: string | null;
  visuel: StrapiMedia | null;
}

export interface APropos {
  id: number;
  documentId: string;
  biographieLouis: string | null;
  textePrixMarcus: string | null;
  adresse: string | null;
  horaires: string | null;
  telephone: string | null;
  email: string | null;
  linkedin: string | null;
  vuesGalerie: StrapiMedia[];
}

export interface MessageContact {
  id: number;
  documentId: string;
  nom: string;
  email: string;
  message: string;
  referenceOeuvre: string | null;
  referenceExposition: string | null;
  dateEnvoi: string;
}
