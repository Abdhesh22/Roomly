import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  appType: 'spa', // SPA fallback for unknown routes
  server: {
    host: true,                // allow LAN & custom hostnames
    port: 5173,
    strictPort: true,          // fail if port is already in use
    allowedHosts: ['roomly.local', 'localhost'], // whitelist your hostname
  },
});