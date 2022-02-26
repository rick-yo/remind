import { resolve } from 'path';
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.tsx'),
      name: pkg.name,
    },
  },
})
