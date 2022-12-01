import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log('process', process.env.NODE_ENV)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // publicDir: process.env.NODE_ENV == 'prod' ? './' : './public/',
  base: './',
  // assetsInclude: ['**/*.css'],
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        charset: false,
        // additionalData: '@import "./src/assets/style/global.less";',
      },
    },
  },
})
