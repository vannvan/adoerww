// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  BrowserView,
  session,
  ipcMain,
  shell,
  dialog,
  Notification,
} = require('electron')
const axios = require('axios')
const log = require('electron-log')
const Lib = require('./utils/lib')

const path = require('path')
const fs = require('fs')
const googleTr = require('./utils/google-translate-server')

const storage = require('electron-localstorage')
storage.setStoragePath(path.join(__dirname, 'storage.json')) // stoage存储路径
// storage.setItem('accountList', account)
//   storage.setItem('isLogin', false)
log.transports.file.level = true //是否输出到 日志文件
log.transports.console.level = false //是否输出到 控制台
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'

storage.setItem('storeId', 338011596)

var mainWindow = null // 主窗口

function createBrowserWin() {
  // 设置窗口的高度和宽度
  mainWindow = new BrowserWindow({
    width: 980,
    height: 640,
    autoHideMenuBar: true,
    show: false,
    title: '马六甲虾皮聊聊客户端',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
    },
  })
  mainWindow
    .loadURL('https://test-erp.emalacca.com/')
    .then(() => {
      log.info('aa')
    })
    .catch((error) => {
      log.error(error)
    })
  //   mainWindow.loadFile('index.html')
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('did-finish-load', function () {
    log.info('load script ...')
    log.info('did-finish-load hook', mainWindow.webContents.getURL())
    let currentUrl = mainWindow.webContents.getURL()
    // 在erp网站需要植入脚本
    if (/192|emalacca/.test(currentUrl)) {
      const erpJs = fs
        .readFileSync(path.join(__dirname, './insert/erp-inject.js'))
        .toString()
      mainWindow.webContents.executeJavaScript(erpJs)
    }
    // 在虾皮网站需要植入的脚本
    if (/seller.shopee/.test(currentUrl)) {
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
          //   cookies: storage.getItem(storage.getItem('storeId')).cookies,
          storeId: storage.getItem('storeId'),
        })
        loopSyncTask()
      }, 100)
    }

    mainWindow.flashFrame(true)

    const myNotification = new Notification('Title', {
      body: 'Notification from the Renderer process',
    })

    myNotification.onclick = () => {
      console.log('Notification clicked')
    }
  })

  //   mainWindow.on('resize', function() {
  //     log.info('is login go to shopee', storage.getItem('isLogin'))
  //     if (storage.getItem('isLogin')) {
  //       mainWindow
  //         .loadURL('https://seller.shopee.com.my/webchat/conversations?')
  //         .then(() => {
  //           log.info('shopee is loaded')
  //         })
  //     }
  //   })

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
}

