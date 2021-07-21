module.exports = {
  // productionSourceMap: false,
  publicPath: '/',

  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api/': '/'
        }
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "./src/assets/scss/theme.scss";`
      }
    }
  }
}
