import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Bypass CORS for dev: frontend calls /api/... -> proxied to http://warshaa.runasp.net
      '/api': {
        target: 'http://warshaa.runasp.net',
        changeOrigin: true,
      },
    },
  },
})
