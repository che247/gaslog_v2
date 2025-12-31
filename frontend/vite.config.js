import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["titan"],
    host: true,
    port: 3000,
    proxy: {
      // // Production
      // "/api": "http://localhost:5000"
      // Development
      "/api": "http://localhost:4321"
    }
  }
})
