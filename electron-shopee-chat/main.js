// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  BrowserView,
  session,
  ipcMain,
  shell,
} = require('electron')
// const axios = require('axios')

const googleTr = require('./utils/google-translate-server')

const request = require('request')

var currentStoreId = 338011596 // 当前店铺Id

const Store = require('electron-store')
let store = new Store()

var mainWindow = null // 声明要打开的主窗口
var webView = null //装在外部web页面

const path = require('path')
const fs = require('fs')

/**
 * 获得
 */
let getCookies = () => {
  session.defaultSession.cookies.get(
    { url: 'https://seller.shopee.com.my/webchat/conversations' },
    function (error, cookies) {
      console.log(cookies)
      //   if (cookies.length > 0) {
      //     let name = document.getElementById('name')
      //     name.value = cookies[0].value
      //     let password = document.getElementById('password')
      //     password.value = cookies[1].value
      //   }
    }
  )
}

function openExternal(url) {
  const HTTP_REGEXP = /^https?:\/\//
  // 非http协议不打开，防止出现自定义协议等导致的安全问题
  if (!HTTP_REGEXP) {
    return false
  }
  try {
    shell.openExternal(url, options)
    return true
  } catch (error) {
    console.error('open external error: ', error)
    return false
  }
}

/**
 * 保存cookie
 * @param name  cookie名称
 * @param value cookie值
 */
let setCookie = (name, value) => {
  let Days = 30
  let exp = new Date()
  let date = Math.round(exp.getTime() / 1000) + Days * 24 * 60 * 60
  const cookie = {
    domain: 'seller.shopee.com.my',
    name: name,
    value: value,
    expirationDate: date,
    path: '/',
  }
  session.defaultSession.cookies.set(cookie, (error) => {
    if (error) console.error(error)
  })
}

app.on('ready', () => {
  // 设置窗口的高度和宽度
  mainWindow = new BrowserWindow({
    width: 1260,
    height: 780,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      //   devTools: false,
    },
  })

  mainWindow.loadURL(
    'https://seller.my.shopee.cn/webchat/conversations?' + new Date().getTime()
  )
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 创建窗口监听
  mainWindow.webContents.on(
    'new-window',
    (event, url, frameName, disposition) => {
      //   if (disposition === 'foreground-tab') {
      //     // 阻止鼠标点击链接
      //     event.preventDefault()
      //     openExternal(url)
      //   }
      if (disposition == 'new-window') {
        console.log('new window', disposition, url)
        event.preventDefault()
        shell.openExternal(url)
      }
    }
  )
  //   getCookies()

  mainWindow.webContents.on('did-finish-load', function () {
    console.log('load script ...')
    const js = fs
      .readFileSync(path.join(__dirname, './insert/inject.js'))
      .toString()
    const css = fs
      .readFileSync(path.join(__dirname, './insert/inject.css'))
      .toString()
    mainWindow.webContents.executeJavaScript(js)
    mainWindow.webContents.insertCSS(css)

    setTimeout(() => {
      mainWindowNotifier('SET_PAGE_COOKIES', {
        cookies: store.get(currentStoreId),
        storeId: currentStoreId,
      })
    }, 100)
  })

  mainWindow.webContents.openDevTools()
})

// 监听渲染线程消息
ipcMain.on('inject-message', (e, args) => {
  console.log('inject message', 'params:', args)
  let { type, params } = args
  let store = new Store()
  switch (type) {
    case 'LOAD_PAGE':
      currentStoreId = params.storeId
      console.log(currentStoreId, 'currentStoreId')
      mainWindow.loadURL(
        `https://${params.host}/webchat/conversations?'${new Date().getTime()}`
      )
      //   https://seller.shopee.com.my/account/signin?next=%2Fwebchat%2Fconversations
      break
    case 'SET_COOKIES':
      if (params.key) {
        store.set(params.key, params.cookies)
        currentStoreId = params.key
      }
    case 'GET_COOKIES':
      let storeId = params.storeId
      //   console.log('storeId', storeId)
      break
    case 'TRANSLATION':
      let { sourceText, sourceLang } = params
      googleTr(sourceText, sourceLang).then((res) => {
        mainWindowNotifier('TRANSLATION_RESULT', { targetText: res })
      })
    default:
      break
  }
})

function mainWindowNotifier(type, params) {
  mainWindow.webContents.send('mainWindow-message', {
    type: type,
    params: params,
  })
}
