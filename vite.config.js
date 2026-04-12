import { defineConfig } from 'vite';

// Deployed under /simple-books-catalogue/ on GitHub Pages.
// assetsInlineLimit: 0 keeps SVG imports as real files in dist.
export default defineConfig({
  base: '/simple-books-catalogue/',

  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: info => {
          if (info.name?.endsWith('.svg')) return 'assets/[name][extname]';
          if (info.name?.endsWith('.css')) return 'assets/main.css';
          return 'assets/[name][extname]';
        },
      },
    },
    assetsInlineLimit: 0,
  },
});
