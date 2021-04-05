// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  session,
  ipcMain,
  shell,
  dialog,
  BrowserView,
  Menu,
  Tray,
  nativeImage,
} = require('electron')

const axios = require('axios')
const log = require('electron-log')
const Lib = require('./utils/lib')
const server = require('./utils/server')
const API = require('./utils/api.conf')

const path = require('path')
const fs = require('fs')
const googleTr = require('./utils/google-translate-server')
const storage = require('electron-localstorage')
const updateHandle = require('./utils/autoUpdater')

const SiteConfig = require('./conf/site')

storage.setStoragePath('./storage.json') // stoage存储路径
console.log(storage.getStoragePath())
log.transports.file.level = true //是否输出到 日志文件
log.transports.console.level = true //是否输出到 控制台

// console.log(log.transports.file.file)  //日志路径
let isDev = process.argv[2] ? process.argv[2] == 'dev' : false
// let isDev = false

log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'

var mainWindow = null // 主窗口
var childWindow = null //子窗口
var onlineStatusWindow = null //网络断开提示的子窗口
var appIcon = null //托盘
var messageFlag = true //托盘消息提示flag
var messageTimer //托盘消息计时
var messageQuene //消息队列
const erpSystem = 'https://pre-erp.emalacca.com'
var loopSyncTaskTimter = null //

const Store = require('electron-store')
let store = new Store({})
store.set('isDev', isDev)
store.set('siteConfig', SiteConfig)
store.set(
  'noticeSounds',
  'https://downsc.chinaz.net/Files/DownLoad/sound1/202012/13724.mp3'
)
//如果没有通知声音的配置就初始化
if (store.get('noticeEnable') == undefined) {
  store.set('noticeEnable', true)
}

// axios.defaults.timeout = 10000 //设置超时时间,单位毫秒

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    let originalRequest = error.config
    if (
      error.code === 'ECONNABORTED' &&
      error.message.indexOf('timeout') !== -1 &&
      !originalRequest._retry
    ) {
      //   // eslint-disable-next-line
      //   if (mainWindow) {
      //     mainWindowNotifier({
      //       type: 'ERROR_ALERT',
      //       params: '网络超时',
      //     })
      //   }
    }
    return Promise.reject(error)
  }
)
// app.dock.hide() //mac隐藏菜单
Menu.setApplicationMenu(null) //windows隐藏菜单

/*
  安全性：
  https://www.electronjs.org/docs/tutorial/security
  webSecurity: 禁用掉了浏览器的跨域安全特性（同源策略）, 导致报警告
  屏蔽警告安全性提醒
*/
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

fs.readFile(log.transports.file.file, function (err, data) {
  if (err) {
    return console.error(err)
  }
  //   console.log('异步读取: ' + data.toString())
})

