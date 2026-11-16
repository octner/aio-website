// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL and BASE_PATH come from the GitHub Pages workflow.
// On the custom domain BASE_PATH is empty, so nothing below needs to change.
const site = process.env.SITE_URL || 'https://internetobservatory.org.au';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  // The toolbar that "astro dev" shows at the foot of each page; the built site never has it.
  devToolbar: { enabled: false },
});
