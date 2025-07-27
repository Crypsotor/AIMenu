import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // 1. La ruta base de tu proyecto en GitHub Pages.
  // Esto es VITAL para que los archivos se encuentren.
  base: '/AIMenu/',

  // 2. El plugin necesario para que Vite entienda React (JSX, etc.).
  plugins: [react()],

  // 3. La configuración de alias de tu proyecto.
  // Esto lo dejamos como estaba, es para que funcionen los imports con '@'.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});