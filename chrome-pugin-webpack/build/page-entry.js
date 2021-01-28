const { resolve, parse } = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function getPages() {
  let entry = {}
  glob.sync(resolve('src/**/**.html')).forEach(function(fileDir) {
    let pathObj = parse(fileDir)
    let entryName = pathObj.dir.match(/\/\w+$/g)[0].split('/')[1] // 用文件夹名字作为入口名。
    entry[entryName] = fileDir
  })
  return entry
}

const pages = getPages()

const Exclude = ['fonts']
module.exports = () => {
  const res = []
  for (let [entryName, entryPath] of Object.entries(pages)) {
    if (!Exclude.includes(entryName)) {
      const plugin = new HtmlWebpackPlugin({
        filename: `${entryName}.html`,
        template: `${entryPath}`,
        minify: {
          collapseWhitespace: true,
          removeComments: true
        },
        chunks: [`${entryName}`]
      })
      res.push(plugin)
    }
  }
  return res
}
