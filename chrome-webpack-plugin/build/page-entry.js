const { resolve, parse } = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV == 'development'

const DevOutPutPath = resolve('local/')

function getPages(type) {
  let entry = {}
  glob.sync(resolve(`src/pages/**/**.${type}`)).forEach(function(fileDir) {
    let pathObj = parse(fileDir)
    let entryName = pathObj.dir.match(/\/\w+$/g)[0].split('/')[1] // 用文件夹名字作为入口名。
    entry[entryName] = fileDir
  })
  return entry
}

module.exports = type => {
  const res = []
  if (type == 'html') {
    for (let [entryName, entryPath] of Object.entries(getPages(type))) {
      const plugin = new HtmlWebpackPlugin({
        filename: `${entryName}/${entryName}.html`,
        template: `${entryPath}`,
        minify: {
          collapseWhitespace: true,
          removeComments: true
        },
        chunks: [`${entryName}`]
      })
      res.push(plugin)
    }
  } else {
    return getPages(type)
  }
  return res
}
