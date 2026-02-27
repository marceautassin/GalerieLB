# Story 3.2: Page À propos

Status: ready-for-dev

## Story

As a visiteur (collectionneur, journaliste, professionnel),
I want découvrir le parcours de Louis Barrand et les informations pratiques de la galerie,
so that j'évalue la crédibilité et le professionnalisme de la galerie.

## Acceptance Criteria

1. `/a-propos` affiche la biographie de Louis Barrand
2. La mention du Prix Marcus et l'expertise/approche de la galerie sont visibles
3. Les informations pratiques (adresse, horaires) sont affichées
4. Le contenu est récupéré depuis le CMS (single type APropos)
5. La page est responsive et accessible

## Tasks / Subtasks

- [ ] Task 1 : Étendre le client API (AC: #4)
  - [ ] 1.1 Ajouter `fetchAPropos()` dans `strapi-client.ts`
  - [ ] 1.2 Compléter le type `APropos` dans `strapi.ts`
- [ ] Task 2 : Créer la page `/a-propos.astro` (AC: #1, #2, #3, #5)
  - [ ] 2.1 Fetch du single type APropos au build
  - [ ] 2.2 Section biographie Louis (rich text)
  - [ ] 2.3 Section Prix Marcus et expertise
  - [ ] 2.4 Section informations pratiques : adresse, horaires
  - [ ] 2.5 Layout sobre, contenu centré, responsive
  - [ ] 2.6 SeoHead avec title et description

## Dev Notes

### Single type — Fetch Strapi

```typescript
// Pour un single type, pas de tableau data mais un objet unique
export async function fetchAPropos(): Promise<APropos> {
  const response = await fetchStrapi<StrapiSingleResponse<APropos>>('a-propos');
  return response.data;
}
```

### Design de la page

Page sobre, centrée sur le contenu texte. Pas de grid complexe — la crédibilité vient du contenu (Prix Marcus, parcours). Large espace blanc, typographie lisible.

### Prérequis

- Story 1.3 complétée (single type APropos existe et rempli)
- Story 2.1 complétée (client API base)
- Story 1.4 complétée (LayoutPrincipal)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 3, Story 3.2]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
