const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: '/test.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ss.bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      //html编译插件
      template: './demo.html',
    }),
  ],
  devServer: {
    //配置服务端口号
    port: 8091,
    // 打开热更新开关
    hot: true,
    //设置基本目录结构
    // contentBase: path.resolve(__dirname, 'dist'),
    //服务器的IP地址，可以使用IP也可以使用localhost
    host: 'localhost',
    //服务端压缩是否开启
    compress: true,
    watchFiles: ['./demo.html'],
  },
}
