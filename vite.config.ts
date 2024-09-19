import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

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
  };
});

