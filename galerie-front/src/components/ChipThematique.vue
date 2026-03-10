<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface StrapiMedia {
  url: string;
  width: number;
  height: number;
}

interface Artiste {
  nom: string;
  slug: string;
}

interface Thematique {
  nom: string;
  slug: string;
}

interface Oeuvre {
  titre: string;
  slug: string;
  visuels: StrapiMedia[];
  artiste: Artiste | null;
  thematiques: Thematique[];
}

const props = defineProps<{
  thematiques: Thematique[];
  oeuvres: Oeuvre[];
  basePath?: string;
}>();

const base = (props.basePath ?? '').replace(/\/$/, '');

const activeSlug = ref<string | null>(null);

const filteredOeuvres = computed(() => {
  if (!activeSlug.value) return props.oeuvres;
  return props.oeuvres.filter((o) =>
    o.thematiques.some((t) => t.slug === activeSlug.value),
  );
});

function toggleThematique(slug: string) {
  const newSlug = activeSlug.value === slug ? null : slug;
  activeSlug.value = newSlug;
  updateUrl(newSlug);
}

function updateUrl(slug: string | null) {
  const url = slug
    ? `${window.location.pathname}?thematique=${encodeURIComponent(slug)}`
    : window.location.pathname;
  history.pushState(null, '', url);
}

function handleKeydown(event: KeyboardEvent, slug: string) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleThematique(slug);
  }
}

// --- URL sync (Task 3) ---
function onPopstate() {
  const params = new URLSearchParams(window.location.search);
  activeSlug.value = params.get('thematique') ?? null;
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const thematique = params.get('thematique');
  if (thematique && props.thematiques.some((t) => t.slug === thematique)) {
    activeSlug.value = thematique;
  }

  window.addEventListener('popstate', onPopstate);
});

onUnmounted(() => {
  window.removeEventListener('popstate', onPopstate);
});

function getAltText(oeuvre: Oeuvre): string {
  const artisteNom = oeuvre.artiste?.nom ?? '';
  return artisteNom ? `${oeuvre.titre}, ${artisteNom}` : oeuvre.titre;
}
</script>

<template>
  <div class="filtre-oeuvres">
    <div class="chips" role="group" aria-label="Filtrer par thématique">
      <span
        v-for="thematique in props.thematiques"
        :key="thematique.slug"
        role="button"
        tabindex="0"
        :aria-pressed="activeSlug === thematique.slug"
        :class="['chip', { active: activeSlug === thematique.slug }]"
        @click="toggleThematique(thematique.slug)"
        @keydown="handleKeydown($event, thematique.slug)"
      >
        {{ thematique.nom }}
      </span>
    </div>

    <p v-if="filteredOeuvres.length === 0" class="empty">
      Aucune oeuvre dans cette thématique pour le moment.
    </p>

    <ul v-else class="galerie-images">
      <li
        v-for="(oeuvre, index) in filteredOeuvres"
        :key="oeuvre.slug"
        :class="{ 'span-2': (index + 1) % 5 === 0 }"
      >
        <a :href="`${base}/oeuvres/${oeuvre.slug}`" class="carte-oeuvre">
          <div class="carte-oeuvre-image">
            <img
              v-if="oeuvre.visuels.length > 0"
              :src="oeuvre.visuels[0].url"
              :alt="getAltText(oeuvre)"
              :width="oeuvre.visuels[0].width"
              :height="oeuvre.visuels[0].height"
              loading="lazy"
            />
            <div v-else class="carte-oeuvre-placeholder" aria-hidden="true">
              <span>{{ oeuvre.titre.charAt(0) }}</span>
            </div>
            <div class="carte-oeuvre-overlay">
              <span class="carte-oeuvre-titre">{{ oeuvre.titre }}</span>
              <span v-if="oeuvre.artiste" class="carte-oeuvre-artiste">
                {{ oeuvre.artiste.nom }}
              </span>
            </div>
          </div>
          <div class="carte-oeuvre-info-mobile">
            <span class="carte-oeuvre-titre">{{ oeuvre.titre }}</span>
            <span v-if="oeuvre.artiste" class="carte-oeuvre-artiste">
              {{ oeuvre.artiste.nom }}
            </span>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* --- Chips --- */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.chip {
  display: inline-block;
  padding: 6px 16px;
  border: 1px solid var(--color-border);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-default);
  user-select: none;
}

.chip:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.chip.active {
  background: var(--color-text);
  color: var(--color-bg);
  border-color: var(--color-text);
}

.chip:focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 2px;
}

/* --- Empty state --- */
.empty {
  color: var(--color-text-secondary);
  padding: var(--space-2xl) 0;
}

/* --- Grille oeuvres (réplique GalerieImages) --- */
.galerie-images {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

@media (min-width: 640px) {
  .galerie-images {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .galerie-images {
    grid-template-columns: repeat(3, 1fr);
  }

  .galerie-images .span-2 {
    grid-column: span 2;
  }
}

@media (min-width: 1280px) {
  .galerie-images {
    grid-template-columns: repeat(4, 1fr);
  }

  .galerie-images .span-2 {
    grid-column: span 1;
  }
}

/* --- Carte oeuvre (réplique CarteOeuvre.astro) --- */
.carte-oeuvre {
  display: block;
  text-decoration: none;
  overflow: hidden;
}

.carte-oeuvre:focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 2px;
}

.carte-oeuvre-image {
  position: relative;
  overflow: hidden;
  background: var(--color-border);
}

.carte-oeuvre-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform var(--transition-default);
}

.carte-oeuvre:hover .carte-oeuvre-image img {
  transform: scale(1.03);
}

.carte-oeuvre-placeholder {
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-border);
  color: var(--color-text-tertiary);
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 700;
}

.carte-oeuvre-overlay {
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-md);
  background: linear-gradient(transparent 40%, rgba(0, 0, 0, 0.6));
  opacity: 0;
  transition: opacity var(--transition-default);
  color: var(--color-bg);
}

@media (min-width: 768px) {
  .carte-oeuvre-overlay {
    display: flex;
  }
}

.carte-oeuvre:hover .carte-oeuvre-overlay {
  opacity: 1;
}

.carte-oeuvre-overlay .carte-oeuvre-titre {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
}

.carte-oeuvre-overlay .carte-oeuvre-artiste {
  font-size: 0.875rem;
  opacity: 0.85;
}

.carte-oeuvre-info-mobile {
  display: flex;
  flex-direction: column;
  padding: var(--space-sm) 0;
}

@media (min-width: 768px) {
  .carte-oeuvre-info-mobile {
    display: none;
  }
}

.carte-oeuvre-info-mobile .carte-oeuvre-titre {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.carte-oeuvre-info-mobile .carte-oeuvre-artiste {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
</style>
