import { defineConfig, type Plugin } from 'vite';
import { serviceWorkerSource } from './src/sw-template';

function steadyTakePwa(): Plugin {
  return {
    name: 'steady-take-pwa',
    apply: 'build',
    generateBundle(_, bundle) {
      const builtAssets = Object.values(bundle)
        .filter((file) => file.type === 'chunk' || file.fileName.endsWith('.css'))
        .map((file) => `/${file.fileName}`);
      const version = builtAssets.find((file) => file.includes('/app-'))?.match(/app-([\w-]+)\.js/)?.[1] ?? 'shell';
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: serviceWorkerSource(`steady-take-${version}`, [
          '/', '/practice', '/demo', '/privacy', '/terms', '/offline.html', '/manifest.webmanifest', '/favicon.svg',
          '/assets/steady-timing-hero-768.webp', '/assets/fraunces-latin.woff2', '/icons/icon-192.png', '/icons/icon-512.png',
          ...builtAssets,
        ]),
      });
    },
  };
}

export default defineConfig({
  plugins: [steadyTakePwa()],
  build: {
    target: 'es2022',
    sourcemap: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