async function createBrowserWindow() {
  // 设置窗口的高度和宽度
  mainWindow = new BrowserWindow({
    width: 980,
    height: 640,
    minWidth: 980,
    minHeight: 640,
    autoHideMenuBar: true,
    show: false,
    title: '马六甲虾皮聊聊客户端',
    minimizable: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      preload: path.join(__dirname, './utils/lib.js'),
    },
  })

  if (!erpAuthValid()) {
    storage.setItem('erpAuthStatus', 1)
    mainWindow.loadURL(`${erpSystem}/auth/login`)
  } else {
    tryToGetAuthedStore('init').then(() => {
      log.info('checkauth finished')
      loadDefaultStoreChat()
    })
  }

  //   mainWindow.loadFile('index.html')
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    let feedUrl = 'https://test2-erp.emalacca.com/chat/'
    updateHandle.init(mainWindow, feedUrl)
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
    if (/seller\.(\S*)\.shopee/.test(currentUrl)) {
      const js = fs
        .readFileSync(path.join(__dirname, './insert/inject.js'))
        .toString()
      const css = fs
        .readFileSync(path.join(__dirname, './insert/inject.min.css'))
        .toString()
      const styles = fs
        .readFileSync(path.join(__dirname, './styles/toast.min.css'))
        .toString()

      mainWindow.webContents.executeJavaScript(js)
      mainWindow.webContents.insertCSS(css)
      mainWindow.webContents.insertCSS(styles)

      setTimeout(() => {
        loopSyncTask()
      }, 60000)
    }
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  //   dialog.showOpenDialogSync({
  //       title:"日志上传",
  //       defaultPath:log.transports.file.file,
  //       buttonLabel:'确认上传'
  //   })

  mainWindow.on('close', e => {
    // 先阻止默认功能的调用，否则会关闭窗口
    e.preventDefault()
    dialog
      .showMessageBox(mainWindow, {
        type: 'warning',
        title: '虾皮聊聊客户端',
        message: '确定要关闭吗？',
        buttons: ['最小化', '直接退出'],
      })
      .then(index => {
        if (index.response === 1) {
          mainWindow = null
          app.exit()
        } else {
          mainWindow.minimize()
        }
      })
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

function getShopeeAuth() {
  let currentStoreId = String(store.get('currentStore'))
  let authedStore = storage.getItem('authedStore')
  let storeMenuList = store.get('storeMenuList')
  if (!storeMenuList && !authedStore) {
    return null
  } else {
    if (authedStore[currentStoreId]) {
      return {
        token: authedStore[currentStoreId].token,
        cookie: authedStore[currentStoreId].cookieStr,
      }
    } else if (store.get('storeMenuList')) {
      storeMenuList = Lib.flat(
        store.get('storeMenuList').map(el => el.storeList)
      )
      let shopInfo = storeMenuList.find(item => item.shopId == currentStoreId)
      if (shopInfo) {
        return {
          token: shopInfo.tk.token,
          cookie: shopInfo.tk.cookieStr,
        }
      } else {
        return null
      }
    } else {
      return null
    }
  }
}

// 设置拦截
async function setIntercept() {
  // 修改存取下列 URL 時使用的 User Agent。
  const filter = {
    urls: [
      'https://*.shopee.cn/*',
      'https://*.shopee.com.my/*',
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
      '*://shopee.com.br/*',
      '*://*.shopee.com.br/*',
      '*://shopee.com/*',
      '*://*.shopee.com/*',
    ],
  }

  //请求介入
  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      details.requestHeaders['user-agent'] =
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'
      if (/shopee|xiapibuy/.test(details.url)) {
        try {
          if (getShopeeAuth()) {
            details.requestHeaders['authorization'] =
              'Bearer ' + getShopeeAuth().token
            details.requestHeaders['cookie'] = getShopeeAuth().cookie
            details.requestHeaders['x-s'] = '089986cd32e608575a81d17cefe9d408'
            details.requestHeaders['x-v'] = '4'
          } else {
            log.error(
              'getShopeeAuth error:',
              getShopeeAuth(),
              'url:',
              details.url
            )
          }
        } catch (error) {
          store.set('currentStore', null)
          store.set('currentSite', null)
          loadDefaultStoreChat()
          log.error('currentStore', String(store.get('currentStore')), error)
        }
      }
      //避免跳转到虾皮的登录页
      if (/account\/signin\?next=/.test(details.url)) {
        store.set('currentStore', null)
        store.set('currentSite', null)
        loadDefaultStoreChat()
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
  ipcMain.on('inject-message', async (e, args) => {
    log.info('inject message', 'params:', args)
    let { type, params } = args
    switch (type) {
      case 'CHANGE_STORE': //切换店铺
        store.set('currentStore', params.storeId) // 更新当前操作的店铺ID
        store.set('currentSite', params.key) //当前站点
        try {
          //   let loadingWindow = new BrowserWindow({
          //     show: false,
          //     maximizable: false,
          //     width: mainWindow.getSize()[0],
          //     height: mainWindow.getSize()[1],
          //     minimizable: false,
          //     parent: mainWindow,
          //     webPreferences: {
          //       nodeIntegration: true,
          //       webSecurity: false,
          //       contextIsolation: false,
          //       preload: path.join(__dirname, './utils/lib.js'),
          //     },
          //   })
          //   let url = `file://${__dirname}/empty-page/index.html`
          //   loadingWindow.loadURL(url)
          //   loadingWindow.setAlwaysOnTop(true)
          //   loadingWindow.once('ready-to-show', () => {
          //     loadingWindow.show()
          //     mainWindow.hide()
          //   })
          //   如果拿到了storeId说明已授权，没有则需要用户自己登录，或者授权
          if (getShopeeAuth()) {
            mainWindow
              .loadURL(
                `https://${params.host}/webchat/conversations?storeId=${params.storeId}&site=${params.key}`
              )
              .then(() => {
                log.info('load new store chat success')
              })
              .catch(error => {
                log.error(error)
                dialog.showErrorBox('提示', '切换店铺失败，请稍后重试')
              })
          } else {
            dialog.showErrorBox('提示', '授权过期，请重新授权')
          }
        } catch (error) {
          dialog.showErrorBox(
            '提示',
            '当前店铺未正式授权，请完成授权后进行操作'
          )
        }
        break
      case 'TRANS_TEXT': // 翻译文本
        handleTranslation(params)
        break

      case 'UPLOAD_IMAGE': //上传图片
        handleUploadImage(params)
        break
      case 'SET_ERP_AUTH': //erp授权
        if (params) {
          storage.setItem('erpAuthStatus', 1)
          params.expires_time = Date.parse(new Date()) / 1000 + 604800 //授权过期的具体时间
          storage.setItem('erpAuth', params)
          tryToGetAuthedStore('init').then(() => {
            console.log('checkauth finished')
            loadDefaultStoreChat()
          })
        }
        break
      case 'ERP_LOGOUT': // erp退出
        storage.setItem('erpAuthStatus', -1)
        storage.setItem('erpAuth', null)
        store.set('storeMenuList', null)
        store.set('currentStore', null)
        store.set('currentSite', null)
        session.defaultSession.clearStorageData({
          origin: erpSystem,
        })
        mainWindow.webContents.loadURL(`${erpSystem}/auth/login`).then(() => {
          mainWindow.setMinimumSize(980, 640)
          mainWindow.setSize(980, 640)
          mainWindow.center()
        })

        break
      case 'ADD_STORE': //添加店铺
        if (childWindow && !childWindow.isDestroyed()) {
          childWindow.show()
        } else {
          createChildWindow()
        }
        break
      case 'CLOSE_CHILD_WINDOW': //关闭子窗口
        childWindow.close()
        break
      case 'REMOVE_BIND_STORE': //解绑店铺
        removeBindStore(params)
        break
      case 'SUCCESS_ADD_STORE': //添加店铺成功
        setTimeout(() => {
          childWindow.close()
        }, 2000)
        tryToGetAuthedStore('add').then(() => {
          console.log('checkauth finished')
          loadDefaultStoreChat()
        })
        break
      case 'HANDLE_IMPORT_FILE': //导入文件
        dialog
          .showOpenDialog({
            title: '请选择导入的文件',
            buttonLabel: '导入文件',
            properties: ['openFile'],
            securityScopedBookmarks: true,
            filters: [{ name: 'excel', extensions: ['xls', 'xlsx'] }],
          })
          .then(result => {
            // 点击导入文件
            console.log(result, 'result')
            if (!result.canceled) {
              API.importStoreFile(result.filePaths[0])
            }
          })
          .catch(err => {
            console.log(err)
          })
        break
      case 'MODIFY_ALIAS_NAME': //修改店铺别名
        modifyAliasName(params)
        break
      case 'RE_AURH': //重新授权
        if (childWindow && !childWindow.isDestroyed()) {
          childWindow.close()
        }
        createChildWindow(params)
    }
  })
}

async function createChildWindow(defaultParams = null) {
  childWindow = new BrowserWindow({
    show: false,
    maximizable: false,
    width: 540,
    height: 360,
    minimizable: false,
    title: '添加店铺',
    icon: '',
    frame: false,
    modal: true,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true, // 是否启用node集成
      enableRemoteModule: true, // 是否启用remote模块
    },
  })
  childWindow.setMinimumSize(540, 360)

  //   childWindow.on('blur', function () {
  //     childWindow.hide()
  //   })
  let url = `file://${__dirname}/components/add-store/addStore.html`
  if (defaultParams) {
    let p = Lib.objectToQueryString(defaultParams)
    url = url + '?' + p
  }
  // childWindow.setAlwaysOnTop(true)
  childWindow.loadURL(url)
  childWindow.once('ready-to-show', () => {
    childWindow.show()
  })
  if (isDev) {
    childWindow.webContents.openDevTools()
  }
}

//翻译文本
/**
 * @param type  send|receive 发送或者接收
 * @param messageText 待翻译的文本
 * @param targetLang 目标语言
 */
async function handleTranslation({ type, messageText, targetLang }) {
  log.info('translation start')
  if (!messageText) {
    dialog.showErrorBox('提示', '请输入消息内容')
    return false
  }
  let sourceLang = type == 'send' ? 'zh-CN' : 'auto'
  googleTr(messageText, sourceLang, targetLang)
    .then(resultText => {
      log.info('translation result:', resultText.map(el => el[0]).join(''))
      let result = resultText.map(el => el[0]).join('')
      if (type == 'send') {
        mainWindowNotifier('REPLACE_TEXTAREA', result) //替换textarea
      } else {
        mainWindowNotifier('TRANSLATION_RESULT', {
          targetText: JSON.stringify(resultText),
        })
      }
    })
    .catch(error => {
      log.error('handleTranslation error:', error)
      dialog.showErrorBox('提示', '翻译服务异常，请稍后重试')
    })
}

// 检查erp授权状态
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
    log.error('erpAuthValid error:', error)
    return false
  }
}

