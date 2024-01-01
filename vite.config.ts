import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://becd-103-180-201-155.ngrok-free.app',
        changeOrigin: true,
        // If needed, you can configure other options here
      },
    },
  },
});