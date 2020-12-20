const config = require('../webpack.config')
const webpack = require('webpack')
const compiler = webpack(config)
const env = process.env.NODE_ENV
// console.log(' =======>>>> ', config)
// console.log(' =========>>>> ', compiler)
compiler.run((err, stats) => {
  if (err) console.log('启动出错 :: ', err)
  console.log('=========>>> 启动开始 <<<=======')
  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })
  )

  require('./manifest')()
  console.log('==========>>> 启动结束 <<<=========')

  if (env === 'production') {
    // watching.close(() => {
    console.log('========>>> 文件输出完成 ========>>>')
    // })
  }
})
