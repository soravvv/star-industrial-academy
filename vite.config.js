import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // The local registration API only allows CORS requests from this exact
    // origin (http://localhost:5173), so fail loudly instead of silently
    // moving to another port where every form submission would be blocked.
    port: 5173,
    strictPort: true,
  },
  test: {
    environment: 'node',
  },
});
