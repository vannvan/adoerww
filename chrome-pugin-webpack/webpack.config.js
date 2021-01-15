const { resolve } = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WriteJsonWebpackPlugin = require('write-json-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const HtmlWithImgLoader = require('html-withimg-loader')
const isDev = process.env.NODE_ENV == 'development'

const DevOutPutPath = 'local/'

let manifestJSON = require('./src/manifest.json')

// 客户端配置
module.exports = {
  entry: {
    background: './src/background.js',
    inject: './src/inject.js',
    popup: './src/popup/popup.js',
    home: './src/home/home.js',
    options: './src/options/options.js',
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, isDev ? DevOutPutPath : 'dist/'),
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
        test: /\.(png\jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024, // 小于这个时将会已base64位图片打包处理
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ['html-withimg-loader'], // html中的img标签 ,html文件中的图片可以被打包的关键
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
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'], // 从右向左解析原则
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
      '@fonts': resolve('src/assets/fonts'),
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
    new HtmlWebpackPlugin({
      filename: 'home.html',
      template: './src/home/home.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
      chunks: ['home'],
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: './src/options/options.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
      chunks: ['options'],
    }),
    new UglifyJsPlugin({}), //压缩js输出
    new OptimizeCSSAssetsPlugin(), //压缩css
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }), // minicss,
    new CopyWebpackPlugin([
      {
        from: resolve('src/assets/icon'),
        to: resolve(__dirname, (isDev ? DevOutPutPath : 'dist/') + 'icon'),
        toType: 'dir',
      },
      //   {
      //     from: resolve('src/assets/images'),
      //     to: resolve(__dirname, (isDev ? DevOutPutPath : 'dist/') + 'images'),
      //     toType: 'dir',
      //   },
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
