import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://sops-in-pharma.com',
  integrations: [mdx()],
  build: {
    assets: 'assets'
  }
});