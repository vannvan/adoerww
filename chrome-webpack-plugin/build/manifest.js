const manifest_version = 2
const manifest = require('../src/manifest.json')
const packJSON = require('../package.json')
const path = require('path')
const jsonfile = require('jsonfile')
const env = process.env.NODE_ENV
let namePostfix = env !== 'production' ? env : ''
const defaultConfig = {
  name: '马六甲跨境助手' + namePostfix,
  version: packJSON.version,
  permissions: [
    'contextMenus', // 右键菜单
    'tabs', // 标签
    'notifications', // 通知
    'webRequest', // web请求
    'webRequestBlocking',
    'storage', // 插件本地存储
    'http://*/*', // 可以通过executeScript或者insertCSS访问的网站
    'https://*/*' // 可以通过executeScript或者insertCSS访问的网站
  ]
}


module.exports = function() {
  const config = Object.assign(defaultConfig, manifest)
  const pathname =
    env === 'development'
      ? path.resolve(__dirname, '../local/')
      : path.resolve(__dirname, '../dist/')
  const filename = '/manifest.json'

  jsonfile.writeFile(pathname + filename, config, null, function(err) {
    if (err) console.log('=====>>> make manifest.json error: ', err)
    console.log('======>>> : manifest.json build success : <<<======')
  })
}
