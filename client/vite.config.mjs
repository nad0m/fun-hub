import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command }) => {
  const config = {
    plugins: [react(), tsconfigPaths()],
    base: '/',
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.mjs',
    },
  };

  if (command !== 'serve') {
    config.base = '/fun-hub/';
  }
  return config;
});
