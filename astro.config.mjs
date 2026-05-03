// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://innowords.bruneng.com',
  build: {
    format: 'directory'
  },
  compressHTML: true
});
