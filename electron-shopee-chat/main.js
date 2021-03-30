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

      if (!isDev) {
        setTimeout(() => {
          loopSyncTask()
        }, 100)
      }
    }
  })

  // 创建窗口监听
  mainWindow.webContents.on(
    'new-window',
    (event, url, frameName, disposition) => {
      //   if (disposition == 'new-window') {
      //     // log.info('new window', disposition, url)
      //     event.preventDefault()
      //     shell.openExternal(url)
      //   }
    }
  )

  //窗口聚焦监听
  mainWindow.on('focus', function () {
    mainWindow.focus()
    // log.info(mainWindow.isFocused(), 'mainWindow.isFocused()')
  })

  //窗口失去焦点.
  mainWindow.on('blur', function () {
    //
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
      details.requestHeaders['user-agent'] =
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'
      if (/shopee|xiapibuy/.test(details.url)) {
        try {
          let authedStore = storage.getItem('authedStore') //已授权的店铺列表
          let currentStoreId = String(store.get('currentStore')) // 当前所在的店铺
          let currentStoreInfo = authedStore[currentStoreId]
          let currentStoreCookies = currentStoreInfo.cookieStr
          details.requestHeaders['authorization'] =
            'Bearer ' + currentStoreInfo.token
          details.requestHeaders['cookie'] = currentStoreCookies
          details.requestHeaders['x-s'] = '089986cd32e608575a81d17cefe9d408'
          details.requestHeaders['x-v'] = '4'
        } catch (error) {
          log.error('currentStore', String(store.get('currentStore')), error)
          //   dialog.showErrorBox('提示', '店铺数据错误')
          tryToGetAuthedStore('init').then(() => {
            console.log('checkauth finished')
            loadDefaultStoreChat()
          })
        }

        if (/login/.test(details.url)) {
          let authedStore = storage.getItem('authedStore') //已授权的店铺列表
          let currentStoreId = String(store.get('currentStore')) // 当前所在的店铺
          let currentStoreInfo = authedStore[currentStoreId]
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
  ipcMain.on('inject-message', async (e, args) => {
    log.info('inject message', 'params:', args)
    let { type, params } = args
    switch (type) {
      case 'CHANGE_STORE': //切换店铺
        store.set('currentStore', params.storeId) // 更新当前操作的店铺ID
        store.set('currentSite', params.key) //当前站点
        try {
          //如果拿到了storeId说明已授权，没有则需要用户自己登录，或者授权
          let exitCookies = storage.getItem('authedStore')[params.storeId]
          if (exitCookies) {
            mainWindow
              .loadURL(
                `https://${
                  params.host
                }/webchat/conversations?'${new Date().getTime()}&storeId=${
                  params.storeId
                }&site=${params.key}`
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
      case 'SEND_MESSAGE': //发送消息操作
        sendMessage(params)
        break
      case 'UPLOAD_IMAGE': //上传图片
        handleUploadImage(params)
        break
      case 'ERROR_DIALOG': //错误提示
        dialog.showErrorBox('提示', params)
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
        session.defaultSession.clearStorageData({
          origin: erpSystem,
        })
        mainWindow.webContents.loadURL(`${erpSystem}/auth/login`),
          then(() => {
            mainWindow.setMinimumSize(980, 640)
            mainWindow.setSize(980, 640)
            mainWindow.center()
          })

        break
      case 'ADD_STORE': //添加店铺
        if (childWindow && childWindow.isVisible()) {
          return false
        }
        childWindow = new BrowserWindow({
          show: false,
          maximizable: false,
          minimizable: false,
          title: '添加店铺',
          icon: '',
          frame: false,
          parent: mainWindow,
          webPreferences: {
            nodeIntegration: true, // 是否启用node集成
            enableRemoteModule: true, // 是否启用remote模块
          },
        })
        // childWindow.setAlwaysOnTop(true)
        childWindow.loadFile('./components/add-store/addStore.html')
        childWindow.once('ready-to-show', () => {
          childWindow.show()
        })
        if (isDev) {
          childWindow.webContents.openDevTools()
        }
        break
      case 'CLOSE_CHILD_WINDOW': //关闭子窗口
        childWindow.close()
        break
      case 'REMOVE_BIND_STORE': //解绑店铺
        removeBindStore(params)
        break
      case 'SUCCESS_ADD_STORE': //添加店铺成功
        setTimeout(function () {
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
    }
  })
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
  let sourceLang = type == 'send' ? 'zh-CN' : 'en'
  googleTr(messageText, sourceLang, targetLang)
    .then(resultText => {
      log.info('translation result:', resultText.map(el => el[0]).join(''))
      let result = resultText.map(el => el[0]).join('')
      if (type == 'send') {
        mainWindowNotifier('REPLACE_TEXTAREA', result) //替换textarea
      } else {
        mainWindowNotifier('TRANSLATION_RESULT', { targetText: resultText })
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
  let mainWindowDefaultPage = path.join(
    app.getAppPath(),
    '/empty-page/index.html'
  )
  let currentSite = store.get('currentSite')
  let currentStore = store.get('currentStore')
  if (currentSite && currentStore) {
    mainWindowDefaultPage = `https://${
      store.get('siteConfig.shopeeSeller')[currentSite].host
    }/webchat/conversations`
  }
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
      app.relaunch()
      //   dialog.showErrorBox('提示', '加载聊天室窗口失败，请重启应用程序')
      //   app.exit()
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

// 调用虾皮发送消息接口
async function sendMessage(params) {
  let { to_id, token, host, ...messageContent } = params
  let data = Object.assign(messageContent, {
    request_id: Lib.guid(),
    to_id: parseInt(to_id),
    chat_send_option: {
      force_send_cancel_order_warning: false,
      comply_cancel_order_warning: false,
    },
  })
  log.info('send afterTranslation params:', data)
  axios({
    method: 'post',
    data: data,
    url: `https://${host}/webchat/api/v1.2/messages`,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then(res => {
      log.info('send afterTranslation success', res.data)
      // 清除文本框
      mainWindowNotifier('CLEAR_TEXTAREA')
    })
    .catch(err => {
      log.error('sendMessage error:', err.response.data)
      dialog.showErrorBox('提示', '发送失败，请重试')
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
        let result = await syncShopeeMessage(authedStore[key])
        return result
      })
    )

    let haveNewMessage = Lib.compare(messageQuene, syncResult) //本次消息和上次消息对比
    try {
      let unreadMessageCount = syncResult
        .map(el => el.unread_message_count)
        .reduce((prev, curr) => prev + curr)

      // 如果未读消息大于1且本次消息和上次消息不同
      if (unreadMessageCount > 0 && !haveNewMessage) {
        messageQuene = syncResult //覆盖上次消息
        mainWindow.flashFrame(true) //窗口闪动
        messageTimer = setInterval(() => {
          messageFlag = !messageFlag
          if (messageFlag) {
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
      if (!unreadMessageCount) {
        messageFlag = true
        appIcon.setImage(path.join(__dirname, 'dark-logo.png'))
        clearInterval(messageTimer)
      }
    } catch (error) {
      log.error('loopSyncTask error:', unreadMessageCount, error)
    }
    log.info('sync result:', JSON.stringify(syncResult))
    log.info(
      '======================shopee sync message end   ======================'
    )
  }, 5000)
}

// 同步用户未读消息等
async function syncShopeeMessage(storeInfo) {
  let { name, token, host } = storeInfo
  log.info('sync one user message:', name)
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `https://${host}/webchat/api/v1.2/user/sync`,
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => {
        let { cookies, token, password, ...storeBaseInfo } = storeInfo
        resolve(Object.assign(storeBaseInfo, res.data))
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

        //step2 避免一会重新加载该店铺页面
        if (store.get('currentStore') == storeId) {
          store.set('currentStore', null)
        }

        //step3 从菜单移除当前店铺
        let storeMenuList = Lib.flat(
          store.get('storeMenuList').map(el => el.storeList)
        )
        let newMenuList = storeMenuList.filter(item => item.shopId == storeId)
        store.set('storeMenuList', Lib.groupStore(newMenuList))
        tryToGetAuthedStore('remove').then(() => {
          log.info('checkauth finished')
          loadDefaultStoreChat()
        })
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
            el.storeName = params.aliasName
          }
        })
        console.log(storeMenuList)
        store.set('storeMenuList', Lib.groupStore(storeMenuList))
        tryToGetAuthedStore('modify').then(() => {
          console.log('checkauth finished')
          loadDefaultStoreChat()
        })
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
  const malacca_token = storage.getItem('erpAuth')
  let authedStore = storage.getItem('authedStore') || {} //已授权的店铺列表
  let storeMenuList = store.get('storeMenuList')
  if (malacca_token) {
    // 初始化时如果本地存储没有授权信息
    if (!storeMenuList || type == 'init') {
      let res = await server.getAuthedAtore()
      log.error('storeMenuList 本地没有授权列表', res)
    }

    //如果不是初始化
    if (storeMenuList && type != 'init') {
      let store = await server.getAuthedAtore()
      log.error('storeMenuList 更新授权列表', store)
      let auth = await server.getStoreAuthInfo()
      log.error('storeMenuList 更新token列表', auth)
    }

    //在有店铺列表的情况下调获取token的接口
    if (store.get('storeMenuList')) {
      if (Object.keys(authedStore).length == 0) {
        let res = await server.getStoreAuthInfo()
        log.error('authedStore 本地没有授权信息', res)
      }

      let authedStoreExpires = storage.getItem('authedStoreExpires')
      let currentTime = Date.parse(new Date()) / 1000
      if (!authedStoreExpires || authedStoreExpires < currentTime) {
        let res = await server.getStoreAuthInfo()
        log.error('authedStore 已过期', res)
      }
    }
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

// app.on('window-all-closed', () => {
//   if (appIcon) appIcon.destroy()
// })
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
