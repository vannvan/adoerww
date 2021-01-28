const { resolve } = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WriteJsonWebpackPlugin = require('write-json-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const HtmlWithImgLoader = require('html-withimg-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getHtmlWebpackPluginConfigs = require('./page-entry')
const webpack = require('webpack')

const modules = require('./modules')

const isDev = process.env.NODE_ENV == 'development'

const DevOutPutPath = resolve('local/')

const manifestJSON = require('../src/manifest.json')

module.exports = {
  entry: {
    background: './src/background.js',
    inject: './src/inject.js',
    popup: './src/popup/popup.js',
    home: './src/home/home.js',
    options: './src/options/options.js',
    presentation: './src/presentation/presentation.js'
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, isDev ? DevOutPutPath : 'dist/')
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
      filename: '[name].css'
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
      VERSION: JSON.stringify('5fa3b9'),
      BROWSER_SUPPORTS_HTML5: true,
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
  ].concat(getHtmlWebpackPluginConfigs()),
  mode: 'development',
  devtool: 'none',
  devServer: {
    port: 3000
  }
}
