import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['remind-core', 'remind-contributions']
  }
});
