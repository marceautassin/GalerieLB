import type { LlmsData } from './llms';
import { getSiteUrl } from './seo-utils';
import { fetchAPropos, fetchAccueil, fetchArtistes, fetchExpositions, fetchOeuvres } from './strapi-client';

/** Données lues dans le CMS pour les fichiers llms (appelé par les deux endpoints). */
export async function loadLlmsData(site: URL | undefined): Promise<LlmsData> {
  const [apropos, accueil, artistes, oeuvres, expositions] = await Promise.all([
    fetchAPropos(),
    fetchAccueil(),
    fetchArtistes(),
    fetchOeuvres(),
    fetchExpositions(),
  ]);
  return { siteUrl: getSiteUrl(site), apropos, accueil, artistes, oeuvres, expositions };
}
