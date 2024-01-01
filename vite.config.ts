import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Proxy all requests that do not have a specific starting path
      '^/': {
        target: 'https://80d9-103-180-201-156.ngrok-free.app',
        changeOrigin: true,
        // If needed, you can configure other options here
      },
    },
  },
});