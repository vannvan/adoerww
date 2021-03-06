const config = require('../webpack.config')
const webpack = require('webpack')
const compiler = webpack(config)
const chalk = require('chalk')
const ora = require('ora')

// const symbols = require('log-symbols')

const env = process.env.NODE_ENV

const envInfoText =
  env == 'development' ? 'Starting development Server...' : `application is building for ${env}`
const spinner = ora(envInfoText)
spinner.start()

// console.log(chalk.green(`application is building for ${env}`))

// console.log(' =======>>>> ', config)
// console.log(' =========>>>> ', compiler)
compiler.run((err, stats) => {
  if (err) {
    console.log('启动出错 :: ', err)
    spinner.fail()
  }

  //   console.log(chalk.green(`==========>>> 启动开始 <<<=========`))
  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    })
  )

  require('./manifest')()
  //   console.log(chalk.green(`==========>>> 启动结束 <<<=========`))
  spinner.succeed()
})
