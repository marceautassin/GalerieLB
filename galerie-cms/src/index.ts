const REBUILD_COOLDOWN_MS = 30_000; // 30s debounce
let lastRebuild = 0;

async function triggerFrontRebuild() {
  const webhookUrl = process.env.WEBHOOK_FRONT_REBUILD_URL;
  if (!webhookUrl) return;

  const now = Date.now();
  if (now - lastRebuild < REBUILD_COOLDOWN_MS) return;
  lastRebuild = now;

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
      afterCreate: triggerFrontRebuild,
      afterUpdate: triggerFrontRebuild,
      afterDelete: triggerFrontRebuild,
    });
  },
};
