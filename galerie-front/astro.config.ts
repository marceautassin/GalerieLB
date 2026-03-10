import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';

const site = import.meta.env.SITE_URL || 'https://www.galerie-louisbarrand.fr';
const base = import.meta.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  integrations: [vue(), sitemap()],
  image: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.services.clever-cloud.com' },
    ],
  },
});
