import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDebug = mode === 'development';
  return {
    define: {
      '__DEBUG__': isDebug,
    },
    base: './',
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

