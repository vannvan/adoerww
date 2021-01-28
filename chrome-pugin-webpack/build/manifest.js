const manifest_version = 2
const manifest = require('../src/manifest.json')
const packJSON = require('../package.json')

const defaultConfig = {
  name: 'chrome插件',
  description: 'webpack版chrome插件',
  version: packJSON.version,
  permissions: [
    'contextMenus', // 右键菜单
    'tabs', // 标签
    'notifications', // 通知
    'webRequest', // web请求
    'webRequestBlocking',
    'storage', // 插件本地存储
    'http://*/*', // 可以通过executeScript或者insertCSS访问的网站
    'https://*/*', // 可以通过executeScript或者insertCSS访问的网站
  ],
  options_ui: {
    page: 'options.html',
    chrome_style: true,
  },
  options_page: 'options.html',
}

const unsafe = {
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
}

var injects = {
  web_accessible_resources: [],
}

// const openTab =
// {
//     // 覆盖浏览器默认的新标签页
//     "newtab": "newtab.html"
// }
const registerObj = {
  omnibox: { keyword: '' },
}
const optionPage = {
  page: '',
  chrome_style: true,
}
const contentItem = {
  matches: [
    '*://192.168.50.112/*',
    '*://*.emalacca.com/*',
    '*://*.shopee.tw/*',
    '*://shopee.tw/*',
    '*://*.shopee.cn/*',
    '*://shopee.cn/*',
    '*://*.shopeesz.com/*',
    '*://*.shopee.co.id/*',
    '*://shopee.co.id/*',
    '*://*.shopee.vn/*',
    '*://shopee.vn/*',
    '*://shopee.co.th/*',
    '*://*.shopee.co.th/*',
    '*://shopee.ph/*',
    '*://*.shopee.ph/*',
    '*://shopee.com.my/*',
    '*://*.shopee.com.my/*',
    '*://shopee.sg/*',
    '*://*.shopee.sg/*',
    '*://shopee.com/*',
    '*://*.shopee.com/*',
    '*://shopee.com.br/*',
    '*://*.shopee.com.br/*',
    '*://*.keyouyun.com/*',
    '*://*.1688.com/*',
    '*://*.lazada.com.my/*',
    '*://*.lazada.co.id/*',
    '*://*.lazada.com.ph/*',
    '*://*.lazada.sg/*',
    '*://*.lazada.co.th/*',
    '*://*.lazada.vn/*',
    '*://*.aliexpress.com/*',
    '*://*.xiapibuy.com/*',
    '*://*.taobao.com/*',
    '*://*.tmall.com/*',
    '*://*.tmall.hk/*',
    '*://*.yangkeduo.com/*',
    '*://*.17zwd.com/*',
  ],
  // 多个JS按顺序注入
  js: [],
  css: [],
  run_at: 'document_end',
}

const handleAsset = function(arr) {
  return arr.map(function(e) {
    const obj = Object.assign({}, contentItem)
    obj.run_at = e.position || 'document_end'
    obj.js = e.js.map(function(e) {
      return e.match(/\/(\w+\.?\w+\.js$)/)[1]
    })
    obj.css = e.css
    // obj.matches = e.matches

    if (obj.js && !obj.js.length) delete obj.js
    if (obj.css && !obj.css.length) delete obj.css
    return obj
  })
}

const backgroundobj = {
  // 2种指定方式，如果指定JS，那么会自动生成一个背景页
}
// 当某些特定页面打开才显示的图标
const page_action = {
  
}

// 所有页面显示的

// const browser_action = {
//   default_icon: 'img/app.png',
//   default_title: '老帅比',
//   default_popup: 'popup.html',
// }

const testObj = function(obj) {
  return obj.default_icon && obj.default_title && obj.default_popup
}

const path = require('path')
const jsonfile = require('jsonfile')
const env = process.env.NODE_ENV
module.exports = function() {
  const config = {}
  var needInject = manifest.injects && manifest.injects.length
  if (needInject) {
    injects.web_accessible_resources = ['injects.js']
    Object.assign(config, injects)
    injects.web_accessible_resources = []
  }
  config.name = manifest.name || defaultConfig.name
  config.manifest_version = manifest_version
  config.description = manifest.description || defaultConfig.description
  config.version = manifest.version || defaultConfig.version
  config.permissions = manifest.permissions || defaultConfig.permissions // 为了防止权限受限, 默认开启全部权限
  config.web_accessible_resources = manifest.web_accessible_resources
  // manifest.opentab ? (config.chrome_url_overrides = openTab) : null
  if (manifest.opentab) {
    if (typeof manifest.opentab === 'string') {
      config.chrome_url_overrides = {
        newtab: manifest.opentab,
      }
    } else {
      config.chrome_url_overrides = {
        newtab: 'newtab.html',
      }
    }
  }
  manifest.register
    ? (registerObj.omnibox.keyword = manifest.register) &&
      (config.omnibox = registerObj)
    : null
  // config.default_locale = config.language || defaultConfig.default_locale
  manifest.devpage && manifest.devpage.endsWith('.html')
    ? (config.devtools_page = manifest.devpage)
    : null
  manifest.optionpage && manifest.optionpage.endsWith('.html')
    ? (optionPage.page = manifest.optionpage) &&
      (config.options_ui = optionPage)
    : null
  config.homepage_url = manifest.home || defaultConfig.homepage_url

  manifest.scriptsAndCss && manifest.scriptsAndCss.length
    ? (config.content_scripts = handleAsset(manifest.scriptsAndCss))
    : null

  /**handle background */
  if (
    manifest.background &&
    manifest.background.page &&
    manifest.background.page.endsWith('.html')
  ) {
    backgroundobj.page = manifest.background.page
  }
  if (
    manifest.background &&
    manifest.background.scripts &&
    manifest.background.scripts.length
  ) {
    backgroundobj.scripts = manifest.background.scripts.map(function(e) {
      return e.match(/\/?(\w+\.?\w+\.js$)/)[1]
    })
  }

  // manifest.background && manifest.background.page && manifest.background.page.endsWith('.html') && (backgroundobj.page = manifest.background.page)
  // manifest.background && manifest.background.scripts && manifest.background.scripts.length && (backgroundobj.scripts = manifest.scripts)

  // backgroundobj.page && !backgroundobj.page.endsWith('.html') && (delete backgroundobj.page);
  // (!backgroundobj.scripts || !backgroundobj.scripts.length) && (delete backgroundobj.scripts)
  if (
    backgroundobj.page ||
    (backgroundobj.scripts && backgroundobj.scripts.length)
  ) {
    config.background = backgroundobj
  }
  /**handle background */
  /**handle action choose one in three*/
  if (manifest.app && testObj(manifest.app)) {
    config.app = manifest.app
  } else if (manifest.browser_action && testObj(manifest.browser_action)) {
    config.browser_action = manifest.browser_action
  } else if (manifest.page_action && testObj(manifest.page_action)) {
    config.page_action = manifest.browser_action
  } else {
    config.page_action = page_action
  }
  /**处理action */

  config.icons = manifest.icons || defaultConfig.icons

  const pathname =
    env === 'development'
      ? path.resolve(__dirname, '../local/')
      : path.resolve(__dirname, '../dist/')
  const filename = '/manifest.json'

  ;(config.content_security_policy =
    "script-src 'self' 'unsafe-eval'; object-src 'self'"),
    jsonfile.writeFile(pathname + filename, config, null, function(err) {
      if (err) console.log('=====>>> make manifest.json error: ', err)
      console.log('======>>> : manifest.json build success : <<<======')
    })
}
