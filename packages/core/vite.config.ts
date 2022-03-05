/// <reference types="vitest" />

import { resolve } from 'path';
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      formats: ['es']
    },
    target: 'esnext',
    minify: false
  },
  test: {
    environment: 'jsdom', // or 'jsdom', 'node'
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src']
    },
    // Disable multi-threading, to make jsdom + canvas work.
    // see https://github.com/vitest-dev/vitest/issues/740
    threads: false,
    setupFiles: ['./test/setup.js']
  },
})
