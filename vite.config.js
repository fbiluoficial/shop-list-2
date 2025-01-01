import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/shop-list-2/',
  server: {
    port: 5173,
    strictPort: true,
    host: true
  }
});
