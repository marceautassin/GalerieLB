<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { etatCartes, parseThematiques, thematiqueValide } from '../lib/filtre-thematique';

interface Thematique {
  nom: string;
  slug: string;
}

/**
 * Filtre par thématique du catalogue. La grille est rendue en Astro (images optimisées) :
 * l'îlot ne reçoit que les thématiques et agit sur les cartes `li[data-thematiques]`
 * de `#grille-oeuvres`.
 */
const props = defineProps<{
  thematiques: Thematique[];
}>();

const activeSlug = ref<string | null>(null);
const vide = ref(false);

function appliquerFiltre() {
  const grille = document.getElementById('grille-oeuvres');
  if (!grille) return;
  const cartes = Array.from(grille.querySelectorAll<HTMLElement>('li[data-thematiques]'));
  const etats = etatCartes(
    cartes.map((li) => parseThematiques(li.dataset.thematiques)),
    activeSlug.value,
  );
  cartes.forEach((li, i) => {
    li.hidden = !etats[i].visible;
    li.classList.toggle('span-2', etats[i].span2);
  });
  vide.value = !etats.some((e) => e.visible);
}

watch(activeSlug, appliquerFiltre);

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

// --- URL sync ---
function slugDepuisUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return thematiqueValide(params.get('thematique'), props.thematiques);
}

function onPopstate() {
  activeSlug.value = slugDepuisUrl();
}

onMounted(() => {
  activeSlug.value = slugDepuisUrl();
  appliquerFiltre();

  window.addEventListener('popstate', onPopstate);
});

onUnmounted(() => {
  window.removeEventListener('popstate', onPopstate);
});
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

    <p v-if="vide" class="empty">
      Aucune oeuvre dans cette thématique pour le moment.
    </p>
  </div>
</template>

<style scoped>
/* --- Filtres thématiques --- */
.chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0;
  margin-bottom: var(--space-2xl);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-lg);
}

.chip {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  cursor: pointer;
  user-select: none;
  background: none;
  border: none;
  padding: 0 var(--space-lg) 0 0;
  transition: color 300ms cubic-bezier(0.25, 0.1, 0.25, 1);
  position: relative;
}

.chip::after {
  content: '/' / '';
  position: absolute;
  right: calc(var(--space-lg) / 2 - 4px);
  color: var(--color-border);
  pointer-events: none;
}

.chip:last-child::after {
  display: none;
}

.chip:hover {
  color: var(--color-text);
}

.chip.active {
  color: var(--color-accent);
}

.chip:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

/* --- Empty state --- */
.empty {
  color: var(--color-text-secondary);
  padding: var(--space-2xl) 0;
}
</style>
