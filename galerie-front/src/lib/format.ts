/**
 * Formate une date ISO en français.
 * @param dateStr - Date au format ISO (ex: "2026-03-01")
 * @param style - 'short' = mois + année, 'long' = jour + mois + année
 */
export function formatDateFr(
  dateStr: string,
  style: 'short' | 'long' = 'long',
): string {
  // timeZone UTC : « 2026-03-13 » est lu à minuit UTC, on évite un décalage d'un jour selon la machine.
  const options: Intl.DateTimeFormatOptions =
    style === 'short'
      ? { month: 'long', year: 'numeric', timeZone: 'UTC' }
      : { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };

  return new Date(dateStr).toLocaleDateString('fr-FR', options);
}
