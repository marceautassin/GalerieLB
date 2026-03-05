/**
 * Formate une date ISO en français.
 * @param dateStr - Date au format ISO (ex: "2026-03-01")
 * @param style - 'short' = mois + année, 'long' = jour + mois + année
 */
export function formatDateFr(
  dateStr: string,
  style: 'short' | 'long' = 'long',
): string {
  const options: Intl.DateTimeFormatOptions =
    style === 'short'
      ? { month: 'long', year: 'numeric' }
      : { day: 'numeric', month: 'long', year: 'numeric' };

  return new Date(dateStr).toLocaleDateString('fr-FR', options);
}
