import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// GitHub Pages 项目站为 https://<user>.github.io/<仓库名>/，CI 里设置 BASE_PATH=/<仓库名>/
// https://vitejs.dev/guide/build.html#public-base-path
function publicBase(): string {
  const p = process.env.BASE_PATH?.trim();
  if (!p) return '/';
  return p.endsWith('/') ? p : `${p}/`;
}

// https://vitejs.dev/config/
export default defineConfig({
  base: publicBase(),
  plugins: [react()],
  resolve: {
    alias: {
      'web-chart': resolve(__dirname, 'components'),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
  },
  server: { port: 2333 },
});
