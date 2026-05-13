import type { APIRoute } from 'astro';
import { fetchArtistes, fetchOeuvres, fetchExpositions, fetchAPropos } from '../lib/strapi-client';
import type { Artiste, Oeuvre, Exposition, APropos } from '../types/strapi';
import { stripHtml } from '../lib/seo-utils';

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function renderArtiste(a: Artiste): string {
  const lines: string[] = [`### ${a.nom}`];
  if (a.biographie) lines.push(stripHtml(a.biographie));
  if (a.contexteArtistique) lines.push(`Contexte : ${stripHtml(a.contexteArtistique)}`);
  return lines.join('\n');
}

function renderOeuvre(o: Oeuvre): string {
  const lines: string[] = [`### ${o.titre}`];
  if (o.artiste) lines.push(`Artiste : ${o.artiste.nom}`);
  if (o.technique) lines.push(`Technique : ${o.technique}`);
  if (o.dimensions) lines.push(`Dimensions : ${o.dimensions}`);
  if (o.provenance) lines.push(`Provenance : ${o.provenance}`);
  return lines.join('\n');
}

function renderExposition(e: Exposition): string {
  const lines: string[] = [`### ${e.titre}`];
  const debut = formatDate(e.dateDebut);
  if (debut) {
    const fin = formatDate(e.dateFin);
    lines.push(`Dates : ${fin ? `Du ${debut} au ${fin}` : `Depuis le ${debut}`}`);
  }
  lines.push(`Statut : ${e.statut === 'en-cours' ? 'en cours' : 'passée'}`);
  if (e.preface) lines.push(stripHtml(e.preface));
  return lines.join('\n');
}

function renderAPropos(a: APropos | null): string {
  if (!a) return '';
  const lines: string[] = [];
  if (a.biographieLouis) lines.push(stripHtml(a.biographieLouis));
  if (a.textePrixMarcus) lines.push(`Prix Marcus : ${stripHtml(a.textePrixMarcus)}`);
  if (a.adresse) lines.push(`Adresse : ${a.adresse}`);
  if (a.horaires) lines.push(`Horaires : ${a.horaires}`);
  if (a.telephone) lines.push(`Téléphone : ${a.telephone}`);
  if (a.email) lines.push(`Email : ${a.email}`);
  if (a.instagram) lines.push(`Instagram : ${a.instagram}`);
  if (a.linkedin) lines.push(`LinkedIn : ${a.linkedin}`);
  return lines.join('\n');
}

export const GET: APIRoute = async () => {
  const [artistes, oeuvres, expositions, apropos] = await Promise.all([
    fetchArtistes(),
    fetchOeuvres(),
    fetchExpositions(),
    fetchAPropos(),
  ]);

  const sections: string[] = [
    '# Galerie Louis Barrand — Contenu intégral',
    '',
    "Galerie d'art parisienne spécialisée dans la redécouverte d'artistes des XIXe et XXe siècles.",
    '',
    '## À propos de la galerie',
    '',
    renderAPropos(apropos),
    '',
    `## Artistes (${artistes.length})`,
    '',
    artistes.map(renderArtiste).join('\n\n'),
    '',
    `## Œuvres (${oeuvres.length})`,
    '',
    oeuvres.map(renderOeuvre).join('\n\n'),
    '',
    `## Expositions (${expositions.length})`,
    '',
    expositions.map(renderExposition).join('\n\n'),
    '',
  ];

  return new Response(sections.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
