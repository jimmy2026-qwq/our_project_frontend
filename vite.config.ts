import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const isVitest = process.env.VITEST === 'true';
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET?.trim() ||
    env.API_PROXY_TARGET?.trim() ||
    'http://127.0.0.1:8080';
  const devHost = env.VITE_DEV_HOST?.trim() || undefined;

  return {
    plugins: isVitest ? [] : [react()],
    test: {
      environment: 'node',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: devHost,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
