/**
 * Responsive image presets per display context.
 *
 * Used with Astro's <Image> component:
 *   <Image src={...} widths={CARTE_GRILLE.widths} sizes={CARTE_GRILLE.sizes} ... />
 *
 * Each preset's `widths` ladder targets realistic max physical pixel counts (CSS px × 2 DPR)
 * so retina displays don't pick an undersized variant. Astro clamps ladder entries larger
 * than the source asset automatically.
 */

interface ImagePreset {
  widths: number[];
  sizes: string;
}

/** Fixed-size image preset (CSS px known, vary by DPR only). */
interface DensityPreset {
  densities: number[];
  width: number;
}

/** Cartes dans une grille 1/2/4 colonnes (acquisitions home). */
export const CARTE_GRILLE: ImagePreset = {
  widths: [400, 600, 800, 1200, 1600],
  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
};

/** Grille 1/2/3 colonnes (expositions, artistes, presse, fiches related). */
export const CARTE_GRILLE_3: ImagePreset = {
  widths: [400, 600, 800, 1200, 1600],
  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
};

/** Hero full-bleed sur la home : mobile full width, desktop 60vw. */
export const HERO_HOME: ImagePreset = {
  widths: [600, 1000, 1400, 2000, 2560],
  sizes: '(max-width: 768px) 100vw, 60vw',
};

/** Visuel principal d'une fiche œuvre (3fr/2fr split desktop = ~60vw). */
export const FICHE_OEUVRE: ImagePreset = {
  widths: [600, 900, 1200, 1600, 2000],
  sizes: '(max-width: 768px) 100vw, 60vw',
};

/** Visuel contenu dans le conteneur article (~720-800px desktop) : fiche expo visuels, presse. */
export const FICHE_VISUEL: ImagePreset = {
  widths: [600, 900, 1200, 1600],
  sizes: '(max-width: 768px) 100vw, 80vw',
};

/** Portrait artiste sur fiche (fullwidth mobile, 320px desktop). */
export const PORTRAIT_ARTISTE: ImagePreset = {
  widths: [320, 480, 640, 800],
  sizes: '(max-width: 768px) 100vw, 320px',
};

/** Portrait galeriste sur /a-propos — taille fixe 240/280 px, variations par DPR. */
export const PORTRAIT_A_PROPOS: DensityPreset = {
  densities: [1, 2, 3],
  width: 280,
};

/** Vues galerie en bandeau 3 colonnes full-bleed. */
export const VUE_GALERIE: ImagePreset = {
  widths: [400, 600, 900, 1200, 1600],
  sizes: '(max-width: 640px) 100vw, 33vw',
};
