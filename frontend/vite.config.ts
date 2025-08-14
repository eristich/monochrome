/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Générer les assets dans le répertoire app/assets
    assetsDir: 'app/assets',
    // Noms de fichiers prévisibles pour la production
    rollupOptions: {
      output: {
        entryFileNames: 'app/assets/[name]-[hash].js',
        chunkFileNames: 'app/assets/[name]-[hash].js',
        assetFileNames: 'app/assets/[name]-[hash].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
