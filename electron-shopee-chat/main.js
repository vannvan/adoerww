// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  BrowserView,
  session,
  ipcMain,
  shell,
  dialog,
} = require('electron')
const axios = require('axios')
const log = require('electron-log')

log.transports.file.level = true //是否输出到 日志文件
log.transports.console.level = false //是否输出到 控制台

// 修改存取下列 URL 時使用的 User Agent。
const filter = {
  urls: ['https://*.shopee.cn/*', 'https://*.shopee.com.my/*'],
}

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
      log.info(cookies)
      //   if (cookies.length > 0) {
      //     let name = document.getElementById('name')
      //     name.value = cookies[0].value
      //     let password = document.getElementById('password')
      //     password.value = cookies[1].value
      //   }
    }
  )
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

  mainWindow.loadURL('https://seller.shopee.com.my/webchat/conversations?')
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  //请求介入
  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      callback({ requestHeaders: details.requestHeaders })
      //   log.info('request:', details.url)
      if (/offer\/count/.test(details.url)) {
        //   选中了某个聊天对象
        log.info('request:', details)
        let query = {}
        details.url.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (query[k] = v))
        mainWindowNotifier('CHECKED_SOMEBODY', query)
      }
    }
  )

  //   // 响应介入
  //   session.defaultSession.webRequest.onResponseStarted(
  //     filter,
  //     (details, callback) => {
  //       log.info('response:', details)
  //     }
  //   )

  mainWindow.webContents.on('did-finish-load', function () {
    log.info('load script ...')
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

  // 创建窗口监听
  mainWindow.webContents.on(
    'new-window',
    (event, url, frameName, disposition) => {
      if (disposition == 'new-window') {
        // log.info('new window', disposition, url)
        event.preventDefault()
        shell.openExternal(url)
      }
    }
  )

  mainWindow.webContents.openDevTools()
})

// 监听渲染线程消息
ipcMain.on('inject-message', (e, args) => {
  log.info('inject message', 'params:', args)
  let { type, params } = args
  let store = new Store()
  switch (type) {
    case 'LOAD_PAGE':
      currentStoreId = params.storeId
      log.info(currentStoreId, 'currentStoreId')
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
      //   log.info('storeId', storeId)
      break
    case 'TRANSLATION':
      let { sourceText, sourceLang } = params
      googleTr(sourceText, sourceLang).then((res) => {
        mainWindowNotifier('TRANSLATION_RESULT', { targetText: res })
      })
      break
    case 'SEND_MESSAGE':
      sendMessage(params)
      break
    default:
      break
  }
})

// 通知渲染进程
function mainWindowNotifier(type, params) {
  mainWindow.webContents.send('mainWindow-message', {
    type: type,
    params: params,
  })
}

function sendMessage(params) {
  let { messageText, to_id, token, host } = params
  if (!messageText) {
    dialog.showErrorBox('提示', '请输入消息内容')
    return false
  }
  googleTr(messageText, 'zh-CN', 'en').then((resultText) => {
    log.info(resultText.map((el) => el[0]).join(''))
    let data = {
      request_id: '9599694b-ccd1-46c8-b82c-441997b3c413cd3',
      to_id: parseInt(to_id),
      type: 'text',
      content: { text: resultText.map((el) => el[0]).join('') },
      chat_send_option: {
        force_send_cancel_order_warning: false,
        comply_cancel_order_warning: false,
      },
    }
    log.info(data)
    axios({
      method: 'post',
      data: data,
      url: `https://${host}/webchat/api/v1.2/messages`,
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        log.info(res.data, 'success')
        // 清除文本框
        mainWindowNotifier('CLEAR_TEXTAREA')
      })
      .catch((err) => {
        dialog.showErrorBox('提示', '发送失败，请重试')
        log.info(err.response.data)
      })
  })
}
