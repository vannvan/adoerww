const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const path = require('path')
const fs = require('fs')

const { ipcMain, BrowserWindow } = require('electron')
let mainWindow = null
// let updaterCacheDirName = 'shopee-chat-client-updater'
// const updatePendingPath = path.join(
//   autoUpdater.app.baseCachePath,
//   updaterCacheDirName,
//   'pending'
// )
// // fs.rmdirSync(updatePendingPath)
// // fs.emptyDir(updatePendingPath)
// log.warn(autoUpdater.app.baseCachePath)

module.exports = updateHandle = {
  init: (window, feedUrl) => {
    mainWindow = window
    autoUpdater.setFeedURL(feedUrl)
    updateHandle.listener()
  },
  listener: () => {
    //   autoUpdater.autoDownload = true
    //监听升级失败事件
    autoUpdater.on('error', function (error) {
      sendUpdateMessage({
        cmd: 'error',
        message: error,
      })
      log.info('checking-for-update error', error)
    })
    //监听开始检测更新事件
    autoUpdater.on('checking-for-update', function (message) {
      sendUpdateMessage({
        cmd: 'checking-for-update',
        message: message,
      })
      log.info('checking-for-update')
    })
    //监听发现可用更新事件
    autoUpdater.on('update-available', function (message) {
      sendUpdateMessage({
        cmd: 'update-available',
        message: message,
      })
      log.info('update-available')
    })
    //监听没有可用更新事件
    autoUpdater.on('update-not-available', function (message) {
      sendUpdateMessage({
        cmd: 'update-not-available',
        message: message,
      })
      log.info('update-not-available')
    })

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
      sendUpdateMessage({
        cmd: 'download-progress',
        message: progressObj,
      })
      log.info('download-progress', JSON.stringify(progressObj))
    })
    //监听下载完成事件
    autoUpdater.on(
      'update-downloaded',
      function (event, releaseNotes, releaseName, releaseDate, updateUrl) {
        sendUpdateMessage({
          cmd: 'update-downloaded',
          message: {
            releaseNotes,
            releaseName,
            releaseDate,
            updateUrl,
          },
        })
        log.info('update-downloaded success')
        //退出并安装更新包
        autoUpdater.quitAndInstall()
      }
    )
  },
  update: () => {
    autoUpdater.quitAndInstall()
  },
  check: () => {
    autoUpdater.checkForUpdates()
  },
}

//给渲染进程发送消息
function sendUpdateMessage(text) {
  mainWindow.webContents.send('mainWindow-message', {
    type: 'CHECK_VERSION',
    params: text,
  })
}
