import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://80d9-103-180-201-156.ngrok-free.app',
        changeOrigin: true,
        // If needed, you can configure other options here
      },
    },
  },
});