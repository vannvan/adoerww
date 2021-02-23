const { resolve } = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WriteJsonWebpackPlugin = require('write-json-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const getPagesWebpackPluginConfigs = require('./build/page-entry')
const webpack = require('webpack')

const modules = require('./build/modules')
const packJSON = require('./package.json')

const isDev = process.env.NODE_ENV == 'development'

const DevOutPutPath = resolve('local/')

const manifestJSON = require('./src/manifest.json')

//  resolve(__dirname, (isDev ? DevOutPutPath : 'dist/') + '/pages')

module.exports = {
  entry: Object.assign(
    {
      background: './src/background.js',
      inject: './src/inject.js'
    },
    getPagesWebpackPluginConfigs('js')
  ),
  output: {
    filename: '[name]/[name].js',
    path: resolve(__dirname, isDev ? DevOutPutPath : 'dist/'),
    publicPath: '../'
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://www.baidu.com/',
        pathRewrite: { '^/api': '' },
        changeOrigin: true, // target是域名的话，需要这个参数，
        secure: false // 设置支持https协议的代理
      }
    }
  },

  module: {
    rules: modules
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.js',
      '@': resolve('src'),
      '@styles': resolve('src/assets/styles'),
      '@background': resolve('src/background'),
      '@fonts': resolve('src/assets/fonts'),
      '@components': resolve('src/components')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),

    new UglifyJsPlugin({
      //   uglifyOptions: {
      //     compress: {
      //       drop_console: !isDev // 去除console
      //     }
      //   }
    }), //压缩js输出
    new OptimizeCSSAssetsPlugin(), //压缩css
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css'
    }), // minicss,
    new CopyWebpackPlugin([
      {
        from: resolve('src/assets/icon'),
        to: resolve(__dirname, (isDev ? DevOutPutPath : 'dist/') + '/icon'),
        toType: 'dir'
      }
    ]),
    //写入环境变量
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify(packJSON.version),
      APPNAME: JSON.stringify('马六甲虾皮助手'),
      MESSAGEPRIFIX: JSON.stringify('【马六甲虾皮助手】: '),
      'typeof window': JSON.stringify('object'),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),

    manifestJSON &&
      new WriteJsonWebpackPlugin({
        pretty: false,
        object: manifestJSON,
        path: '/',
        filename: 'manifest.json'
      })
  ].concat(getPagesWebpackPluginConfigs('html')),
  mode: 'production'
}
