import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  root: 'demo',
  plugins: [react()],
  resolve: {
    alias: {
      '@itsneufox/dockshift': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
  },
  build: {
    outDir: '../demo-dist',
    emptyOutDir: true,
  },
});
