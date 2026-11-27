import type { APropos, Artiste, Exposition, Oeuvre } from '../types/strapi';
import { youtubeEmbedUrl, youtubeThumbnail, youtubeWatchUrl } from './youtube';
import { GALERIE, horairesEnLigne, lieuExposition, type AdressePostale } from './galerie';

type JsonLd = Record<string, unknown>;

const ABSOLUTE_URL_RE = /^https?:\/\//i;

export function getSiteUrl(site: URL | undefined): string {
  if (!site) {
    throw new Error(
      'Astro.site is not configured. Set SITE_URL env var or `site` in astro.config.ts.',
    );
  }
  return site.toString().replace(/\/$/, '');
}

export function absoluteUrl(siteUrl: string, path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  if (ABSOLUTE_URL_RE.test(path)) return path;
  if (path.startsWith('//')) return `https:${path}`;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${suffix}`;
}

/** URL absolue d'une page du site, avec `/` final (forme canonique, identique au sitemap). */
export function pageUrl(siteUrl: string, path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${siteUrl}/${clean}/` : `${siteUrl}/`;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function isEmpty(v: unknown): boolean {
  if (v === null || v === undefined || v === '') return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') {
    const keys = Object.keys(v as object).filter((k) => k !== '@type');
    return keys.length === 0;
  }
  return false;
}

function compact<T extends JsonLd>(obj: T): T {
  const out: JsonLd = {};
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      const filtered = v.filter((item) => !isEmpty(item));
      if (filtered.length > 0) out[k] = filtered;
    } else if (v !== null && typeof v === 'object') {
      const inner = compact(v as JsonLd);
      if (!isEmpty(inner)) out[k] = inner;
    } else if (!isEmpty(v)) {
      out[k] = v;
    }
  }
  return out as T;
}

function postalAddress(a: AdressePostale | undefined): JsonLd | undefined {
  return a ? compact({ '@type': 'PostalAddress', ...a }) : undefined;
}

export function buildArtGallerySchema(opts: { siteUrl: string; apropos: APropos | null }): JsonLd {
  const { siteUrl, apropos } = opts;
  const horaires = horairesEnLigne(apropos);
  return compact({
    '@context': 'https://schema.org',
    '@type': 'ArtGallery',
    name: GALERIE.nom,
    url: pageUrl(siteUrl, '/'),
    logo: absoluteUrl(siteUrl, '/logo.svg'),
    description: `${GALERIE.description} ${horaires}.`,
    address: postalAddress(GALERIE.adresse),
    founder: {
      '@type': 'Person',
      name: GALERIE.fondateur.nom,
      award: GALERIE.fondateur.distinction,
    },
    email: apropos?.email ?? undefined,
    telephone: apropos?.telephone ?? undefined,
    sameAs: [apropos?.instagram, apropos?.linkedin].filter(Boolean),
  });
}

export function buildPersonSchema(opts: { siteUrl: string; artiste: Artiste }): JsonLd {
  const { siteUrl, artiste } = opts;
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artiste.nom,
    description: artiste.biographie ? stripHtml(artiste.biographie) : undefined,
    image: absoluteUrl(siteUrl, artiste.photo?.url),
    url: pageUrl(siteUrl, `/artistes/${artiste.slug}`),
  });
}

export function buildVisualArtworkSchema(opts: { siteUrl: string; oeuvre: Oeuvre }): JsonLd {
  const { siteUrl, oeuvre } = opts;
  const visuel = oeuvre.visuels?.[0];
  const creator = oeuvre.artiste
    ? compact({
        '@type': 'Person',
        name: oeuvre.artiste.nom,
        url: pageUrl(siteUrl, `/artistes/${oeuvre.artiste.slug}`),
      })
    : undefined;

  const descriptionParts = [oeuvre.technique, oeuvre.dimensions, oeuvre.provenance].filter(
    (s): s is string => Boolean(s),
  );
  const description = descriptionParts.length ? descriptionParts.join(' — ') : undefined;

  return compact({
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: oeuvre.titre,
    creator,
    artMedium: oeuvre.technique ?? undefined,
    description,
    image: absoluteUrl(siteUrl, visuel?.url),
    url: pageUrl(siteUrl, `/oeuvres/${oeuvre.slug}`),
  });
}

export function buildExhibitionEventSchema(opts: { siteUrl: string; exposition: Exposition }): JsonLd {
  const { siteUrl, exposition } = opts;
  const visuel = exposition.visuels?.[0];
  const lieu = lieuExposition(exposition);

  return compact({
    '@context': 'https://schema.org',
    '@type': 'ExhibitionEvent',
    name: exposition.titre,
    startDate: exposition.dateDebut,
    endDate: exposition.dateFin ?? undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: lieu.nom, address: postalAddress(lieu.adresse) },
    organizer: { '@type': 'ArtGallery', name: GALERIE.nom, url: pageUrl(siteUrl, '/') },
    description: exposition.preface ? stripHtml(exposition.preface) : undefined,
    image: absoluteUrl(siteUrl, visuel?.url),
    url: pageUrl(siteUrl, `/expositions/${exposition.slug}`),
  });
}

export function buildVideoObjectSchema(opts: {
  videoId: string;
  name: string;
  description?: string | null;
  uploadDate?: string | null;
}): JsonLd {
  const { videoId, name, description, uploadDate } = opts;
  return compact({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description: description || name,
    thumbnailUrl: youtubeThumbnail(videoId),
    embedUrl: youtubeEmbedUrl(videoId),
    url: youtubeWatchUrl(videoId),
    uploadDate: uploadDate ?? undefined,
  });
}

/** Escape `</script>` and `<!--` sequences to safely embed JSON in a `<script>` block. */
export function jsonLdSafe(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
