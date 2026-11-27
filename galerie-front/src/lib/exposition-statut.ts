export type StatutExposition = 'a-venir' | 'en-cours' | 'passee';

export const STATUT_LABEL: Record<StatutExposition, string> = {
  'a-venir': 'À venir',
  'en-cours': 'En cours',
  passee: 'Passée',
};

interface Dates {
  dateDebut: string;
  dateFin?: string | null;
}

/** Date du jour (YYYY-MM-DD) à Paris, indépendante du fuseau de la machine de build. */
export function aujourdhuiParis(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(now);
}

/**
 * Statut calculé depuis les dates (format YYYY-MM-DD, comparaison lexicographique).
 * Le jour de début et le jour de fin sont inclus ; sans date de fin, l'exposition reste en cours.
 */
export function statutExposition(e: Dates, aujourdhui: string = aujourdhuiParis()): StatutExposition {
  const debut = e.dateDebut.slice(0, 10);
  const fin = e.dateFin?.slice(0, 10);
  if (aujourdhui < debut) return 'a-venir';
  if (fin && aujourdhui > fin) return 'passee';
  return 'en-cours';
}
