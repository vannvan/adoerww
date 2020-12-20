const path = require('path')
var fs = require('fs')
const { resolve } = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WriteJsonWebpackPlugin = require('write-json-webpack-plugin')

// const minicss = new MiniCss({
//   filename: 'style.css',
// })
const HtmlWebpackPlugin = require('html-webpack-plugin')
const env = process.env.NODE_ENV
// var $pages = fs.readdirSync(path.resolve(__dirname, './src/pages'))
var htmlTpls = []
let manifestJSON = require('./src/manifest.json')

// 客户端配置
const clientConfig = {
  //   entry: c,
  entry: {
    background: './src/background.js',
    inject: './src/inject.js',
    popup: './src/popup/popup.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, env === 'development' ? 'tmp/' : 'dist/'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true',
        exclude: [/node_modules/],
        options: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.js',
      '@': resolve('src'),
      '@styles': resolve('src/assets/styles'),
      '@components': resolve('src/components'),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './src/popup/popup.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
      chunks: ['popup'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }), // minicss,
    new CopyWebpackPlugin([
      {
        from: resolve('src/assets/icon'),
        to: path.resolve(
          __dirname,
          env === 'development' ? 'tmp/' + 'icon' : 'dist/' + 'icon'
        ),
        toType: 'dir',
      },
    ]),
    manifestJSON &&
      new WriteJsonWebpackPlugin({
        pretty: false,
        object: manifestJSON,
        path: '/',
        filename: 'manifest.json',
      }),
  ],
  mode: 'development',
  devtool: 'none',
  devServer: {
    port: 3000,
  },
}

clientConfig.plugins = clientConfig.plugins.concat(htmlTpls)

module.exports = [clientConfig]
