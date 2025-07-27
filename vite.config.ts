import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // La ruta base de tu proyecto en GitHub Pages
  base: '/AIMenu/',

  // Los plugins que necesita Vite para funcionar con React
  plugins: [react()],

  // Aquí definimos la variable de entorno
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY),
  },

  // La configuración de alias de tu proyecto
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});