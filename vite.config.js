import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  server: {
    // Graceful backward-compatibility rewrites for cached browser requests
    proxy: {},
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/showcase' || req.url === '/showcase.html') {
          req.url = '/index.html';
        } else if (req.url.startsWith('/slides-assets/')) {
          req.url = req.url.replace('/slides-assets/', '/assets/slides/');
        } else if (req.url === '/fbsu-logo.png') {
          req.url = '/assets/branding/fbsu-logo.png';
        } else if (req.url === '/fbsu-campus.jpg') {
          req.url = '/assets/branding/fbsu-campus.jpg';
        } else if (req.url === '/FBSU_Smart_Parking_UIUX_Presentation.pptx') {
          req.url = '/assets/docs/FBSU_Smart_Parking_UIUX_Presentation.pptx';
        }
        next();
      });
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        app: resolve(import.meta.dirname, 'app.html'),
        presentation: resolve(import.meta.dirname, 'presentation.html'),
      },
    },
  },
});
