import type {
  StrapiResponse,
  StrapiSingleResponse,
  Artiste,
  Oeuvre,
  Thematique,
  Exposition,
  APropos,
  ArticlePresse,
} from '../types/strapi';

const STRAPI_API_URL = import.meta.env.STRAPI_API_URL;
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

async function fetchStrapi<T>(
  endpoint: string,
  query?: string,
): Promise<T> {
  if (!STRAPI_API_URL || !STRAPI_API_TOKEN) {
    throw new Error(
      'STRAPI_API_URL and STRAPI_API_TOKEN must be set in environment variables',
    );
  }

  const url = query
    ? `${STRAPI_API_URL}/api/${endpoint}?${query}`
    : `${STRAPI_API_URL}/api/${endpoint}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
  });

  if (!response.ok) {
    throw new Error(
      `Strapi API error: ${response.status} ${response.statusText} on ${endpoint}`,
    );
  }

  return response.json() as Promise<T>;
}

function warnIfTruncated(meta: { pagination?: { total: number; pageSize: number } }) {
  if (meta.pagination && meta.pagination.total > meta.pagination.pageSize) {
    console.warn(
      `[strapi-client] Collection truncated: ${meta.pagination.total} entries but pageSize=${meta.pagination.pageSize}. Increase pageSize or implement pagination.`,
    );
  }
}

// --- Artistes ---

export async function fetchArtistes(): Promise<Artiste[]> {
  const result = await fetchStrapi<StrapiResponse<Artiste>>(
    'artistes',
    'status=published&populate[0]=photo&populate[1]=oeuvres&pagination[pageSize]=100',
  );
  warnIfTruncated(result.meta);
  return result.data.map(normalizeArtiste);
}

export async function fetchArtisteBySlug(
  slug: string,
): Promise<Artiste | null> {
  const result = await fetchStrapi<StrapiResponse<Artiste>>(
    'artistes',
    `status=published&filters[slug][$eq]=${encodeURIComponent(slug)}&populate[0]=photo&populate[oeuvres][populate][0]=visuels`,
  );
  const artiste = result.data[0];
  return artiste ? normalizeArtiste(artiste) : null;
}

// --- Oeuvres ---

export async function fetchOeuvres(): Promise<Oeuvre[]> {
  const result = await fetchStrapi<StrapiResponse<Oeuvre>>(
    'oeuvres',
    'status=published&populate[0]=visuels&populate[1]=artiste&populate[2]=thematiques&populate[3]=expositions&pagination[pageSize]=100',
  );
  warnIfTruncated(result.meta);
  return result.data.map(normalizeOeuvre);
}

export async function fetchOeuvreBySlug(slug: string): Promise<Oeuvre | null> {
  const result = await fetchStrapi<StrapiResponse<Oeuvre>>(
    'oeuvres',
    `status=published&filters[slug][$eq]=${encodeURIComponent(slug)}&populate[0]=visuels&populate[1]=artiste&populate[2]=thematiques&populate[3]=expositions`,
  );
  const oeuvre = result.data[0];
  return oeuvre ? normalizeOeuvre(oeuvre) : null;
}

// --- Expositions ---

export async function fetchExpositions(): Promise<Exposition[]> {
  const result = await fetchStrapi<StrapiResponse<Exposition>>(
    'expositions',
    'status=published&populate[0]=visuels&populate[oeuvres][populate][0]=visuels&populate[oeuvres][populate][1]=artiste&pagination[pageSize]=100',
  );
  warnIfTruncated(result.meta);
  return result.data.map(normalizeExposition);
}

export async function fetchExpositionBySlug(
  slug: string,
): Promise<Exposition | null> {
  const result = await fetchStrapi<StrapiResponse<Exposition>>(
    'expositions',
    `status=published&filters[slug][$eq]=${encodeURIComponent(slug)}&populate[0]=visuels&populate[oeuvres][populate][0]=visuels&populate[oeuvres][populate][1]=artiste`,
  );
  const exposition = result.data[0];
  return exposition ? normalizeExposition(exposition) : null;
}

// --- Thematiques ---

export async function fetchThematiques(): Promise<Thematique[]> {
  const result = await fetchStrapi<StrapiResponse<Thematique>>(
    'thematiques',
    'status=published&populate[0]=oeuvres&pagination[pageSize]=100',
  );
  warnIfTruncated(result.meta);
  return result.data.map(normalizeThematique);
}

// --- ArticlesPresse ---

export async function fetchArticlesPresse(): Promise<ArticlePresse[]> {
  const result = await fetchStrapi<StrapiResponse<ArticlePresse>>(
    'articles-presse',
    'status=published&populate[0]=fichierPdf&populate[1]=visuel&pagination[pageSize]=100',
  );
  warnIfTruncated(result.meta);
  return result.data;
}

// --- APropos (single type) ---

export async function fetchAPropos(): Promise<APropos | null> {
  const result = await fetchStrapi<StrapiSingleResponse<APropos>>(
    'a-propos',
    'status=published',
  );
  return result.data ?? null;
}

// --- Normalizers (Strapi returns null for empty media/relations) ---

function normalizeArtiste(artiste: Artiste): Artiste {
  return {
    ...artiste,
    oeuvres: artiste.oeuvres ?? [],
  };
}

function normalizeOeuvre(oeuvre: Oeuvre): Oeuvre {
  return {
    ...oeuvre,
    visuels: oeuvre.visuels ?? [],
    thematiques: oeuvre.thematiques ?? [],
    expositions: oeuvre.expositions ?? [],
  };
}

function normalizeExposition(exposition: Exposition): Exposition {
  return {
    ...exposition,
    visuels: exposition.visuels ?? [],
    oeuvres: (exposition.oeuvres ?? []).map(normalizeOeuvre),
  };
}

function normalizeThematique(thematique: Thematique): Thematique {
  return {
    ...thematique,
    oeuvres: thematique.oeuvres ?? [],
  };
}
