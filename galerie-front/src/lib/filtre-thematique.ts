export interface EtatCarte {
  visible: boolean;
  /** Une carte sur cinq (rang calculé parmi les cartes visibles) occupe deux colonnes. */
  span2: boolean;
}

/** Slugs de thématiques d'une carte, tels que sérialisés dans `data-thematiques`. */
export function parseThematiques(attr: string | undefined): string[] {
  return (attr ?? '').split(' ').filter(Boolean);
}

/** État (visibilité, rang `span-2`) de chaque carte pour la thématique active (`null` = toutes). */
export function etatCartes(cartes: string[][], active: string | null): EtatCarte[] {
  let rang = 0;
  return cartes.map((slugs) => {
    const visible = !active || slugs.includes(active);
    if (visible) rang += 1;
    return { visible, span2: visible && rang % 5 === 0 };
  });
}

/** Thématique à activer pour un slug lu dans l'URL : le slug s'il existe, sinon `null` (toutes). */
export function thematiqueValide(slug: string | null, thematiques: { slug: string }[]): string | null {
  return slug && thematiques.some((t) => t.slug === slug) ? slug : null;
}
