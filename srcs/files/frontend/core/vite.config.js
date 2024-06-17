import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, process.env.SSL_KEY_FILE)),
      cert: fs.readFileSync(path.resolve(__dirname, process.env.SSL_CRT_FILE)),
    },
    watch: {
      usePolling: true,
    },
  },
})
