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

export interface ImagePreset {
  widths: number[];
  sizes: string;
}

/** Fixed-size image preset (CSS px known, vary by DPR only). */
interface DensityPreset {
  densities: number[];
  width: number;
}

/** Cartes dans une grille 1/2/4 colonnes (acquisitions de l'accueil : 1 ligne de 4 à partir de 1024 px). */
export const CARTE_GRILLE: ImagePreset = {
  widths: [400, 600, 800, 1200, 1600],
  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
};

/**
 * Catalogue /oeuvres : 1 colonne (< 640), 2 (< 1024), 3 (< 1280), 4 ensuite.
 * Entre 1024 et 1279 px, la 5e carte de chaque série (`span-2`) occupe 2 colonnes sur 3 (~67vw) :
 * `sizes` retient ce cas le plus large pour que les cartes doubles restent nettes.
 * Échelle jusqu'à 2000 px : 1279 px x 67 % x DPR 2 = ~1700 px physiques.
 */
export const CATALOGUE_GRILLE: ImagePreset = {
  widths: [400, 600, 800, 1000, 1200, 1600, 2000],
  sizes: '(max-width: 640px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 67vw, 25vw',
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
  /* 1800 garde la netteté sur écrans haute densité (DPR 2x) avec un sizes desktop de 900px. */
  widths: [600, 900, 1200, 1800],
  sizes: '(max-width: 768px) 100vw, 900px',
};

/** Portrait artiste sur fiche (fullwidth mobile, 320px desktop). */
export const PORTRAIT_ARTISTE: ImagePreset = {
  widths: [320, 480, 640, 800],
  sizes: '(max-width: 768px) 100vw, 320px',
};

/** Portrait galeriste sur /a-propos — taille fixe ~520 px desktop (grid 3fr/5fr), variations par DPR. */
export const PORTRAIT_A_PROPOS: DensityPreset = {
  densities: [1, 2, 3],
  width: 520,
};

/** Vues galerie en bandeau 3 colonnes full-bleed. */
export const VUE_GALERIE: ImagePreset = {
  widths: [400, 600, 900, 1200, 1600],
  sizes: '(max-width: 640px) 100vw, 33vw',
};