// 设置拦截
function setIntercept() {
  // 修改存取下列 URL 時使用的 User Agent。
  const filter = {
    urls: ['https://*.shopee.cn/*', 'https://*.shopee.com.my/*'],
  }
  const keyCookieNames = [
    'SPC_SC_TK', //32位id
    'SPC_EC', //长token
    'SPC_SC_UD', //shopid
    'SPC_U', //shopid
    'SPC_CDS', //guid
  ]
  const mailingCookie =
    'SPC_CDS=08b34455-a25d-49cd-ae60-2a566227c23a; SC_DFP=fYZpFLouE4vS4EnoY8YYf7qKsqKYhVIm; SPC_U=338011596; SPC_EC="7jvSo+OT/s4NJnT4krRF4YDCKJRihtDHaZlYxMLaGRsJU8yve0zAis/pkiVETfZQvkH2RMfwADyId8mtJ50Xn3et63o/g+EnOBqanPjUaoVWwxnumRbx5EZPtp1JZAl1cpbKs5NFnCQcEQ9tJkLb9f0nFl/VF9uHfvLcGV07kho="; CTOKEN=0I0zPIGDEeuBY%2FBj%2BUvzUw%3D%3D; SPC_SC_UD=341561079; SPC_SC_TK=f56db702d3edfb6d54e3eaba37d79c8e; SPC_EC=7jvSo+OT/s4NJnT4krRF4YDCKJRihtDHaZlYxMLaGRsJU8yve0zAis/pkiVETfZQvkH2RMfwADyId8mtJ50Xn3et63o/g+EnOBqanPjUaoVWwxnumRbx5EZPtp1JZAl1cpbKs5NFnCQcEQ9tJkLb9f0nFl/VF9uHfvLcGV07kho='
  const aimiaoCookie =
    'SPC_F=nVnWUKGDbXF01TKyvvqJdXMqIRg8KMyX; SC_SSO_U=-; SPC_SC_SA_UD=; SPC_WST="FbXjM5qdFnFhr2uoiTddStgERDsi87mlaP+EOZoPd2N7TZaqjHrknzvy1gB81mx5Qajz0H/D0ISKxvUH1V9lBNI7CFa1suf3VFpl9JDuN04uhiJFghvx3jlS/xMpNTg22962SXN0Dxosqe37ExSP/g1oVPKffXe4gUD1qh9ciz4="; SPC_U=341561079; SPC_EC="FbXjM5qdFnFhr2uoiTddStgERDsi87mlaP+EOZoPd2N7TZaqjHrknzvy1gB81mx5Qajz0H/D0ISKxvUH1V9lBNI7CFa1suf3VFpl9JDuN04uhiJFghvx3jlS/xMpNTg22962SXN0Dxosqe37ExSP/g1oVPKffXe4gUD1qh9ciz4="; SPC_STK="xn9tQ452lDwvyyuKOf8pH6quECymcXQzUq//olYvA1XdXTNnDndrWAA6ADu+kZg4qRG9uclMHJSBLqRyy7/+oTCPOM0StDJRgeiglJ7DNmeF/kjBLMI8r0vvrqzopIqT3EoSPkcxn/CRt294s0JWbKZOlLK5ic2TPSzana8b1FQ="; SC_SSO=-; SPC_SC_UD=341561079; SPC_SC_TK=acec1fa29aab11ab1fe4e0677a3bcc7a; SPC_SC_SA_TK=; SC_DFP=u8JXHV5DhSB6qVcWXhJfKPFeqEB81Q5b; '
  //请求介入
  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      details.requestHeaders['user-agent'] =
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'
      if (/shopee/.test(details.url)) {
        // let currentStoreId = String(storage.getItem('storeId')) // 当前所在的店铺
        // let currentStoreInfo = storage.getItem(currentStoreId)
        // let currentStoreCookies = currentStoreInfo.cookies
        // details.requestHeaders['authorization'] =
        //   'Bearer ' + currentStoreInfo.token
        // details.requestHeaders['cookie'] =
        //   currentStoreId == '341561079' ? aimiaoCookie : mailingCookie
        // //   .replace(/"/g, '')
        // //   .replace(/{|}/g, '')
        // //   .replace(/:/g, '=')
        // //   .replace(/,/g, ';')
        // details.requestHeaders['x-s'] = '089986cd32e608575a81d17cefe9d408'
        // details.requestHeaders['x-v'] = '4'
        // log.info(
        //   'set shopee user auth:',
        //   currentStoreId,
        //   'token:',
        //   currentStoreInfo.token,
        //   'cookie:',
        //   details.requestHeaders['cookie']
        // )
        log.info('storage id', storage.getItem('storeId'))
      }
      log.info('request:', details.url)
      callback({ requestHeaders: details.requestHeaders })
      if (/offer\/count/.test(details.url)) {
        //   选中了某个聊天对象
        log.info('request: offer/count', details)
        let query = {}
        details.url.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (query[k] = v))
        mainWindowNotifier('CHECKED_SOMEBODY', query)
      }
    }
  )

  //响应介入
  session.defaultSession.webRequest.onCompleted(filter, (details, callback) => {
    // if (/login/.test(details.url)) {
    //   log.info('response: login', details)
    // }
  })
}

// 监听渲染进程消息
function injectMessageMonitor() {
  // 监听渲染线程消息
  ipcMain.on('inject-message', (e, args) => {
    log.info('inject message', 'params:', args)
    let { type, params } = args
    switch (type) {
      case 'CHANGE_STORE':
        // storage.setItem('storeId', params.storeId) // 更新当前操作的店铺ID
        // log.info('storage storeId', storage.getItem('storeId'))
        //   如果拿到了storeId说明已授权，没有则需要用户自己登录，或者授权
        // if (params && params.storeId) {
        //   mainWindow.loadURL(
        //     `https://${
        //       params.host
        //     }/webchat/conversations?'${new Date().getTime()}`
        //   )
        // } else {
        //   log.error(
        //     'user not auth,will go to',
        //     `https://${params.host}/account/signin?next=%2Fwebchat%2Fconversations`
        //   )
        //   mainWindow.loadURL(
        //     `https://${params.host}/account/signin?next=%2Fwebchat%2Fconversations`
        //   )
        // }
        //   https://seller.shopee.com.my/account/signin?next=%2Fwebchat%2Fconversations
        break
      case 'TRANSLATION': // 翻译
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
          //   storage.setItem(id, params)
        }
        break
      case 'SET_ERP_AUTH': //erp授权
        if (params) {
          storage.setItem('isLogin', true)
          storage.setItem('erpAuth', params)
          mainWindow
            .loadURL('https://seller.shopee.com.my/webchat/conversations?')
            .then(() => {
              log.info('shopee is loaded')
            })
            .catch((err) => {
              log.error(err)
            })
          mainWindow.setSize(1366, 780)
          mainWindow.center()
        }
        break
      default:
        break
    }
  })
}

// 给渲染进程发送消息
function mainWindowNotifier(type, params) {
  log.info('mainWindow-message', type, params)
  mainWindow.webContents.send('mainWindow-message', {
    type: type,
    params: params,
  })
}

// 调用虾皮发送消息接口
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

//初始化客户端配置
function initClientConfig() {}

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

app.on('ready', () => {
  createBrowserWin()
  setIntercept()
  injectMessageMonitor()
})
