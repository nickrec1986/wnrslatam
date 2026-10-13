import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nickrec1986.github.io',
  base: '/wnrslatam/',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('wnrs-copia-original') &&
        !page.includes('hello-world') &&
        !page.includes('/media/wnrs') &&
        !page.includes('/gracias') &&
        !page.includes('/v2') &&
        !page.includes('/v3'),
    }),
  ],
});