// 加载默认聊天窗口
function loadDefaultStoreChat() {
  let mainWindowDefaultPage = `file://${__dirname}/empty-page/index.html`
  let currentSite = store.get('currentSite')
  let currentStore = store.get('currentStore')
  if (currentSite && currentStore) {
    mainWindowDefaultPage = `https://${
      store.get('siteConfig.shopeeSeller')[currentSite].host
    }/webchat/conversations`
  }
  log.info('mainWindowDefaultPage', mainWindowDefaultPage)
  mainWindow
    .loadURL(mainWindowDefaultPage)
    .then(() => {
      log.info('shopee is loaded')
      mainWindow.setSize(1366, 780)
      mainWindow.setMinimumSize(1366, 780)
      mainWindow.center()
    })
    .catch(err => {
      log.error('loadDefaultStoreChat error:', err)
      //   mainWindow.reload()
      //   reloadWindow(mainWindow)
      //   app.relaunch()
      dialog.showErrorBox('提示', '加载聊天室窗口失败，请重启应用程序')
      app.exit(0)
    })
}

function reloadWindow(mainWin) {
  if (mainWin.isDestroyed()) {
    app.relaunch()
    app.exit(0)
  } else {
    BrowserWindow.getAllWindows().forEach(w => {
      if (w.id !== mainWin.id) w.destroy()
    })
    mainWin.reload()
  }
}

