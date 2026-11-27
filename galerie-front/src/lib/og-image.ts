/** Largeur cible de l'image de partage (og:image). */
export const OG_IMAGE_WIDTH = 1200;

/** Dimensions de l'og:image : 1200 px de large au plus (jamais d'agrandissement), ratio conservé. */
export function ogImageSize(source: { width: number; height: number }): { width: number; height: number } {
  const width = Math.min(OG_IMAGE_WIDTH, source.width);
  return { width, height: Math.round((source.height * width) / source.width) };
}
