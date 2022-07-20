const path = require('path')
import { terser } from 'rollup-plugin-terser'

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

const fileList = ['data.js', 'canvas1.js', 'canvas.js', 'aha.js', 'mouse-move.js']

export default {
  input: fileList.map((el) => resolve(`nav/${el}`)),
  // output: {
  //   file: 'nav/bundle.js',
  //   format: 'iife',
  // },
  output: {
    dir: resolve('nav/min'),
    format: 'cjs', // 构建浏览器使用的文件
    strict: false,
  },
  plugins: [terser({ compress: { drop_console: true } })],
}