// 给渲染进程发送消息
async function mainWindowNotifier(type, params) {
  log.info('mainWindow-message', type, params)
  mainWindow.webContents.send('mainWindow-message', {
    type: type,
    params: params,
  })
}

// 循环同步任务
async function loopSyncTask() {
  loopSyncTaskTimter = setInterval(async () => {
    let authedStore = storage.getItem('authedStore') //已授权的店铺列表
    if (Object.keys(authedStore) == 0) {
      clearInterval(loopSyncTaskTimter)
    }
    log.info(
      '======================shopee sync message start ======================'
    )
    let syncResult = await Promise.all(
      Object.keys(authedStore).map(async key => {
        let result = await syncShopeeMessage(authedStore[key], key)
        return result
      })
    )
    let haveNewMessage = Lib.compare(messageQuene, syncResult) //本次消息和上次消息对比
    try {
      let unreadMessageCount = syncResult
        .filter(Boolean)
        .map(el => el.unread_message_count)
        .reduce((prev, curr) => prev + curr)

      // 如果未读消息大于1且本次消息和上次消息不同
      if (unreadMessageCount > 0 && !haveNewMessage) {
        messageQuene = syncResult //覆盖上次消息
        mainWindow.flashFrame(true) //窗口闪动
        messageTimer = setInterval(() => {
          messageFlag = !messageFlag
          if (messageFlag && appIcon) {
            appIcon.setImage(nativeImage.createEmpty())
          } else {
            appIcon.setImage(path.join(__dirname, 'dark-logo.png'))
          }
        }, 650)

        mainWindowNotifier('NEW_MESSAGE', {
          noticeEnable: store.get('noticeEnable'),
          messageList: syncResult.filter(item => item.unread_count),
        })
      }
      //如果没有未读消息就停止通知
      if (!unreadMessageCount && appIcon) {
        messageFlag = true
        appIcon.setImage(path.join(__dirname, 'dark-logo.png'))
        clearInterval(messageTimer)
      }
    } catch (error) {
      log.error('loopSyncTask error:', error)
    }
    log.info('sync result:', JSON.stringify(syncResult))
    log.info(
      '======================shopee sync message end   ======================'
    )
  }, 60000)
}

