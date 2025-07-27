import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    base: '/AIMenu/',
    define: {
      // Aquí está la magia:
      // Le decimos a Vite que busque en tu código 'process.env.GEMINI_API_KEY'
      // y lo reemplace con el valor REAL de la variable VITE_GEMINI_API_KEY
      // que le pasa el robot.
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});