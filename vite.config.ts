import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        assetFileNames: (assetInfo) => assetInfo.names.some((name) => name.endsWith('.css')) ? 'assets/app.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
