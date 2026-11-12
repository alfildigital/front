/// <reference types="vitest" />
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
  // Cargamos las variables (incluye las de process.env de Vercel)
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  // 👇 ESTA ES LA LÍNEA MÁGICA QUE FALTABA 👇
  // Si falla, esto imprimirá en los logs de Vercel qué variables con "RECAPTCHA" llegaron.
  if (mode === 'production' && !env.VITE_RECAPTCHA_SITE_KEY?.trim()) {
    console.error(
      'Variables de entorno disponibles en Vercel:',
      Object.keys(process.env).filter((key) => key.includes('RECAPTCHA'))
    );
    
    throw new Error(
      'Falta VITE_RECAPTCHA_SITE_KEY. Configurala en el entorno de build de producción y volvé a compilar.',
    );
  }

  return viteConfig;
});