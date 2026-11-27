import type { APropos, Accueil, Artiste, Exposition, Oeuvre } from '../types/strapi';
import { formatDateFr } from './format';
import { GALERIE, adresseEnLigne, horairesEnLigne, lieuExposition } from './galerie';
import { STATUT_LABEL, statutExposition } from './exposition-statut';
import { pageUrl, stripHtml } from './seo-utils';
import { parseYoutubeId, youtubeWatchUrl } from './youtube';

export interface LlmsData {
  siteUrl: string;
  apropos: APropos | null;
  accueil: Accueil | null;
  artistes: Artiste[];
  oeuvres: Oeuvre[];
  expositions: Exposition[];
}

const POSITIONNEMENT = `${GALERIE.nom} : galerie d'art parisienne fondée par ${GALERIE.fondateur.nom} (${GALERIE.fondateur.distinction}), spécialisée dans la redécouverte d'artistes des XIXe et XXe siècles. Peinture, dessin, estampe.`;

/** Texte issu du CMS sur une ligne : un `#` initial ne doit pas devenir un titre Markdown. */
function texteCms(html: string): string {
  return stripHtml(html).replace(/^(\s*)#/, '$1\\#');
}

function lienMarkdown(label: string, href: string): string {
  return `[${label.replace(/[[\]]/g, '\\$&')}](${href})`;
}

function lienVideo(videoYoutube: string | null | undefined): string | null {
  const id = parseYoutubeId(videoYoutube);
  return id ? youtubeWatchUrl(id) : null;
}

function coordonnees({ apropos }: Pick<LlmsData, 'apropos'>): string[] {
  const lines = [
    `Adresse : ${GALERIE.nom}, ${adresseEnLigne(GALERIE.adresse)}`,
    `Horaires : ${horairesEnLigne(apropos)}`,
  ];
  if (apropos?.telephone) lines.push(`Téléphone : ${apropos.telephone}`);
  if (apropos?.email) lines.push(`Email : ${apropos.email}`);
  if (apropos?.instagram) lines.push(`Instagram : ${apropos.instagram}`);
  if (apropos?.linkedin) lines.push(`LinkedIn : ${apropos.linkedin}`);
  return lines;
}

function renderArtiste(siteUrl: string, a: Artiste): string {
  const lines = [`### ${a.nom}`, `URL : ${pageUrl(siteUrl, `/artistes/${a.slug}`)}`];
  if (a.biographie) lines.push(texteCms(a.biographie));
  if (a.contexteArtistique) lines.push(`Contexte : ${texteCms(a.contexteArtistique)}`);
  return lines.join('\n');
}

function renderOeuvre(siteUrl: string, o: Oeuvre): string {
  const lines = [`### ${o.titre}`, `URL : ${pageUrl(siteUrl, `/oeuvres/${o.slug}`)}`];
  if (o.artiste) lines.push(`Artiste : ${o.artiste.nom}`);
  if (o.technique) lines.push(`Technique : ${o.technique}`);
  if (o.dimensions) lines.push(`Dimensions : ${o.dimensions}`);
  if (o.provenance) lines.push(`Provenance : ${o.provenance}`);
  return lines.join('\n');
}

function renderExposition(siteUrl: string, e: Exposition): string {
  const lines = [`### ${e.titre}`, `URL : ${pageUrl(siteUrl, `/expositions/${e.slug}`)}`];
  const debut = formatDateFr(e.dateDebut);
  const fin = e.dateFin ? formatDateFr(e.dateFin) : '';
  lines.push(`Dates : ${fin ? `Du ${debut} au ${fin}` : `Depuis le ${debut}`}`);
  lines.push(`Statut : ${STATUT_LABEL[statutExposition(e)].toLowerCase()}`);
  const lieu = lieuExposition(e);
  lines.push(`Lieu : ${[lieu.nom, lieu.adresse && adresseEnLigne(lieu.adresse)].filter(Boolean).join(', ')}`);
  const video = lienVideo(e.videoYoutube);
  if (video) lines.push(`Vidéo : ${video}`);
  if (e.preface) lines.push(texteCms(e.preface));
  return lines.join('\n');
}

const PAGES: [path: string, label: string, description: string][] = [
  ['/artistes', 'Artistes', 'Artistes représentés par la galerie — biographies et portfolios'],
  ['/oeuvres', 'Œuvres', "Catalogue des œuvres disponibles — peintures, dessins, estampes"],
  ['/expositions', 'Expositions', 'Expositions à venir, en cours et passées'],
  ['/a-propos', 'À propos', 'Histoire de la galerie, parcours de Louis Barrand, Prix Marcus, informations pratiques'],
  ['/presse', 'Presse', 'Articles de presse et couverture média'],
  ['/contact', 'Contact', 'Formulaire de prise de rendez-vous'],
];

export function buildLlmsTxt({ siteUrl, apropos, accueil, artistes, expositions }: LlmsData): string {
  const enCours = expositions.filter((e) => statutExposition(e) === 'en-cours');
  const aVenir = expositions.filter((e) => statutExposition(e) === 'a-venir');
  const lienExpo = (e: Exposition) =>
    `- ${lienMarkdown(e.titre, pageUrl(siteUrl, `/expositions/${e.slug}`))} : ${STATUT_LABEL[statutExposition(e)].toLowerCase()}, ${lieuExposition(e).nom}`;
  const video = lienVideo(accueil?.videoYoutube);

  const sections = [
    `# ${GALERIE.nom}`,
    '',
    `> ${POSITIONNEMENT}`,
    '',
    '## Informations pratiques',
    '',
    ...coordonnees({ apropos }).map((l) => `- ${l}`),
    ...(video ? [`- Vidéo de présentation : ${video}`] : []),
    '',
    '## Pages principales',
    '',
    `- [Accueil](${pageUrl(siteUrl, '/')})`,
    ...PAGES.map(([path, label, desc]) => `- [${label}](${pageUrl(siteUrl, path)}) : ${desc}`),
    '',
    ...(enCours.length + aVenir.length > 0
      ? ['## Expositions en cours et à venir', '', ...[...enCours, ...aVenir].map(lienExpo), '']
      : []),
    `## Artistes (${artistes.length})`,
    '',
    ...artistes.map((a) => `- ${lienMarkdown(a.nom, pageUrl(siteUrl, `/artistes/${a.slug}`))}`),
    '',
    '## Contenu détaillé',
    '',
    `- [llms-full.txt](${siteUrl}/llms-full.txt) : contenu intégral du site (artistes, œuvres, expositions, informations pratiques)`,
    '',
  ];
  return sections.join('\n');
}

export function buildLlmsFullTxt({ siteUrl, apropos, accueil, artistes, oeuvres, expositions }: LlmsData): string {
  const infos: string[] = [];
  if (apropos?.biographieLouis) infos.push(texteCms(apropos.biographieLouis));
  if (apropos?.textePrixMarcus) infos.push(`Prix Marcus : ${texteCms(apropos.textePrixMarcus)}`);
  infos.push(...coordonnees({ apropos }));
  const video = lienVideo(accueil?.videoYoutube);
  if (video) infos.push(`Vidéo de présentation : ${video}`);

  const sections = [
    `# ${GALERIE.nom} — Contenu intégral`,
    '',
    POSITIONNEMENT,
    '',
    `Site : ${pageUrl(siteUrl, '/')}`,
    '',
    '## À propos de la galerie',
    '',
    infos.join('\n'),
    '',
    `## Artistes (${artistes.length})`,
    '',
    artistes.map((a) => renderArtiste(siteUrl, a)).join('\n\n'),
    '',
    `## Œuvres (${oeuvres.length})`,
    '',
    oeuvres.map((o) => renderOeuvre(siteUrl, o)).join('\n\n'),
    '',
    `## Expositions (${expositions.length})`,
    '',
    expositions.map((e) => renderExposition(siteUrl, e)).join('\n\n'),
    '',
  ];
  return sections.join('\n');
}
