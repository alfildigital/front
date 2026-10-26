/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  // 👇 Aquí van los plugins
  plugins: [
    react(),
    Sitemap({ 
      hostname: 'https://www.colegioedespecial.org.ar',
      generateRobotsTxt: false
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
});