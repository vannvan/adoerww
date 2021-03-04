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
const Lib = require('./utils/lib')

const path = require('path')
const fs = require('fs')

const storage = require('electron-localstorage')
storage.setStoragePath(path.join(__dirname, 'storage.json')) // stoage存储路径

const account = {
  341561079: {
    name: 'aimiao.my',
    password: 'Fm123456',
    storeId: '341561079',
    host: 'seller.shopee.com.my',
  },
  338011596: {
    name: 'mailing.my',
    password: 'maiwang123456',
    storeId: '338011596',
    host: 'seller.shopee.com.my',
  },
}

storage.setItem('accountList', account)

log.transports.file.level = true //是否输出到 日志文件
log.transports.console.level = false //是否输出到 控制台
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'

// 修改存取下列 URL 時使用的 User Agent。
const filter = {
  urls: ['https://*.shopee.cn/*', 'https://*.shopee.com.my/*'],
}

const googleTr = require('./utils/google-translate-server')

storage.setItem('storeId', 338011596)

const Store = require('electron-store')
let store = new Store()

var mainWindow = null // 声明要打开的主窗口
// var webView = null //装在外部web页面

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
      details.requestHeaders['user-agent'] =
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'
      callback({ requestHeaders: details.requestHeaders })
      //   log.info('request:', details.url)
      if (/offer\/count/.test(details.url)) {
        //   选中了某个聊天对象
        log.info('request: offer/count', details)
        let query = {}
        details.url.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (query[k] = v))
        mainWindowNotifier('CHECKED_SOMEBODY', query)
      }
    }
  )

  //   // 响应介入
  session.defaultSession.webRequest.onCompleted(filter, (details, callback) => {
    // if (/login/.test(details.url)) {
    //   log.info('response: login', details)
    // }
  })

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
        cookies: store.get(storage.getItem('storeId')),
        storeId: storage.getItem('storeId'),
        accountInfo: storage.getItem('accountList')[storage.getItem('storeId')],
      })
      loopSyncTask()
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

  //   const top = new BrowserWindow()
  const child = new BrowserWindow({ parent: mainWindow, show: false })
  child.loadURL('https://www.baidu.com/')
  child.on('ready-to-show', function (param) {
    log.info('child is ready show')
  })
  child.webContents.on('did-finish-load', function () {
    //
  })

  mainWindow.webContents.openDevTools()
})

// 监听渲染线程消息
ipcMain.on('inject-message', (e, args) => {
  log.info('inject message', 'params:', args)
  let { type, params } = args

  let store = new Store()
  switch (type) {
    case 'LOAD_PAGE':
      storage.setItem('storeId', params.storeId) // 更新当前操作的店铺ID
      log.info('storage storeId', storage.getItem('storeId'))
      //   如果拿到了storeId说明已授权，没有则需要用户自己登录，或者授权
      if (params && params.storeId) {
        mainWindow.loadURL(
          `https://${
            params.host
          }/webchat/conversations?'${new Date().getTime()}`
        )
      } else {
        log.error(
          'user not auth,will go to',
          `https://${params.host}/account/signin?next=%2Fwebchat%2Fconversations`
        )
        mainWindow.loadURL(
          `https://${params.host}/account/signin?next=%2Fwebchat%2Fconversations`
        )
      }
      //   https://seller.shopee.com.my/account/signin?next=%2Fwebchat%2Fconversations
      break
    case 'SET_COOKIES':
      if (params.key) {
        store.set(params.key, params.cookies)
      }
      break
    case 'TRANSLATION':
      let { sourceText, sourceLang } = params
      googleTr(sourceText, sourceLang)
        .then((resultText) => {
          log.info(
            'translation result:',
            resultText.map((el) => el[0]).join('')
          )
          mainWindowNotifier('TRANSLATION_RESULT', { targetText: resultText })
        })
        .catch((error) => {
          log.error('translation faild:', error)
        })
      break
    case 'SEND_MESSAGE': //发送消息操作
      sendMessage(params)
      break
    case 'ERROR_DIALOG': //错误提示
      dialog.showErrorBox('提示', params.content)
      break
    case 'SET_SHOPEE_AUTH_INFO': //把shopee的用户授权信息存起来
      if (params) {
        let {
          user: { id },
        } = params
        storage.setItem(id, params)
      }

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
  let { messageText, to_id, token, host, targetLang = 'en' } = params
  if (!messageText) {
    dialog.showErrorBox('提示', '请输入消息内容')
    return false
  }
  googleTr(messageText, 'zh-CN', targetLang)
    .then((resultText) => {
      log.info('translation result:', resultText.map((el) => el[0]).join(''))
      let data = {
        request_id: Lib.guid(),
        to_id: parseInt(to_id),
        type: 'text',
        content: { text: resultText.map((el) => el[0]).join('') },
        chat_send_option: {
          force_send_cancel_order_warning: false,
          comply_cancel_order_warning: false,
        },
      }
      log.info('send afterTranslation params:', data)
      axios({
        method: 'post',
        data: data,
        url: `https://${host}/webchat/api/v1.2/messages`,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then((res) => {
          log.info('send afterTranslation success', res.data)
          // 清除文本框
          mainWindowNotifier('CLEAR_TEXTAREA')
        })
        .catch((err) => {
          dialog.showErrorBox('提示', '发送失败，请重试')
          log.error('send afterTranslation faild', err.response.data)
        })
    })
    .catch((error) => {
      log.error('translation faild:', error)
    })
}

// 循环同步任务
function loopSyncTask(params) {
  setInterval(() => {
    let accountList = storage.getItem('accountList')
    Object.keys(accountList).map((el) => {
      if (storage.getItem(el)) {
        syncShopeeMessage({
          host: accountList[el].host,
          token: storage.getItem(el).token,
          userInfo: accountList[el],
        })
      }
    })
  }, 10000)
}

// 同步用户未读消息等
function syncShopeeMessage({ host, token, userInfo }) {
  log.info('sync shopee message', userInfo)
  axios({
    method: 'post',
    url: `https://${host}/webchat/api/v1.2/user/sync`,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((res) => {
      log.info('sync shopee message success', res.data)
    })
    .catch((error) => {
      log.error('sync shopee message error', error)
    })
}

function getCookie() {
  let res = document.cookie.split(';').map((el) => {
    return {
      key: el.split('=')[0],
      value: el.split('=')[1],
    }
  })
  console.log(JSON.stringify(res, null, 4))
}
