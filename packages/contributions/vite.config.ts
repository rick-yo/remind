import { resolve } from 'path';
import { defineConfig } from 'vite'
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: pkg.name,
    },
  },
})
