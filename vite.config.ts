import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- Импорт

export default defineConfig({
  plugins: [react(), tailwindcss()], // <--- Добавлен в плагины
  server: {
    port: 5173,
    open: true,
  },
})