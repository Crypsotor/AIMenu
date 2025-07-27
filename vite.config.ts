import path from 'path';
import { defineConfig } from 'vite';

// Ya no necesitamos 'loadEnv' para el despliegue

export default defineConfig(({ mode }) => {
  return {
    base: '/AIMenu/',
    define: {
      // Leemos DIRECTAMENTE del entorno del proceso que ejecuta la Acción
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
