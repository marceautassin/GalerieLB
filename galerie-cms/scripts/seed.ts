/**
 * Seed script — Peuple Strapi avec des données de test réalistes.
 *
 * Usage :
 *   1. Démarrer Strapi : yarn develop
 *   2. Créer un API token full-access dans l'admin (Settings > API Tokens)
 *   3. Lancer : STRAPI_URL=http://localhost:1337 STRAPI_TOKEN=<token> npx tsx scripts/seed.ts
 *
 * Le script est idempotent : il ne crée pas de doublons (vérification par slug/nom).
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('STRAPI_TOKEN manquant. Crée un API token full-access dans Strapi admin.');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${STRAPI_TOKEN}`,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function strapiGet(endpoint: string) {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, { headers });
  if (!res.ok) throw new Error(`GET ${endpoint}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function strapiPost(endpoint: string, data: Record<string, unknown>) {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${endpoint}: ${res.status} ${text}`);
  }
  return res.json();
}

async function strapiPut(endpoint: string, data: Record<string, unknown>) {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PUT ${endpoint}: ${res.status} ${text}`);
  }
  return res.json();
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function uploadImageFromUrl(imageUrl: string, fileName: string): Promise<number | null> {
  try {
    await delay(300);
    const res = await fetch(imageUrl, { redirect: 'follow' });
    if (!res.ok) {
      console.warn(`  Impossible de telecharger ${fileName}: ${res.status}`);
      return null;
    }
    const blob = await res.blob();
    const formData = new FormData();
    formData.append('files', blob, fileName);

    const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      body: formData,
    });
    if (!uploadRes.ok) {
      console.warn(`  Upload echoue pour ${fileName}: ${uploadRes.status}`);
      return null;
    }
    const uploaded = await uploadRes.json();
    return uploaded[0]?.id ?? null;
  } catch (e) {
    console.warn(`  Erreur upload ${fileName}:`, (e as Error).message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Données de seed
// ---------------------------------------------------------------------------

const thematiques = [
  { nom: 'Paysages' },
  { nom: 'Portraits' },
  { nom: 'Natures mortes' },
  { nom: 'Art animalier' },
  { nom: 'Scènes de genre' },
  { nom: 'Dessins et estampes' },
  { nom: 'Abstraction' },
];

const artistes = [
  {
    nom: 'Eugène Lami',
    biographie: 'Eugène Lami (1800-1890) est un peintre, aquarelliste et lithographe français. Élève d\'Horace Vernet et du baron Gros, il se distingue par ses scènes de genre élégantes, ses compositions historiques et ses aquarelles mondaines. Peintre officiel de la cour sous Louis-Philippe, il décore les intérieurs des Tuileries et de Versailles.',
    contexteArtistique: 'Lami est l\'un des chroniqueurs visuels les plus fins de la société parisienne du XIXe siècle. Ses aquarelles et lithographies documentent avec précision et élégance la vie aristocratique et bourgeoise de son époque.',
    imageUrl: 'https://picsum.photos/seed/lami/400/500',
  },
  {
    nom: 'Camille Pissarro',
    biographie: 'Camille Pissarro (1830-1903) est un peintre et graveur franco-danois, figure fondatrice de l\'impressionnisme. Seul artiste à avoir participé aux huit expositions impressionnistes, il est considéré comme le doyen et le mentor du mouvement. Son oeuvre couvre les paysages ruraux, les scènes de marché et les vues urbaines.',
    contexteArtistique: 'Pissarro joue un rôle central dans l\'histoire de l\'impressionnisme, tant par sa peinture que par son influence sur Cézanne, Gauguin et les néo-impressionnistes. Ses gravures, moins connues que ses toiles, témoignent d\'une maîtrise technique remarquable.',
    imageUrl: 'https://picsum.photos/seed/pissarro/400/500',
  },
  {
    nom: 'René Princeteau',
    biographie: 'René Princeteau (1843-1914) est un peintre et sculpteur français spécialisé dans les sujets équestres et les scènes de chasse. Sourd de naissance, il étudie à l\'École des Beaux-Arts de Paris et devient le maître du jeune Henri de Toulouse-Lautrec. Ses toiles témoignent d\'une observation précise du mouvement animal.',
    contexteArtistique: 'Princeteau s\'inscrit dans la grande tradition de la peinture animalière française. Son influence sur Toulouse-Lautrec est déterminante, et ses oeuvres sont présentes dans plusieurs musées français.',
    imageUrl: 'https://picsum.photos/seed/princeteau/400/500',
  },
  {
    nom: 'Henri Martin',
    biographie: 'Henri Martin (1860-1943) est un peintre post-impressionniste français. Formé à l\'École des Beaux-Arts de Toulouse puis de Paris, il développe une technique pointilliste personnelle, appliquant la couleur en petites touches régulières. Ses paysages du Lot et ses compositions décoratives lui valent de nombreuses commandes publiques.',
    contexteArtistique: 'Martin représente une voie singulière du post-impressionnisme français, entre néo-impressionnisme et symbolisme. Ses grandes décorations murales ornent le Capitole de Toulouse et la Sorbonne.',
    imageUrl: 'https://picsum.photos/seed/hmartin/400/500',
  },
  {
    nom: 'Henri Lebasque',
    biographie: 'Henri Lebasque (1865-1937) est un peintre post-impressionniste français surnommé le « peintre de la joie et de la lumière ». Ami de Bonnard et Vuillard, il peint des scènes intimes, des jardins et des baigneuses baignés de lumière méditerranéenne après son installation sur la Côte d\'Azur en 1924.',
    contexteArtistique: 'Lebasque se situe à la croisée du post-impressionnisme et du fauvisme modéré. Son oeuvre célèbre la vie quotidienne et la lumière du Midi avec une palette lumineuse et une touche libre.',
    imageUrl: 'https://picsum.photos/seed/lebasque/400/500',
  },
  {
    nom: 'Louis Valtat',
    biographie: 'Louis Valtat (1869-1952) est un peintre français considéré comme un précurseur du fauvisme. Ses toiles aux couleurs vives et à la touche libre annoncent les audaces chromatiques de Matisse et Derain. Il expose au Salon des Indépendants et au Salon d\'Automne.',
    contexteArtistique: 'Valtat occupe une place singulière entre impressionnisme tardif et fauvisme. Ses paysages méditerranéens et ses natures mortes témoignent d\'une liberté chromatique en avance sur son temps.',
    imageUrl: 'https://picsum.photos/seed/valtat/400/500',
  },
  {
    nom: 'Pierre Laprade',
    biographie: 'Pierre Laprade (1875-1931) est un peintre français associé au post-impressionnisme. Ses intérieurs, natures mortes et paysages se caractérisent par une palette douce et une lumière tamisée. Proche de Bonnard et Vuillard, il expose régulièrement au Salon d\'Automne.',
    contexteArtistique: 'Laprade développe un intimisme pictural raffiné, entre tradition classique et modernité douce. Ses toiles sont présentes dans les collections du musée d\'Orsay et du musée d\'Art moderne de Paris.',
    imageUrl: 'https://picsum.photos/seed/laprade/400/500',
  },
  {
    nom: 'Jacques Despierre',
    biographie: 'Jacques Despierre (1912-1995) est un peintre et décorateur français. Formé aux Arts Décoratifs et aux Beaux-Arts de Paris, il réalise de nombreuses commandes publiques et privées. Son oeuvre se caractérise par un style figuratif moderne, entre classicisme et modernité.',
    contexteArtistique: 'Despierre fait partie des artistes que Louis Barrand connaît le mieux — la galerie prépare actuellement son catalogue raisonné. Ses peintures murales et ses compositions décoratives témoignent d\'un sens aigu de l\'espace et de la couleur.',
    imageUrl: 'https://picsum.photos/seed/despierre/400/500',
  },
  {
    nom: 'Raymond Guerrier',
    biographie: 'Raymond Guerrier (1920-2002) est un peintre français de l\'École de Paris. Son oeuvre, principalement composée de paysages et de natures mortes, se distingue par une construction rigoureuse et une palette sobre. Il expose à la galerie Drouant-David et dans de nombreuses galeries parisiennes.',
    contexteArtistique: 'Guerrier appartient à la génération des peintres de tradition française qui ont maintenu une peinture figurative exigeante face à la montée de l\'abstraction dans l\'après-guerre.',
    imageUrl: 'https://picsum.photos/seed/guerrier/400/500',
  },
  {
    nom: 'Pierre Brochet',
    biographie: 'Pierre Brochet (1922-2016) est un photographe et graveur français. Son oeuvre photographique documente la vie quotidienne, les paysages et les artistes de son temps. Ses gravures, d\'une grande finesse technique, témoignent d\'un regard poétique sur le monde.',
    contexteArtistique: 'Brochet est un artiste polyvalent dont l\'oeuvre gravé et photographique se complètent. La Galerie Louis Barrand lui a consacré une exposition monographique.',
    imageUrl: 'https://picsum.photos/seed/brochet/400/500',
  },
  {
    nom: 'Antoine de La Boulaye',
    biographie: 'Antoine de La Boulaye (né en 1951) est un peintre français contemporain spécialisé dans les sujets équestres et les scènes de chasse. Ses toiles, d\'un réalisme vivant, capturent le mouvement et l\'énergie du monde équestre avec une palette riche et une touche dynamique.',
    contexteArtistique: 'La Boulaye s\'inscrit dans la tradition de la grande peinture animalière française, de Géricault à Princeteau. Ses oeuvres sont recherchées par les collectionneurs spécialisés.',
    imageUrl: 'https://picsum.photos/seed/laboulaye/400/500',
  },
  {
    nom: 'Isabelle Hennessy',
    biographie: 'Isabelle Hennessy (née en 1958) est une artiste française contemporaine. Son travail explore les frontières entre figuration et abstraction à travers des compositions sensibles et une palette nuancée.',
    contexteArtistique: 'Hennessy fait partie des artistes contemporains représentés par la Galerie Louis Barrand, apportant un regard féminin et contemporain à la programmation de la galerie.',
    imageUrl: 'https://picsum.photos/seed/hennessy/400/500',
  },
];

interface OeuvreData {
  titre: string;
  technique: string;
  dimensions: string;
  provenance: string;
  artisteNom: string;
  thematiqueNoms: string[];
  imageUrl: string;
}

const oeuvres: OeuvreData[] = [
  // Pissarro
  {
    titre: 'Paysage à Pontoise',
    technique: 'Eau-forte et aquatinte',
    dimensions: '16 x 21 cm',
    provenance: 'Collection particulière, Paris',
    artisteNom: 'Camille Pissarro',
    thematiqueNoms: ['Paysages', 'Dessins et estampes'],
    imageUrl: 'https://picsum.photos/seed/oeuvre1/600/450',
  },
  {
    titre: 'Marché à Gisors',
    technique: 'Eau-forte',
    dimensions: '20 x 14 cm',
    provenance: 'Galerie Louis Barrand',
    artisteNom: 'Camille Pissarro',
    thematiqueNoms: ['Scènes de genre', 'Dessins et estampes'],
    imageUrl: 'https://picsum.photos/seed/oeuvre2/450/600',
  },
  // Lami
  {
    titre: 'Scène de bal aux Tuileries',
    technique: 'Aquarelle et gouache sur papier',
    dimensions: '28 x 38 cm',
    provenance: 'Collection particulière, Paris',
    artisteNom: 'Eugène Lami',
    thematiqueNoms: ['Scènes de genre'],
    imageUrl: 'https://picsum.photos/seed/oeuvre3/600/450',
  },
  // Princeteau
  {
    titre: 'Cavalier au galop',
    technique: 'Huile sur toile',
    dimensions: '65 x 81 cm',
    provenance: 'Collection particulière',
    artisteNom: 'René Princeteau',
    thematiqueNoms: ['Art animalier'],
    imageUrl: 'https://picsum.photos/seed/oeuvre4/600/480',
  },
  // Henri Martin
  {
    titre: 'Les Bords du Lot',
    technique: 'Huile sur toile',
    dimensions: '73 x 92 cm',
    provenance: 'Collection particulière, Toulouse',
    artisteNom: 'Henri Martin',
    thematiqueNoms: ['Paysages'],
    imageUrl: 'https://picsum.photos/seed/oeuvre5/600/480',
  },
  // Lebasque
  {
    titre: 'Jeune fille au jardin',
    technique: 'Huile sur toile',
    dimensions: '54 x 65 cm',
    provenance: 'Collection particulière',
    artisteNom: 'Henri Lebasque',
    thematiqueNoms: ['Portraits', 'Paysages'],
    imageUrl: 'https://picsum.photos/seed/oeuvre6/600/500',
  },
  // Valtat
  {
    titre: 'Voiliers à Arcachon',
    technique: 'Huile sur toile',
    dimensions: '60 x 73 cm',
    provenance: 'Galerie Louis Barrand',
    artisteNom: 'Louis Valtat',
    thematiqueNoms: ['Paysages'],
    imageUrl: 'https://picsum.photos/seed/oeuvre7/600/480',
  },
  // Laprade
  {
    titre: 'Nature morte aux fleurs',
    technique: 'Huile sur toile',
    dimensions: '46 x 55 cm',
    provenance: 'Collection particulière, Paris',
    artisteNom: 'Pierre Laprade',
    thematiqueNoms: ['Natures mortes'],
    imageUrl: 'https://picsum.photos/seed/oeuvre8/600/500',
  },
  // Despierre
  {
    titre: 'Composition murale — étude',
    technique: 'Huile sur toile',
    dimensions: '100 x 81 cm',
    provenance: 'Atelier de l\'artiste',
    artisteNom: 'Jacques Despierre',
    thematiqueNoms: ['Scènes de genre'],
    imageUrl: 'https://picsum.photos/seed/oeuvre9/600/750',
  },
  {
    titre: 'Nu debout',
    technique: 'Sanguine sur papier',
    dimensions: '63 x 48 cm',
    provenance: 'Atelier de l\'artiste',
    artisteNom: 'Jacques Despierre',
    thematiqueNoms: ['Dessins et estampes', 'Portraits'],
    imageUrl: 'https://picsum.photos/seed/oeuvre10/450/600',
  },
  // Guerrier
  {
    titre: 'Paysage de Bourgogne',
    technique: 'Huile sur toile',
    dimensions: '54 x 73 cm',
    provenance: 'Collection particulière',
    artisteNom: 'Raymond Guerrier',
    thematiqueNoms: ['Paysages'],
    imageUrl: 'https://picsum.photos/seed/oeuvre11/600/450',
  },
  // Brochet
  {
    titre: 'Gravure — Le port',
    technique: 'Eau-forte, tirage 12/50',
    dimensions: '30 x 40 cm',
    provenance: 'Atelier de l\'artiste',
    artisteNom: 'Pierre Brochet',
    thematiqueNoms: ['Dessins et estampes', 'Paysages'],
    imageUrl: 'https://picsum.photos/seed/oeuvre12/600/450',
  },
  // La Boulaye
  {
    titre: 'Chevaux en liberté',
    technique: 'Huile sur toile',
    dimensions: '81 x 100 cm',
    provenance: 'Galerie Louis Barrand',
    artisteNom: 'Antoine de La Boulaye',
    thematiqueNoms: ['Art animalier'],
    imageUrl: 'https://picsum.photos/seed/oeuvre13/600/480',
  },
  {
    titre: 'Le départ de la chasse',
    technique: 'Huile sur toile',
    dimensions: '73 x 92 cm',
    provenance: 'Collection particulière',
    artisteNom: 'Antoine de La Boulaye',
    thematiqueNoms: ['Art animalier', 'Scènes de genre'],
    imageUrl: 'https://picsum.photos/seed/oeuvre14/600/480',
  },
];

const expositions = [
  {
    titre: 'PIERRE BROCHET — Photographe et graveur',
    dateDebut: '2022-11-17',
    dateFin: '2022-11-27',
    preface: 'La Galerie Louis Barrand consacre une exposition à Pierre Brochet (1922-2016), photographe et graveur. Ses eaux-fortes et ses photographies dialoguent dans un parcours intime qui révèle un artiste attentif aux lumières du quotidien et aux paysages de son temps.',
    statut: 'passee' as const,
    oeuvresTitres: ['Gravure — Le port'],
  },
  {
    titre: 'BESTIAIRE — Art animalier, Chasse, Chevaux',
    dateDebut: '2023-03-23',
    dateFin: '2023-04-07',
    preface: 'De Princeteau à La Boulaye, cette exposition explore la tradition de l\'art animalier français à travers des oeuvres représentant le monde du cheval, de la chasse et de la nature sauvage. Un parcours entre XIXe et XXIe siècle qui témoigne de la vitalité de ce genre.',
    statut: 'passee' as const,
    oeuvresTitres: ['Cavalier au galop', 'Chevaux en liberté', 'Le départ de la chasse'],
  },
  {
    titre: 'RENÉ GRUAU — Dessinateur',
    dateDebut: '2023-10-11',
    dateFin: '2023-11-03',
    preface: 'La galerie présente un ensemble de dessins et illustrations de René Gruau (1909-2004), maître du dessin de mode. Ses lignes élégantes et ses aplats de couleur ont marqué l\'histoire de l\'illustration au XXe siècle, de Dior à Fath.',
    statut: 'passee' as const,
    oeuvresTitres: [],
  },
  {
    titre: 'Nature morte — France XXe',
    dateDebut: '2024-03-13',
    dateFin: '2024-03-29',
    preface: 'Un parcours à travers la nature morte française du XXe siècle. De Laprade à Guerrier, les artistes réunis ici témoignent de la richesse et de la diversité d\'un genre qui n\'a cessé de se réinventer au fil du siècle.',
    statut: 'passee' as const,
    oeuvresTitres: ['Nature morte aux fleurs'],
  },
  {
    titre: 'Antoine de La Boulaye — Chevaux & Cavaliers',
    dateDebut: '2024-10-09',
    dateFin: '2024-10-25',
    preface: 'Antoine de La Boulaye (né en 1951) peint le monde équestre avec une énergie et une justesse rares. Ses toiles capturent le mouvement, la puissance et l\'élégance du cheval dans des compositions dynamiques aux couleurs vibrantes.',
    statut: 'passee' as const,
    oeuvresTitres: ['Chevaux en liberté', 'Le départ de la chasse'],
  },
  {
    titre: 'Camille Pissarro — Dessinateur et Graveur',
    dateDebut: '2025-03-18',
    dateFin: '2025-04-11',
    preface: 'La Galerie Louis Barrand présente un ensemble rare d\'eaux-fortes et de dessins de Camille Pissarro (1830-1903). Moins connue que sa peinture, l\'oeuvre gravé de Pissarro révèle un artiste expérimentateur, attentif aux effets de lumière et aux scènes de la vie rurale.',
    statut: 'passee' as const,
    oeuvresTitres: ['Paysage à Pontoise', 'Marché à Gisors'],
  },
  {
    titre: 'Despierre (1912-1995)',
    dateDebut: '2025-10-15',
    dateFin: '2025-11-07',
    preface: 'La galerie consacre une rétrospective à Jacques Despierre (1912-1995), peintre et décorateur dont Louis Barrand prépare le catalogue raisonné. Peintures murales, études et compositions témoignent d\'un artiste entre classicisme et modernité.',
    statut: 'passee' as const,
    oeuvresTitres: ['Composition murale — étude', 'Nu debout'],
  },
  {
    titre: 'Foire de Chatou',
    dateDebut: '2026-03-13',
    dateFin: '2026-03-22',
    preface: 'La Galerie Louis Barrand participe à la Foire de Chatou, rendez-vous incontournable des amateurs d\'art et d\'antiquités. Une sélection d\'oeuvres de la galerie est présentée sur le stand.',
    statut: 'en-cours' as const,
    oeuvresTitres: [],
  },
  {
    titre: 'Encre — Dessins français XIXe-XXe',
    dateDebut: '2026-03-26',
    dateFin: '2026-04-17',
    preface: 'Un parcours à travers le dessin français des XIXe et XXe siècles. Encres, lavis, sanguines et mines de plomb : cette exposition explore la richesse du dessin comme discipline autonome et comme espace de liberté pour les artistes.',
    statut: 'en-cours' as const,
    oeuvresTitres: ['Nu debout'],
  },
];

const articlesPresse = [
  {
    titre: 'Connaissance des Arts — Galerie Louis Barrand',
    type: 'lien' as const,
    urlExterne: 'https://www.connaissancedesarts.com',
  },
  {
    titre: 'La Gazette Drouot — Foire de Chatou 2026',
    type: 'lien' as const,
    urlExterne: 'https://www.gazette-drouot.com',
  },
];

const aPropos = {
  biographieLouis:
    'Louis Barrand est spécialisé en tableaux, dessins et estampes du XIXe à l\'après-guerre. Il prépare le catalogue raisonné de Jacques Despierre (1912-1995) et poursuit le travail de Caroline Imbert sur celui d\'Eugène Lami (1800-1890).\n\nFort d\'une riche expérience au sein du marché de l\'art à Paris et à Londres, Louis Barrand a ouvert sa galerie à 27 ans au coeur du huitième arrondissement, en face du Palais de la Découverte. Il a reçu le Prix Marcus au Ministère de la Culture en 2025, récompensant son engagement pour la valorisation du patrimoine artistique français.\n\nIl réalise des expositions et conseille amateurs et collectionneurs dans leur processus d\'acquisition et de vente d\'oeuvres d\'art.',
  textePrixMarcus:
    'Le Prix Marcus au Ministère de la Culture récompense l\'engagement d\'un galeriste pour la valorisation du patrimoine artistique français. Louis Barrand l\'a reçu en 2025.',
  adresse: '7, avenue Franklin Roosevelt\nParis VIIIe\nFrance',
  horaires: 'Sur rendez-vous',
};

// ---------------------------------------------------------------------------
// Seed logic
// ---------------------------------------------------------------------------

async function seedThematiques(): Promise<Map<string, number>> {
  console.log('\n--- Thematiques ---');
  const existing = await strapiGet('thematiques?pagination[pageSize]=100&status=draft');
  const map = new Map<string, number>();

  for (const t of existing.data ?? []) {
    map.set(t.nom, t.documentId);
  }

  for (const t of thematiques) {
    if (map.has(t.nom)) {
      console.log(`  [skip] ${t.nom}`);
      continue;
    }
    const res = await strapiPost('thematiques', t);
    map.set(t.nom, res.data.documentId);
    console.log(`  [created] ${t.nom}`);
  }
  return map;
}

async function seedArtistes(): Promise<Map<string, string>> {
  console.log('\n--- Artistes ---');
  const existing = await strapiGet('artistes?pagination[pageSize]=100&status=draft');
  const map = new Map<string, string>();

  for (const a of existing.data ?? []) {
    map.set(a.nom, a.documentId);
  }

  for (const a of artistes) {
    if (map.has(a.nom)) {
      console.log(`  [skip] ${a.nom}`);
      continue;
    }
    const data: Record<string, unknown> = {
      nom: a.nom,
      biographie: a.biographie,
      contexteArtistique: a.contexteArtistique,
    };

    const photoId = await uploadImageFromUrl(a.imageUrl, `artiste-${a.nom.toLowerCase().replace(/\s+/g, '-')}.jpg`);
    if (photoId) {
      data.photo = photoId;
    }

    const res = await strapiPost('artistes', data);
    map.set(a.nom, res.data.documentId);
    console.log(`  [created] ${a.nom}`);
  }
  return map;
}

async function seedOeuvres(
  artisteMap: Map<string, string>,
  thematiqueMap: Map<string, number>,
): Promise<Map<string, string>> {
  console.log('\n--- Oeuvres ---');
  const existing = await strapiGet('oeuvres?pagination[pageSize]=100&status=draft');
  const map = new Map<string, string>();

  for (const o of existing.data ?? []) {
    map.set(o.titre, o.documentId);
  }

  for (const o of oeuvres) {
    if (map.has(o.titre)) {
      console.log(`  [skip] ${o.titre}`);
      continue;
    }

    const data: Record<string, unknown> = {
      titre: o.titre,
      technique: o.technique,
      dimensions: o.dimensions,
      provenance: o.provenance,
    };

    const artisteDocId = artisteMap.get(o.artisteNom);
    if (artisteDocId) {
      data.artiste = { connect: [{ documentId: artisteDocId }] };
    }

    const themaIds = o.thematiqueNoms
      .map((nom) => thematiqueMap.get(nom))
      .filter(Boolean);
    if (themaIds.length) {
      data.thematiques = { connect: themaIds.map((id) => ({ documentId: id })) };
    }

    const imageId = await uploadImageFromUrl(o.imageUrl, `oeuvre-${o.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`);
    if (imageId) {
      data.visuels = [imageId];
    }

    const res = await strapiPost('oeuvres', data);
    map.set(o.titre, res.data.documentId);
    console.log(`  [created] ${o.titre}`);
  }
  return map;
}

async function seedExpositions(oeuvreMap: Map<string, string>) {
  console.log('\n--- Expositions ---');
  const existing = await strapiGet('expositions?pagination[pageSize]=100&status=draft');
  const existingTitres = new Set((existing.data ?? []).map((e: { titre: string }) => e.titre));

  for (const expo of expositions) {
    if (existingTitres.has(expo.titre)) {
      console.log(`  [skip] ${expo.titre}`);
      continue;
    }

    const oeuvreDocIds = expo.oeuvresTitres
      .map((t) => oeuvreMap.get(t))
      .filter(Boolean) as string[];

    const data: Record<string, unknown> = {
      titre: expo.titre,
      dateDebut: expo.dateDebut,
      dateFin: expo.dateFin,
      preface: expo.preface,
      statut: expo.statut,
    };

    if (oeuvreDocIds.length) {
      data.oeuvres = { connect: oeuvreDocIds.map((id) => ({ documentId: id })) };
    }

    await strapiPost('expositions', data);
    console.log(`  [created] ${expo.titre}`);
  }
}

async function seedArticlesPresse() {
  console.log('\n--- Articles Presse ---');
  const existing = await strapiGet('articles-presse?pagination[pageSize]=100&status=draft');
  const existingTitres = new Set((existing.data ?? []).map((a: { titre: string }) => a.titre));

  for (const article of articlesPresse) {
    if (existingTitres.has(article.titre)) {
      console.log(`  [skip] ${article.titre}`);
      continue;
    }
    await strapiPost('articles-presse', article);
    console.log(`  [created] ${article.titre}`);
  }
}

async function seedAPropos() {
  console.log('\n--- A Propos ---');
  try {
    const existing = await strapiGet('a-propos?status=draft');
    if (existing.data?.biographieLouis) {
      console.log('  [skip] Deja rempli');
      return;
    }
  } catch {
    // 404 = single type pas encore cree, on continue
  }

  await strapiPut('a-propos', aPropos);
  console.log('  [updated] Page A propos');
}

async function strapiPublish(endpoint: string, documentId: string) {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}/${documentId}/actions/publish`, {
    method: 'POST',
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PUBLISH ${endpoint}/${documentId}: ${res.status} ${text}`);
  }
}

async function publishAll() {
  console.log('\n--- Publication ---');

  const endpoints = ['thematiques', 'artistes', 'oeuvres', 'expositions', 'articles-presse'];

  for (const endpoint of endpoints) {
    const res = await strapiGet(`${endpoint}?pagination[pageSize]=100`);
    const items = res.data ?? [];
    let published = 0;

    for (const item of items) {
      if (item.publishedAt) continue;
      try {
        await strapiPublish(endpoint, item.documentId);
        published++;
      } catch {
        // Already published or other issue — skip
      }
    }
    console.log(`  [published] ${endpoint}: ${published}/${items.length} items`);
  }

  // Publish single type a-propos
  try {
    const aProposData = await strapiGet('a-propos');
    if (aProposData.data?.documentId && !aProposData.data?.publishedAt) {
      await strapiPublish('a-propos', aProposData.data.documentId);
      console.log('  [published] a-propos');
    } else {
      console.log('  [skip] a-propos (deja publie)');
    }
  } catch {
    // skip
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Seed Galerie Louis Barrand — ${STRAPI_URL}`);

  const thematiqueMap = await seedThematiques();
  const artisteMap = await seedArtistes();
  const oeuvreMap = await seedOeuvres(artisteMap, thematiqueMap);
  await seedExpositions(oeuvreMap);
  await seedArticlesPresse();
  await seedAPropos();
  await publishAll();

  console.log('\nSeed termine !');
}

main().catch((err) => {
  console.error('Seed echoue:', err);
  process.exit(1);
});
