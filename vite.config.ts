import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), dts({ entryRoot: 'components', outputDir: 'typings', tsConfigFilePath: 'tsconfig.json' })],
  resolve: {
    alias: {
      'web-chart': resolve(__dirname, 'components'),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'web-chart',
    sourcemap: false,
    lib: { entry: resolve(__dirname, 'components/index.ts'), formats: ['es'], fileName: 'index' },
    rollupOptions: { external: ['react', 'react-dom'] },
  },
  server: { port: 2333 },
});
