// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  //   BrowserView,
  session,
  ipcMain,
  net,
} = require('electron')
const needle = require('needle')

const Store = require('electron-store')
var mainWindow = null // 声明要打开的主窗口
var webView = null //装在外部web页面

const path = require('path')
const fs = require('fs')

app.on('ready', () => {
  // 设置窗口的高度和宽度
  mainWindow = new BrowserWindow({
    width: 1260,
    height: 780,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      //   devTools: false,
    },
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.loadURL('https://seller.my.shopee.cn/webchat/conversations')
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
  })

  //   var postData = JSON.stringify({
  //     test: '111',
  //   })
  var data = {
    file: '/home/johnlennon/walrus.png',
    content_type: 'image/png',
  }

  // the callback is optional, and needle returns a `readableStream` object
  // that triggers a 'done' event when the request/response process is complete.
  needle
    .post(
      'https://seller.shopee.com.my/api/v2/login/?SPC_CDS=c9882470-fcc1-4c6a-a297-7605cf841f03&SPC_CDS_VER=2',
      data,
      { multipart: true }
    )
    .on('readable', function (res) {
      //   console.log(res)
    })
    .on('done', function (err, resp) {
      console.log('Ready-o!', resp)
    })

  mainWindow.webContents.openDevTools()
})

// 监听渲染线程消息
ipcMain.on('inject-message', (e, args) => {
  console.log('inject message', 'params:', args)
  let { type, params } = args
  switch (type) {
    case 'LOAD_PAGE':
      mainWindow.loadURL(`https://${params}/webchat/conversations`)
      break
    case 'SET_COOKIES':
      let store = new Store()
      store.set(params.key, params.cookies)
    default:
      break
  }
})
