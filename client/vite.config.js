import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.VITE_PORT) || 5173;

  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH || '/roomly',
    appType: 'spa',
    server: {
      host: true,
      port,
      strictPort: true,
      allowedHosts: [env.VITE_ALLOWED_HOST],
      proxy: {
        '/api': {
          target: env.VITE_END_POINT_API,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});