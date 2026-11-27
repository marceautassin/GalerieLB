// Debounce « trailing » : on attend la fin d'une rafale d'écritures pour déclencher un seul
// rebuild, avec les données à jour. Un rebuild en trop est sans risque (deploy-front.yml
// annule le run en cours via `concurrency`).
const REBUILD_DEBOUNCE_MS = 15_000;
let rebuildTimer: ReturnType<typeof setTimeout> | undefined;

function scheduleFrontRebuild() {
  if (!process.env.WEBHOOK_FRONT_REBUILD_URL) return;
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => void triggerFrontRebuild(), REBUILD_DEBOUNCE_MS);
}

async function triggerFrontRebuild() {
  const webhookUrl = process.env.WEBHOOK_FRONT_REBUILD_URL;
  if (!webhookUrl) return;

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_DISPATCH_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({ event_type: 'strapi-content-update' }),
    });
    if (res.ok) {
      strapi.log.info('Front rebuild triggered');
    } else {
      strapi.log.warn(`Front rebuild failed: ${res.status}`);
    }
  } catch (err) {
    strapi.log.warn(`Front rebuild error: ${(err as Error).message}`);
  }
}

export default {
  register() {},
  bootstrap() {
    strapi.db?.lifecycles.subscribe({
      afterCreate: scheduleFrontRebuild,
      afterUpdate: scheduleFrontRebuild,
      afterDelete: scheduleFrontRebuild,
    });
  },
};
