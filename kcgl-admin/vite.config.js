import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 以 /api/xxx 开头的请求, 转为 http://localhost:3000/api/xxx
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // 把请求中的 /api 替换为空字符串.
        // 请求最终变为 http://localhost:3000/xxx
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
