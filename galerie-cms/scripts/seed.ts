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

async function uploadImageFromUrl(imageUrl: string, fileName: string): Promise<number | null> {
  try {
    const res = await fetch(imageUrl);
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
  { nom: 'Abstraction' },
  { nom: 'Scènes de genre' },
];

const artistes = [
  {
    nom: 'Henri Despierre',
    biographie:
      'Henri Despierre (1920-1998) est un peintre français né à Aix-en-Provence. Formé aux Beaux-Arts de Marseille, il développe une peinture figurative lumineuse, marquée par les paysages de Provence. Son travail sur la couleur et la lumière méditerranéenne le rapproche des post-impressionnistes.',
    contexteArtistique:
      'Despierre appartient à la génération de peintres provençaux de l\'après-guerre qui ont su renouveler la tradition paysagiste sans jamais l\'abandonner. Ses toiles témoignent d\'une attention constante à la géologie, à la végétation et à la lumière changeante du Midi.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/440px-Van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg',
  },
  {
    nom: 'Madeleine Roux-Abrial',
    biographie:
      'Madeleine Roux-Abrial (1935-2015) est une peintre et graveuse française. Élève de Jean Souverbie à l\'École des Beaux-Arts de Paris, elle développe un langage plastique où la figure humaine se mêle à l\'abstraction lyrique. Ses portraits et natures mortes se distinguent par des harmonies chromatiques sourdes et une composition rigoureuse.',
    contexteArtistique:
      'Roux-Abrial s\'inscrit dans la lignée de la Nouvelle École de Paris. Ses gravures sur cuivre, exposées au Salon de Mai et à la Biennale de Ljubljana, lui valent une reconnaissance internationale.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Berthe_Morisot_-_Autoportrait_de_1885_%28Mus%C3%A9e_Marmottan_Monet%29.jpg/440px-Berthe_Morisot_-_Autoportrait_de_1885_%28Mus%C3%A9e_Marmottan_Monet%29.jpg',
  },
  {
    nom: 'Pierre-Louis Moretti',
    biographie:
      'Pierre-Louis Moretti (1948-) est un peintre et sculpteur d\'origine corse installé en Provence depuis 1975. Son oeuvre explore les paysages intérieurs et les architectures méditerranéennes à travers une palette terreuse et des empâtements généreux. Il a exposé dans de nombreuses galeries du sud de la France.',
    contexteArtistique:
      'Moretti poursuit une recherche picturale centrée sur la matière et la texture. Ses toiles, souvent de grand format, oscillent entre figuration et abstraction, révélant des paysages mentaux nourris de géographie réelle.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Monet_-_Selbstportr%C3%A4t_mit_Barett.jpg/440px-Monet_-_Selbstportr%C3%A4t_mit_Barett.jpg',
  },
  {
    nom: 'Colette Verdier',
    biographie:
      'Colette Verdier (1942-2020) est une peintre abstraite française. Formée à l\'atelier de Roger Chastel, elle privilégie les grands formats et les compositions où la couleur structure l\'espace. Ses séries chromatiques, déclinées sur plusieurs années, sont des méditations sur la lumière et le temps.',
    contexteArtistique:
      'Le travail de Verdier se situe à la croisée de l\'abstraction lyrique et de l\'art minimal. Ses toiles, présentes dans plusieurs collections publiques (FRAC PACA, musée Cantini), témoignent d\'une exigence formelle constante.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/440px-Ada_Lovelace_portrait.jpg',
  },
  {
    nom: 'Jean-Marc Castellani',
    biographie:
      'Jean-Marc Castellani (1960-) est un peintre figuratif contemporain. Autodidacte, il peint principalement des scènes de la vie quotidienne en Provence : marchés, cafés, ruelles d\'Aix. Son trait précis et ses couleurs vives lui ont valu le prix de la Fondation Taylor en 2005.',
    contexteArtistique:
      'Castellani revendique l\'héritage des peintres de la réalité quotidienne, de Bonnard à Balthus. Ses toiles capturent des instants de vie avec une justesse qui dépasse la simple description.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Paul_C%C3%A9zanne%2C_Autoportrait.jpg/440px-Paul_C%C3%A9zanne%2C_Autoportrait.jpg',
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
  // Despierre
  {
    titre: 'La Montagne Sainte-Victoire au couchant',
    technique: 'Huile sur toile',
    dimensions: '81 x 100 cm',
    provenance: 'Atelier de l\'artiste, Aix-en-Provence',
    artisteNom: 'Henri Despierre',
    thematiqueNoms: ['Paysages'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Paul_C%C3%A9zanne_108.jpg/600px-Paul_C%C3%A9zanne_108.jpg',
  },
  {
    titre: 'Calanques de Cassis',
    technique: 'Huile sur toile',
    dimensions: '65 x 92 cm',
    provenance: 'Collection particulière, Marseille',
    artisteNom: 'Henri Despierre',
    thematiqueNoms: ['Paysages'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Claude_Monet_-_Water_Lilies_-_1906%2C_Chicago.jpg/600px-Claude_Monet_-_Water_Lilies_-_1906%2C_Chicago.jpg',
  },
  {
    titre: 'Les Oliviers de Maussane',
    technique: 'Aquarelle sur papier',
    dimensions: '50 x 65 cm',
    provenance: 'Atelier de l\'artiste',
    artisteNom: 'Henri Despierre',
    thematiqueNoms: ['Paysages'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Van_Gogh_-_Olive_Trees_with_the_Alpilles_in_the_Background.jpg/600px-Van_Gogh_-_Olive_Trees_with_the_Alpilles_in_the_Background.jpg',
  },
  // Roux-Abrial
  {
    titre: 'Portrait au fauteuil rouge',
    technique: 'Huile sur toile',
    dimensions: '100 x 81 cm',
    provenance: 'Galerie Maeght, Paris',
    artisteNom: 'Madeleine Roux-Abrial',
    thematiqueNoms: ['Portraits'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/460px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
  },
  {
    titre: 'Nature morte aux figues',
    technique: 'Huile sur panneau',
    dimensions: '46 x 55 cm',
    provenance: 'Collection de l\'artiste',
    artisteNom: 'Madeleine Roux-Abrial',
    thematiqueNoms: ['Natures mortes'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Cezanne_-_Stilleben_mit_%C3%84pfeln_und_Pfirsichen.jpg/600px-Cezanne_-_Stilleben_mit_%C3%84pfeln_und_Pfirsichen.jpg',
  },
  {
    titre: 'Gravure III — Profil perdu',
    technique: 'Gravure sur cuivre, tirage 4/30',
    dimensions: '38 x 28 cm',
    provenance: 'Atelier de l\'artiste, Paris',
    artisteNom: 'Madeleine Roux-Abrial',
    thematiqueNoms: ['Portraits'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Eyck_madonna_rolin.jpg/537px-Eyck_madonna_rolin.jpg',
  },
  // Moretti
  {
    titre: 'Bastia, le vieux port',
    technique: 'Huile sur toile',
    dimensions: '120 x 80 cm',
    provenance: 'Collection particulière, Ajaccio',
    artisteNom: 'Pierre-Louis Moretti',
    thematiqueNoms: ['Paysages', 'Scènes de genre'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Claude_Monet_-_Impression%2C_soleil_levant.jpg/600px-Claude_Monet_-_Impression%2C_soleil_levant.jpg',
  },
  {
    titre: 'Terre rouge, ciel blanc',
    technique: 'Technique mixte sur toile',
    dimensions: '150 x 120 cm',
    provenance: 'Atelier de l\'artiste, Aix-en-Provence',
    artisteNom: 'Pierre-Louis Moretti',
    thematiqueNoms: ['Abstraction', 'Paysages'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Vassily_Kandinsky%2C_1913_-_Composition_7.jpg/600px-Vassily_Kandinsky%2C_1913_-_Composition_7.jpg',
  },
  // Verdier
  {
    titre: 'Bleu Méditerranée n°12',
    technique: 'Acrylique sur toile',
    dimensions: '200 x 160 cm',
    provenance: 'FRAC Provence-Alpes-Côte d\'Azur',
    artisteNom: 'Colette Verdier',
    thematiqueNoms: ['Abstraction'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Yves_Klein_-_IKB_191.jpg/450px-Yves_Klein_-_IKB_191.jpg',
  },
  {
    titre: 'Variations ocres — série IV',
    technique: 'Acrylique sur toile',
    dimensions: '130 x 97 cm',
    provenance: 'Musée Cantini, Marseille',
    artisteNom: 'Colette Verdier',
    thematiqueNoms: ['Abstraction'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/VanGogh-starry_night_ballance1.jpg/600px-VanGogh-starry_night_ballance1.jpg',
  },
  {
    titre: 'Lumière d\'hiver',
    technique: 'Acrylique et pigments sur toile',
    dimensions: '100 x 100 cm',
    provenance: 'Collection de l\'artiste',
    artisteNom: 'Colette Verdier',
    thematiqueNoms: ['Abstraction'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/The_Scream.jpg/440px-The_Scream.jpg',
  },
  // Castellani
  {
    titre: 'Le marché du cours Mirabeau',
    technique: 'Huile sur toile',
    dimensions: '73 x 92 cm',
    provenance: 'Collection de l\'artiste',
    artisteNom: 'Jean-Marc Castellani',
    thematiqueNoms: ['Scènes de genre'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edouard_Manet_-_Luncheon_on_the_Grass_-_Google_Art_Project.jpg/600px-Edouard_Manet_-_Luncheon_on_the_Grass_-_Google_Art_Project.jpg',
  },
  {
    titre: 'Terrasse de café, place de l\'Hôtel de Ville',
    technique: 'Huile sur toile',
    dimensions: '60 x 73 cm',
    provenance: 'Galerie Louis Barrand',
    artisteNom: 'Jean-Marc Castellani',
    thematiqueNoms: ['Scènes de genre'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpg/440px-Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpg',
  },
  {
    titre: 'Autoportrait à la fenêtre',
    technique: 'Huile sur panneau',
    dimensions: '55 x 46 cm',
    provenance: 'Collection de l\'artiste',
    artisteNom: 'Jean-Marc Castellani',
    thematiqueNoms: ['Portraits'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Pierre-Auguste_Renoir_-_By_the_Water.jpg/440px-Pierre-Auguste_Renoir_-_By_the_Water.jpg',
  },
];

const expositions = [
  {
    titre: 'Lumières de Provence — Henri Despierre',
    dateDebut: '2026-03-15',
    dateFin: '2026-05-30',
    preface:
      'La Galerie Louis Barrand consacre une rétrospective à Henri Despierre, figure majeure du paysagisme provençal. Vingt toiles et aquarelles retracent cinquante ans d\'une pratique picturale enracinée dans les paysages du Midi. Des premiers essais figuratifs aux compositions plus libres de la maturité, l\'exposition révèle un artiste en dialogue constant avec la lumière méditerranéenne.',
    statut: 'en-cours' as const,
    oeuvresTitres: [
      'La Montagne Sainte-Victoire au couchant',
      'Calanques de Cassis',
      'Les Oliviers de Maussane',
    ],
  },
  {
    titre: 'Figures et silences — Madeleine Roux-Abrial',
    dateDebut: '2025-10-01',
    dateFin: '2025-12-20',
    preface:
      'Cette exposition rend hommage à Madeleine Roux-Abrial, peintre et graveuse disparue en 2015. Portraits, natures mortes et gravures sur cuivre se répondent dans un parcours intime. L\'accrochage met en lumière la rigueur compositionnelle et la palette subtile d\'une artiste restée trop méconnue.',
    statut: 'passee' as const,
    oeuvresTitres: [
      'Portrait au fauteuil rouge',
      'Nature morte aux figues',
      'Gravure III — Profil perdu',
    ],
  },
  {
    titre: 'Matières premières — Moretti et Verdier',
    dateDebut: '2026-06-15',
    dateFin: '2026-09-15',
    preface:
      'La galerie réunit deux artistes que tout semble opposer — la figuration terreuse de Pierre-Louis Moretti et l\'abstraction chromatique de Colette Verdier — pour un dialogue autour de la matière picturale. Empâtements, glacis, pigments purs : l\'exposition invite à regarder la peinture comme surface autant que comme image.',
    statut: 'en-cours' as const,
    oeuvresTitres: [
      'Terre rouge, ciel blanc',
      'Bleu Méditerranée n°12',
      'Variations ocres — série IV',
      'Lumière d\'hiver',
    ],
  },
];

const articlesPresse = [
  {
    titre: 'La Provence — Henri Despierre, peintre de lumière',
    type: 'lien' as const,
    urlExterne: 'https://www.laprovence.com/article/exemple-despierre',
  },
  {
    titre: 'Connaissance des Arts — Galerie Louis Barrand, un regard sur la modernité',
    type: 'lien' as const,
    urlExterne: 'https://www.connaissancedesarts.com/article/exemple-barrand',
  },
  {
    titre: 'Art Absolument — Moretti et Verdier, le dialogue des matières',
    type: 'lien' as const,
    urlExterne: 'https://www.artabsolument.com/article/exemple-moretti-verdier',
  },
];

const aPropos = {
  biographieLouis:
    'Louis Barrand est galeriste à Aix-en-Provence depuis 1992. Formé en histoire de l\'art à l\'Université d\'Aix-Marseille, il ouvre sa galerie rue Espariat avec la conviction que l\'art moderne et contemporain peut dialoguer avec un public large. En trente ans, il a accompagné plus de cinquante artistes, organisé plus de cent expositions et constitué un fonds de référence pour la peinture provençale du XXe siècle. Lauréat du prix Marcus de l\'artisan-galeriste en 2018, il poursuit un travail de passeur entre les artistes et les collectionneurs.',
  textePrixMarcus:
    'Le prix Marcus de l\'artisan-galeriste récompense chaque année un galeriste français pour son engagement en faveur de la diffusion de l\'art contemporain hors des grands centres. Louis Barrand l\'a reçu en 2018 pour son travail de découverte et de fidélité envers les artistes qu\'il représente.',
  adresse: '12, rue Espariat\n13100 Aix-en-Provence\nFrance',
  horaires: 'Du mardi au samedi\n10h00 — 12h30\n14h30 — 19h00\nFermé dimanche et lundi',
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
  const existing = await strapiGet('a-propos-items?status=draft');

  if (existing.data?.biographieLouis) {
    console.log('  [skip] Deja rempli');
    return;
  }

  await strapiPut('a-propos-items', aPropos);
  console.log('  [updated] Page A propos');
}

async function publishAll() {
  console.log('\n--- Publication ---');

  const endpoints = ['thematiques', 'artistes', 'oeuvres', 'expositions', 'articles-presse'];

  for (const endpoint of endpoints) {
    const res = await strapiGet(`${endpoint}?status=draft&pagination[pageSize]=100`);
    const items = res.data ?? [];
    let published = 0;

    for (const item of items) {
      try {
        await strapiPut(`${endpoint}/${item.documentId}`, {
          ...item,
          publishedAt: new Date().toISOString(),
        } as Record<string, unknown>);
        published++;
      } catch {
        // Already published or other issue — skip
      }
    }
    console.log(`  [published] ${endpoint}: ${published} items`);
  }

  // Publish single type a-propos
  try {
    const aProposData = await strapiGet('a-propos-items?status=draft');
    if (aProposData.data) {
      await strapiPut('a-propos-items', {
        ...aProposData.data,
        publishedAt: new Date().toISOString(),
      } as Record<string, unknown>);
      console.log('  [published] a-propos');
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
