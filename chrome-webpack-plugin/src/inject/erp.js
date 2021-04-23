// erp系统植入脚本
import { sendMessageToBackground } from '@/lib/chrome-client.js'
// import { getStorageLocal, setStorageLocal } from '@/lib/chrome.js'

export const ERP = {
  syncAuthStatus: function() {
    try {
      let timer = null
      timer = setInterval(() => {
        syncERP()
      }, 3000)

      function syncERP() {
        console.log('sync auth info...')
        let authInfo = window.localStorage.getItem('erp')
          ? JSON.parse(window.localStorage.getItem('erp')).auth
          : null
        if (!authInfo) return
        sendMessageToBackground(
          'auth',
          { origin: document.location.origin, authInfo: authInfo },
          'SYNC_ERP_AUTH_INFO',
          data => {
            if (data && data.result) {
              clearInterval(timer)
            }
          }
        )
      }
    } catch (error) {
      console.log(error)
    }
  },

  //获取采集站点的cookies
  getCollectSitesAuthInfo: function() {
    sendMessageToBackground('auth', {}, 'GET_COLLECT_SITE_LOGIN_STATUS', data => {
      if (data && data.result) {
        let { pddLoginStatus, t1688LoginStatus } = data.result
        $('body').append(
          `<div id="emalacca-chrome-extension-purchas-auth" style="display:none" isPddLogin="${pddLoginStatus}" is1688Login="${t1688LoginStatus}"></div>`
        )
      }
    })
  }
}

//如果当前在erp平台,将erp的登录信息同步至background
if (/emalacca|192/.test(location.origin)) {
  ERP.syncAuthStatus() //同步erp用户信息
  ERP.getCollectSitesAuthInfo() //获取采集站点的cookies
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == 'ERP_LOGOUT') {
      window.localStorage.clear()
      sendResponse(request.type)
      setTimeout(() => {
        window.location.href = '/auth/login'
      }, 500)
      return true
    }
    if (request.type == 'UPDATE_PAGE') {
      sendResponse(request.type)
      location.reload()
      return true
    }
    return true
  })
}
