<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  apiUrl: string;
}>();

// Form state
const nom = ref('');
const email = ref('');
const message = ref('');
const referenceOeuvre = ref('');
const referenceExposition = ref('');
const honeypot = ref('');
const hasReference = ref(false);

// UI state
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
const status = ref<FormStatus>('idle');
const serverError = ref('');

// Validation
const errors = ref<Record<string, string>>({});
const touched = ref<Record<string, boolean>>({});

function validateField(field: string): string {
  switch (field) {
    case 'nom':
      return nom.value.trim() ? '' : 'Le nom est requis.';
    case 'email': {
      if (!email.value.trim()) return "L'adresse email est requise.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.value) ? '' : "L'adresse email n'est pas valide.";
    }
    case 'message':
      if (!message.value.trim()) return 'Le message est requis.';
      return message.value.trim().length < 10 ? 'Le message doit contenir au moins 10 caractères.' : '';
    default:
      return '';
  }
}

function handleBlur(field: string) {
  touched.value[field] = true;
  errors.value[field] = validateField(field);
}

function validateAll(): boolean {
  const fields = ['nom', 'email', 'message'];
  let valid = true;
  for (const field of fields) {
    touched.value[field] = true;
    const error = validateField(field);
    errors.value[field] = error;
    if (error) valid = false;
  }
  return valid;
}

async function handleSubmit() {
  if (!validateAll()) return;
  if (honeypot.value) return; // Spam bot

  status.value = 'submitting';
  serverError.value = '';

  try {
    const response = await fetch(`${props.apiUrl}/api/messages-contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          nom: nom.value.trim(),
          email: email.value.trim(),
          message: message.value.trim(),
          referenceOeuvre: referenceOeuvre.value || null,
          referenceExposition: referenceExposition.value || null,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }

    status.value = 'success';
  } catch {
    status.value = 'error';
    serverError.value = 'Un problème est survenu lors de l\'envoi. Veuillez réessayer.';
  }
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const oeuvre = params.get('oeuvre');
  const exposition = params.get('exposition');
  if (oeuvre) {
    referenceOeuvre.value = oeuvre;
    hasReference.value = true;
  }
  if (exposition) {
    referenceExposition.value = exposition;
    hasReference.value = true;
  }
});
</script>

<template>
  <div v-if="status === 'success'" class="confirmation" role="status" aria-live="polite">
    <p>Votre message a été envoyé. Louis vous répondra rapidement.</p>
  </div>

  <form v-else @submit.prevent="handleSubmit" novalidate class="formulaire-contact">
    <p class="legende">* Champ obligatoire</p>

    <!-- Honeypot -->
    <input
      v-model="honeypot"
      type="text"
      name="website"
      autocomplete="off"
      tabindex="-1"
      aria-hidden="true"
      style="position: absolute; left: -9999px; opacity: 0; height: 0;"
    />

    <div class="champs-ligne">
      <div class="champ">
        <label for="contact-nom">Nom *</label>
        <input
          id="contact-nom"
          v-model="nom"
          type="text"
          required
          :class="{ 'champ-erreur': touched.nom && errors.nom }"
          :aria-describedby="errors.nom ? 'erreur-nom' : undefined"
          :aria-invalid="touched.nom && !!errors.nom"
          @blur="handleBlur('nom')"
        />
        <p v-if="touched.nom && errors.nom" :id="'erreur-nom'" class="erreur" role="alert">
          {{ errors.nom }}
        </p>
      </div>

      <div class="champ">
        <label for="contact-email">Email *</label>
        <input
          id="contact-email"
          v-model="email"
          type="email"
          required
          :class="{ 'champ-erreur': touched.email && errors.email }"
          :aria-describedby="errors.email ? 'erreur-email' : undefined"
          :aria-invalid="touched.email && !!errors.email"
          @blur="handleBlur('email')"
        />
        <p v-if="touched.email && errors.email" :id="'erreur-email'" class="erreur" role="alert">
          {{ errors.email }}
        </p>
      </div>
    </div>

    <div class="champ">
      <label for="contact-message">Message *</label>
      <textarea
        id="contact-message"
        v-model="message"
        required
        rows="6"
        :class="{ 'champ-erreur': touched.message && errors.message }"
        :aria-describedby="errors.message ? 'erreur-message' : undefined"
        :aria-invalid="touched.message && !!errors.message"
        @blur="handleBlur('message')"
      ></textarea>
      <p v-if="touched.message && errors.message" :id="'erreur-message'" class="erreur" role="alert">
        {{ errors.message }}
      </p>
    </div>

    <div class="champ">
      <label for="contact-reference">Référence (oeuvre ou exposition)</label>
      <input
        id="contact-reference"
        :value="referenceOeuvre || referenceExposition"
        type="text"
        :readonly="hasReference"
        @input="(e) => { referenceOeuvre = (e.target as HTMLInputElement).value; }"
      />
    </div>

    <div v-if="status === 'error'" class="erreur-serveur" role="alert">
      {{ serverError }}
    </div>

    <button type="submit" class="btn-primary" :disabled="status === 'submitting'">
      <span v-if="status === 'submitting'">Envoi en cours…</span>
      <span v-else>Envoyer</span>
    </button>
  </form>
</template>

<style scoped>
.formulaire-contact {
  position: relative;
  max-width: 640px;
}

.legende {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-lg);
}

.champs-ligne {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

@media (min-width: 640px) {
  .champs-ligne {
    grid-template-columns: 1fr 1fr;
  }
}

.champ {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-md);
}

.champs-ligne .champ {
  margin-bottom: 0;
}

label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: var(--space-xs);
}

input,
textarea {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 0.875rem;
  line-height: 1.5;
  transition: border-color var(--transition-fade);
}

input:focus-visible,
textarea:focus-visible {
  border-color: var(--color-text);
}

.champ-erreur {
  border-color: var(--color-error);
}

input[readonly] {
  background: var(--color-bg);
  color: var(--color-text-secondary);
}

.erreur {
  font-size: 0.75rem;
  color: var(--color-error);
  margin-top: var(--space-xs);
}

.erreur-serveur {
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  border: 1px solid var(--color-error);
  color: var(--color-error);
  font-size: 0.875rem;
}

button[type="submit"] {
  width: 100%;
}

@media (min-width: 640px) {
  button[type="submit"] {
    width: auto;
  }
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.confirmation {
  padding: var(--space-xl);
  border: 1px solid var(--color-success);
  color: var(--color-success);
  text-align: center;
  max-width: 640px;
}
</style>
