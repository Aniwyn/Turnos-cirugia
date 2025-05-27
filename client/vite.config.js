import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const PORT = import.meta.env.VITE_BACK_URL

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: PORT,
  },
})

// https://vitejs.dev/config/