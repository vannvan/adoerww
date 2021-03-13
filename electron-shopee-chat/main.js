// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  session,
  ipcMain,
  shell,
  dialog,
  BrowserView,
  Notification,
  Menu,
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
//   storage.setItem('erpAuthStatus', false)
log.transports.file.level = true //是否输出到 日志文件
log.transports.console.level = true //是否输出到 控制台

// console.log(log.transports.file.file)  //日志路径

log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'

var mainWindow = null // 主窗口
// app.dock.hide() //mac隐藏菜单
Menu.setApplicationMenu(null) //windows隐藏菜单

fs.readFile(log.transports.file.file, function (err, data) {
  if (err) {
    return console.error(err)
  }
  //   console.log('异步读取: ' + data.toString())
})

async function createBrowserWin() {
  // 设置窗口的高度和宽度
  mainWindow = new BrowserWindow({
    width: 980,
    height: 640,
    minWidth: 980,
    minHeight: 640,
    autoHideMenuBar: true,
    show: false,
    title: '马六甲虾皮聊聊客户端',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
    },
  })

  if (!erpAuthValid()) {
    storage.setItem('erpAuthStatus', 1)
    mainWindow.loadURL('https://test-erp.emalacca.com/')
  } else {
    await loadDefaultStoreChat()
  }

  //   mainWindow.loadFile('index.html')
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('did-finish-load', function () {
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
    if (/seller\.shopee/.test(currentUrl)) {
      const js = fs
        .readFileSync(path.join(__dirname, './insert/inject.js'))
        .toString()
      const css = fs
        .readFileSync(path.join(__dirname, './insert/inject.min.css'))
        .toString()
      mainWindow.webContents.executeJavaScript(js)
      mainWindow.webContents.insertCSS(css)

      setTimeout(() => {
        // loopSyncTask()
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

  mainWindow.webContents.on('dom-ready', function () {
    console.log('dom-ready')
    mainWindowNotifier('SET_STORAGE', {
      a: 1,
    })
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

  //   dialog.showOpenDialogSync({
  //       title:"日志上传",
  //       defaultPath:log.transports.file.file,
  //       buttonLabel:'确认上传'
  //   })

  mainWindow.on('close', (e) => {
    dialog.showMessageBox(
      {
        type: 'info',
        title: 'Information',
        defaultId: 0,
        message: '确定要关闭吗？',
        buttons: ['最小化', '直接退出'],
      },
      (index) => {
        if (index === 0) {
          e.preventDefault() //阻止默认行为，一定要有
          mainWindow.minimize() //调用 最小化实例方法
        } else {
          mainWindow = null
          //app.quit();	//不要用quit();试了会弹两次
          app.exit() //exit()直接关闭客户端，不会执行quit();
        }
      }
    )
  })

  mainWindow.webContents.openDevTools()
}

// 设置拦截
async function setIntercept() {
  // 修改存取下列 URL 時使用的 User Agent。
  const filter = {
    urls: ['https://*.shopee.cn/*', 'https://*.shopee.com.my/*'],
  }

  //请求介入
  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      //   log.info('request:', details.url)
      details.requestHeaders['user-agent'] =
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'
      if (/shopee|xiapibuy/.test(details.url)) {
        let authedStore = storage.getItem('authedStore') //已授权的店铺列表
        let currentStoreId = String(storage.getItem('storeId')) // 当前所在的店铺
        let currentStoreInfo = authedStore[currentStoreId]
        let currentStoreCookies = currentStoreInfo.cookies
        details.requestHeaders['authorization'] =
          'Bearer ' + currentStoreInfo.token
        details.requestHeaders['cookie'] = currentStoreCookies
        details.requestHeaders['x-s'] = '089986cd32e608575a81d17cefe9d408'
        details.requestHeaders['x-v'] = '4'
        if (/login/.test(details.url)) {
          log.info(
            '======================shopee user auth action start======================'
          )
          log.info(
            'shopee user auth action:',
            'storage storeId:',
            currentStoreId,
            'token:',
            currentStoreInfo.token,
            'cookie:',
            details.requestHeaders['cookie']
          )
          log.info(
            '======================shopee user auth action end  ======================'
          )
        }
      }
      callback({ requestHeaders: details.requestHeaders })
      if (/offer\/count/.test(details.url)) {
        //   选中了某个聊天对象
        log.info('request: offer/count', details.url)
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
async function injectMessageMonitor() {
  // 监听渲染线程消息
  ipcMain.on('inject-message', (e, args) => {
    log.info('inject message', 'params:', args)
    let { type, params } = args
    switch (type) {
      case 'CHANGE_STORE':
        storage.setItem('storeId', params.storeId) // 更新当前操作的店铺ID
        storage.setItem('currentSite', params.key) //当前站点
        //如果拿到了storeId说明已授权，没有则需要用户自己登录，或者授权
        if (params && params.storeId) {
          mainWindow
            .loadURL(
              `https://${
                params.host
              }/webchat/conversations?'${new Date().getTime()}`
            )
            .then(() => {
              log.info('load new store chat success')
            })
            .catch((error) => {
              dialog.showErrorBox('提示', '切换店铺失败，请稍后重试')
              log.error(error)
            })
        }
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
            dialog.showErrorBox('提示', '翻译服务异常，请稍后重试')
            log.error('translation faild:', error)
          })
        break
      case 'SEND_MESSAGE': //发送消息操作
        sendMessage(params)
        break
      case 'ERROR_DIALOG': //错误提示
        dialog.showErrorBox('提示', params.content)
        break
      case 'SET_ERP_AUTH': //erp授权
        if (params) {
          storage.setItem('erpAuthStatus', 1)
          params.expires_time = Date.parse(new Date()) / 1000 + 604800 //授权过期的具体时间
          storage.setItem('erpAuth', params)
          loadDefaultStoreChat()
        }
        break
      case 'ERP_LOGOUT': // erp退出
        storage.setItem('erpAuthStatus', -1)
        storage.setItem('erpAuth', '')
        session.defaultSession.clearStorageData({
          origin: 'https://test-erp.emalacca.com',
        })
        mainWindow.webContents.loadURL(
          'https://test-erp.emalacca.com/auth/login'
        )
        break
      case 'ADD_STORE': //添加店铺
        const child = new BrowserWindow({
          parent: mainWindow,
          show: false,
          maximizable: false,
          minimizable: false,
        })
        child.loadURL('https://www.baidu.com/')
        child.once('ready-to-show', () => {
          child.show()
        })
        break
    }
  })
}

//检查erp授权状态
function erpAuthValid() {
  log.info('check erp auth status')
  try {
    let erpAuthInfo = storage.getItem('erpAuth')
    // erpAuthInfo = JSON.parse(erpAuthInfo)
    let { expires_time } = erpAuthInfo
    log.info('erp auth expires_time', expires_time)
    let currentTime = Date.parse(new Date()) / 1000
    //说明token没过期
    return expires_time && expires_time > currentTime
  } catch (error) {
    log.error(error)
    return false
  }
}

//加载默认聊天窗口
async function loadDefaultStoreChat() {
  mainWindow
    .loadURL('https://seller.shopee.com.my/webchat/conversations?')
    .then(() => {
      log.info('shopee is loaded')
    })
    .catch((err) => {
      dialog.showErrorBox('提示', '加载聊天室窗口失败，请重启应用程序')
      log.error(err)
    })
  mainWindow.setSize(1366, 780)
  mainWindow.setMinimumSize(1366, 780)
  mainWindow.center()
}

// 给渲染进程发送消息
async function mainWindowNotifier(type, params) {
  log.info('mainWindow-message', type, params)
  mainWindow.webContents.send('mainWindow-message', {
    type: type,
    params: params,
  })
}

// 调用虾皮发送消息接口
async function sendMessage(params) {
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
      dialog.showErrorBox('提示', '翻译服务异常，请稍后重试')
      log.error('translation faild:', error)
    })
}

// 循环同步任务
async function loopSyncTask() {
  setInterval(async () => {
    let authedStore = storage.getItem('authedStore') //已授权的店铺列表
    log.info(
      '======================shopee sync message start ======================'
    )
    let syncResult = await Promise.all(
      Object.keys(authedStore).map(async (key) => {
        let result = await syncShopeeMessage({
          host: authedStore[key].host,
          token: authedStore[key].token,
          userInfo: authedStore[key].storeName,
        })
        return result
      })
    )
    log.info('sync result:', JSON.stringify(syncResult))
    log.info(
      '======================shopee sync message end   ======================'
    )
  }, 10000)
}

// 同步用户未读消息等
async function syncShopeeMessage({ host, token, userInfo }) {
  log.info('sync one user message:', userInfo)
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `https://${host}/webchat/api/v1.2/user/sync`,
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        resolve(res.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const account = {
  341561079: {
    name: 'aimiao.my',
    password: 'Fm123456',
    storeId: '341561079',
    host: 'seller.shopee.com.my',
    cookies:
      'SPC_F=nVnWUKGDbXF01TKyvvqJdXMqIRg8KMyX; SC_SSO_U=-; SPC_SC_SA_UD=; SPC_WST="FbXjM5qdFnFhr2uoiTddStgERDsi87mlaP+EOZoPd2N7TZaqjHrknzvy1gB81mx5Qajz0H/D0ISKxvUH1V9lBNI7CFa1suf3VFpl9JDuN04uhiJFghvx3jlS/xMpNTg22962SXN0Dxosqe37ExSP/g1oVPKffXe4gUD1qh9ciz4="; SPC_U=341561079; SPC_EC="FbXjM5qdFnFhr2uoiTddStgERDsi87mlaP+EOZoPd2N7TZaqjHrknzvy1gB81mx5Qajz0H/D0ISKxvUH1V9lBNI7CFa1suf3VFpl9JDuN04uhiJFghvx3jlS/xMpNTg22962SXN0Dxosqe37ExSP/g1oVPKffXe4gUD1qh9ciz4="; SPC_STK="xn9tQ452lDwvyyuKOf8pH6quECymcXQzUq//olYvA1XdXTNnDndrWAA6ADu+kZg4qRG9uclMHJSBLqRyy7/+oTCPOM0StDJRgeiglJ7DNmeF/kjBLMI8r0vvrqzopIqT3EoSPkcxn/CRt294s0JWbKZOlLK5ic2TPSzana8b1FQ="; SC_SSO=-; SPC_SC_UD=341561079; SPC_SC_TK=acec1fa29aab11ab1fe4e0677a3bcc7a; SPC_SC_SA_TK=; SC_DFP=u8JXHV5DhSB6qVcWXhJfKPFeqEB81Q5b; ',
  },
  338011596: {
    name: 'mailing.my',
    password: 'maiwang123456',
    storeId: '338011596',
    host: 'seller.shopee.com.my',
    cookies:
      'SPC_CDS=f5e4bd41-43bd-4825-870a-f4ae5bc712a5; SPC_U=338011596; SPC_EC="UxDhcBBAOu50L/7HdmHV2saKaQ4mEkBQRIbpKi5/rIoXrkGaFimUrOvvlWk6/G879RTCdkHTXQhmfEGKr2ffC42qtd+Z9z2N8anp/TP3pXfpZk9bKWC4V39FPneHA67+sJc+79V/DsKo6OqGPas3cz0kDkfQxsQqdsnSURpSfNg="; SPC_SC_UD=338011596; SPC_SC_TK=322e85911d362213ab22d5dde250cc62',
  },
}

app.on('ready', () => {
  createBrowserWin()
  setIntercept()
  injectMessageMonitor()
  //   showNotification()
})

function showNotification() {
  const notification = {
    title: 'Basic Notification',
    body: 'Notification from the Main process',
  }
  new Notification(notification).show()
}
