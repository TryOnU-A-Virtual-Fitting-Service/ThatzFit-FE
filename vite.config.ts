import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'src/Apps/main.tsx'),
        output: {
          entryFileNames: 'index.[hash].js',
          chunkFileNames: 'index-vendor.[hash].js',
          assetFileNames: 'index.[hash].[ext]',
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'index-vendor';
            }
          },
        }
      },
      emptyOutDir: true,
    },
    server: {
      allowedHosts: ['http://localhost:8080'],
    }
  };
})
