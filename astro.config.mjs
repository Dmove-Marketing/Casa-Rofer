import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://eventos.casarofer.com.br',
  output: 'static',
  redirects: {
    '/': '/casamentos',
    // link de aprovação enviado ao cliente (nov/2026): agora é a página principal
    '/eventos-corporativos-kick-off': '/eventos-corporativos',
  },
  prefetch: true,
  build: {
    inlineStylesheets: 'always',
  },
  server: {
    port: 4323,
  },
});
