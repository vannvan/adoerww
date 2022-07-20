const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { resolve } = require('path')
const isDev = process.env.NODE_ENV == 'development'
const DevOutPutPath = 'local/'

// 客户端配置
module.exports = [
  {
    test: /\.js$/,
    loader: 'babel-loader?cacheDirectory=true',
    exclude: [/node_modules/],
    options: {
      presets: ['@babel/preset-env']
    }
  },
  {
    test: /\.(png|jpe?g|gif)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          extract: true,
          limit: 200000, // 小于这个时将会已base64位图片打包处理
          fallback: 'file-loader', // 当超过100000byte时，会回退使用file-loader
          outputPath: 'images'
        }
      }
    ]
  },
  {
    test: /\.html$/,
    use: ['html-withimg-loader'] // html中的img标签 ,html文件中的图片可以被打包的关键
  },

  {
    test: /\.vue$/,
    use: ['vue-loader']
  },
  {
    test: /\.css$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader']
  },
  {
    test: /\.less$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
  },
  {
    test: /\.scss$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] // 从右向左解析原则
  },
  {
    test: /\.(eot|svg|ttf|woff|woff2?)$/,
    loader: 'url-loader'
  }
]