// 同步用户未读消息等
async function syncShopeeMessage(storeInfo, key) {
  let { token, user } = storeInfo
  if (!store.get('storeMenuList')) {
    return false
  }
  let storeMenuList = Lib.flat(
    store.get('storeMenuList').map(el => el.storeList)
  )
  let storeInfoMatch = storeMenuList.find(el => el.shopId == key)
  if (!storeInfoMatch) {
    return false
  }
  let host = store.get(
    `siteConfig.shopeeSeller.${storeInfoMatch.countryCode}.host`
  )
  log.info(
    'url:',
    `https://${host}/webchat/api/v1.2/user/sync`,
    'someone',
    JSON.stringify(user)
  )
  return new Promise((resolve, reject) => {
    axios({
      url: `https://${host}/webchat/api/v1.2/user/sync`,
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => {
        // let { cookies, token, password, ...storeBaseInfo } = storeInfo
        resolve(Object.assign({ storeId: key }, res.data))
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 解绑店铺
async function removeBindStore(storeId) {
  server
    .handleRemoveBindStore(storeId)
    .then(result => {
      if (result) {
        //setp1 先移除当前涉及当前店铺的token
        let authedStore = storage.getItem('authedStore')
        authedStore = delete authedStore[storeId]
        storage.setItem(authedStore)

        let storeMenuList = Lib.flat(
          store.get('storeMenuList').map(el => el.storeList)
        )

        // step2 重置选中店铺
        try {
          let fisrtIndex = storeMenuList.findIndex(
            el => el.shopId && el.countryCode
          )
          let { countryCode, shopId } = storeMenuList[fisrtIndex]
          store.set('currentSite', countryCode)
          store.set('currentStore', shopId)
        } catch (error) {
          log.error('重置店铺', error)
          store.set('currentStore', null)
        }

        //step3 从菜单移除当前店铺
        let newMenuList = storeMenuList.filter(item => item.shopId != storeId)
        store.set('storeMenuList', Lib.groupStore(newMenuList))
        loadDefaultStoreChat()
        log.info('handleRemoveBindStore success')
      } else {
        mainWindowNotifier('HIDE_LOADING')
        dialog.showErrorBox('提示', '解绑失败，请稍后重试')
      }
    })
    .catch(error => {
      log.error(error)
      mainWindowNotifier('HIDE_LOADING')
      dialog.showErrorBox('提示', '解绑失败，请稍后重试')
    })
}

//修改别名
async function modifyAliasName(params) {
  API.handleModifyAliasName(params)
    .then(res => {
      if (res) {
        // 修改本地菜单列表中的店铺名称
        let storeMenuList = Lib.flat(
          store.get('storeMenuList').map(el => el.storeList)
        )
        storeMenuList.map(el => {
          if (el.shopId == params.storeId) {
            el.storeAlias = params.aliasName
          }
        })
        console.log(storeMenuList)
        store.set('storeMenuList', Lib.groupStore(storeMenuList))
        loadDefaultStoreChat()
      } else {
        mainWindowNotifier('HIDE_LOADING')
        dialog.showErrorBox('提示', '修改失败，请稍后重试')
      }
    })
    .catch(error => {
      log.error(error)
      mainWindowNotifier('HIDE_LOADING')
      dialog.showErrorBox('提示', '修改失败，请稍后重试')
    })
}

//检查店铺授权

/**
 * init 的时候只用判断本地是否有菜单列表
 * add 重新获取菜单列表和授权列表
 * modify 重新获取菜单列表和授权列表
 * remove 重新获取菜单列表和授权列表
 *
 * @param {*} type init|add|modify|remove
 */
async function tryToGetAuthedStore(type) {
  // 除了初始化之外都有页面，需要让用户知道在加载菜单列表
  if ((type = !'init')) {
    mainWindowNotifier('IS_LOADING_AUTHINFO')
  }
  const malacca_token = storage.getItem('erpAuth')
  let authedStore = storage.getItem('authedStore') || {} //已授权的店铺列表
  let storeMenuList = store.get('storeMenuList')
  if (malacca_token) {
    let storeList = await server.getAuthedAtore()
    log.info('storeMenuList 更新店铺列表', JSON.stringify(storeList))
    let auth = await server.getStoreAuthInfo()
    log.info('storeMenuList 更新token列表', JSON.stringify(auth))

    // if (!storeMenuList && type == 'init') {
    //   let store = await server.getAuthedAtore()
    //   log.error('storeMenuList 本地没有授权列表', JSON.stringify(store))
    // }

    // //如果不是初始化
    // if (type != 'init') {
    //   let store = await server.getAuthedAtore()
    //   log.error('storeMenuList 更新授权列表', JSON.stringify(store))
    //   let auth = await server.getStoreAuthInfo()
    //   log.error('storeMenuList 更新token列表', JSON.stringify(auth))
    // }

    // //在有店铺列表的情况下调获取token的接口
    // if (storeMenuList) {
    //   if (Object.keys(authedStore).length == 0) {
    //     let res = await server.getStoreAuthInfo()
    //     log.error('authedStore 本地没有授权信息', res)
    //   }

    //   let authedStoreExpires = storage.getItem('authedStoreExpires')
    //   let currentTime = Date.parse(new Date()) / 1000
    //   if (!authedStoreExpires || authedStoreExpires < currentTime) {
    //     let res = await server.getStoreAuthInfo()
    //     log.error('authedStore 已过期', res)
    //   }
    // }
  }
}

// 创建托盘
async function createTray() {
  try {
    appIcon = new Tray(path.join(__dirname, 'dark-logo.png'))
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '选项',
        submenu: [
          {
            label: '清除缓存',
            click: () => {
              storage.setItem('erpAuthStatus', -1)
              storage.clear()
              store.clear()
              session.defaultSession.clearStorageData({
                origin: erpSystem,
              })
              app.quit()
            },
          },
          {
            label: '消息通知',
            type: 'checkbox',
            checked: true,
            click: e => {
              //   console.log(e.checked)
              store.set('noticeEnable', e.checked)
            },
          },
          {
            type: 'checkbox',
            label: '开机启动',
            checked: app.getLoginItemSettings().openAtLogin,
            click: function () {
              if (!app.isPackaged) {
                app.setLoginItemSettings({
                  openAtLogin: !app.getLoginItemSettings().openAtLogin,
                  path: process.execPath,
                })
              } else {
                app.setLoginItemSettings({
                  openAtLogin: !app.getLoginItemSettings().openAtLogin,
                })
              }
              console.log(app.getLoginItemSettings().openAtLogin)
              console.log(!app.isPackaged)
            },
          },
          {
            label: '检查更新',
            click: () => {
              updateHandle.check()
            },
          },
        ],
      },
      {
        label: '😁 打开聊聊',
        click: () => {
          mainWindow.restore()
          mainWindow.show()
        },
      },
      {
        label: '😭 关闭程序',
        role: 'quit',
      },
    ])
    appIcon.setToolTip('虾皮聊聊客户端')
    appIcon.setContextMenu(contextMenu)
    appIcon.on('click', () => {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    })
  } catch (error) {
    log.info('createTray error:'.error)
  }
}

app.on('ready', () => {
  log.info('app start')
  tryToGetAuthedStore('init').then(() => {
    createBrowserWindow()
    setIntercept()
    injectMessageMonitor()
    createTray()
  })
})

// 网络状态显示
app.whenReady().then(() => {
  // 网络状态显示
  onlineStatusWindow = new BrowserWindow({
    opacity: 0,
    show: false,
    width: 300,
    height: 48,
    maximizable: false,
    minimizable: false,
    frame: false,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true, // 是否启用node集成
      enableRemoteModule: true, // 是否启用remote模块
    },
  })
  onlineStatusWindow.loadFile('./components/line-status/lineStatus.html')
  ipcMain.on('online-status-changed', (event, status) => {
    onlineStatusWindow.show()
    onlineStatusWindow.setOpacity(1)
    onlineStatusWindow.setAlwaysOnTop(true)
    if (status === 'online') {
      setTimeout(() => {
        onlineStatusWindow.hide()
      }, 3000)
    }
  })
})

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      mainWindow.restore()
      mainWindow.show()
    }
  })
}

// app.on('window-all-closed', () => {
//   if (appIcon) appIcon.destroy()
// })

app.on('before-quit', function (evt) {
  if (appIcon) appIcon.destroy()
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  showWindow()
})

function showWindow() {
  if (mainWindow) {
    // 保证当前窗口存在
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.show()
    mainWindow.focus()
  } else {
    createBrowserWindow()
  }
}
