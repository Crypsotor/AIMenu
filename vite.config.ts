import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Para el desarrollo local, carga las variables desde .env.local
  // Para el build en GitHub Actions, usará las que le pasamos
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/AIMenu/',
    plugins: [react()],
    define: {
      // Esta es la forma más robusta:
      // Si la variable del robot existe (VITE_GEMINI...), úsala.
      // Si no (estamos en local), usa la del archivo .env (que carga loadEnv).
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // Corregido a ./src que es lo estándar
      },
    },
  }
})