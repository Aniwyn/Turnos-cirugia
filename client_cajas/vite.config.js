import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'

dotenv.config()
const PORT = parseInt(process.env.VITE_PORT) || 5173

export default defineConfig({
  server: {
    host: true,
    port: PORT,
    fs: {
      allow: ['.']
    }
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})