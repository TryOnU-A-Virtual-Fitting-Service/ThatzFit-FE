import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `index.[hash].js`,
        chunkFileNames: `index-vendor.[hash].js`,
        assetFileNames: `[name].[hash].[ext]`,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'index-vendor';
          }
        }
      }
    }
  }
})
