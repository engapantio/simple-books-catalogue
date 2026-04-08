import { defineConfig } from 'vite';

/**
 * Vite configuration.
 * Final build: dist/index.html + dist/assets/{main.js, main.css, *.svg}
 * base './' makes all paths relative — works on GitHub Pages and local serving.
 */
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
    // Never inline assets → keeps SVGs as real files in dist/assets/
    assetsInlineLimit: 0,
  },
});
