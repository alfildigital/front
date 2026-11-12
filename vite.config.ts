// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import Sitemap from 'vite-plugin-sitemap';

const viteConfig = {
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://colegioedespecial.org.ar',
      generateRobotsTxt: false,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
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
  // 👇 EL CAMBIO ESTÁ AQUÍ: Cadena vacía en lugar de 'VITE_'
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  if (mode === 'production' && !env.VITE_RECAPTCHA_SITE_KEY?.trim()) {
    // Esto te ayudará a depurar en los logs de Vercel si vuelve a fallar
    console.error('Variables de entorno cargadas:', Object.keys(env).filter(k => k.includes('RECAPTCHA') || k.includes('VITE')));
    
    throw new Error(
      'Falta VITE_RECAPTCHA_SITE_KEY. Configurala en el entorno de build de producción y volvé a compilar.',
    );
  }

  return viteConfig;
});