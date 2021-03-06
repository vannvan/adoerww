// chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
export function getURL(url) {
  if (!url) return
  return chrome.extension.getURL(url)
}

export function getInContext() {
  return chrome.extension.inIncognitoContext
}

export function request() {
  return chrome.extension.onRequest
}

export function sendRequest() {
  return chrome.extension.sendRequest
}

export function getExtension() {
  return chrome.extension
}

export function lStorage() {
  return chrome.storage
}
export const sendMessageToBackground = function(action, options, type, callback) {
  //   console.log(chrome.app)
  if (chrome.runtime.sendMessage && typeof chrome.app.isInstalled !== undefined) {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(
        '',
        { action: action, options: options, type: type },
        callback.bind(resolve)
      )
    })
  }
}

// 获取background: pt-plug-access-user缓存信息 && brandData 采集数据的data(目前没用到)
export const getLoginInfo = function(callback) {
  if (chrome.runtime.sendMessage && typeof chrome.app.isInstalled !== undefined) {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(
        '',
        { action: 'checkLoginStatus', sign: 'signShope' },
        callback.bind(resolve)
      )
    })
  }
}

// 发送消息到server.js, 请求后端接口
export const sendMessageToServer = function(action, options, callback) {
  if (chrome.runtime.sendMessage && typeof chrome.app.isInstalled !== undefined) {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(
        '',
        { sign: 'signShope', action: action, data: options },
        callback.bind(resolve)
      )
    })
  }
}
