import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://eventos.casarofer.com.br',
  output: 'static',
  prefetch: true,
  build: {
    inlineStylesheets: 'auto',
  },
  server: {
    port: 4323,
  },
});
