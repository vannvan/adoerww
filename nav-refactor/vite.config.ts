import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { inject, minify } from 'vite-plugin-parse-html'

// console.log('process', process.env.NODE_ENV)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    inject({
      data: {
        title: '导了个航',
        description:
          '导了个航是一个面向前端开发者的专属导航网站，提供便捷的导航功能，便于在工作中查找各类工具网站地址',
        keywords: '前端导航、前端常用网站、前端工具、前端博客',
      },
    }),
    minify({
      isMinify: true,
    }),
  ],
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
