/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import Sitemap from 'vite-plugin-sitemap';

const viteConfig = {
  // 👇 Aquí van los plugins
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://colegioedespecial.org.ar',
      generateRobotsTxt: false,
    })
  ],
  resolve: {
    // 👇 Aquí solo van los alias
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    //port: 5173,
    open: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  if (mode === 'production' && !env.VITE_RECAPTCHA_SITE_KEY?.trim()) {
    throw new Error(
      'Falta VITE_RECAPTCHA_SITE_KEY. Configurala en el entorno de build de producción y volvé a compilar.',
    );
  }

  return viteConfig;
});