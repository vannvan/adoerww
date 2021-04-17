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
        // if (!authInfo['access_token']) {
        //   setStorageLocal({'isLogin': false})  // ERP登出，保存false
        // }
        // 在storage.local获取erp用户是否登录
        sendMessageToBackground(
          'auth',
          { origin: document.location.origin, authInfo: authInfo },
          'SYNC_ERP_AUTH_INFO',
          data => {
            if (data && data.result) {
              // let { userInfo } = authInfo
              // let { memberNO = '' } = userInfo.userInfo
              // setStorageLocal({'isLogin': true})  // 获取用户信息成功，保存到缓存storage.local
              // $.fn.message({
              //   type: 'success',
              //   msg: `用户${memberNO}同步授权成功`
              // })
              clearInterval(timer)
            }
          }
        )
      }
    } catch (error) {
      console.log(error)
    }
  }
}

//如果当前在erp平台,将erp的登录信息同步至background
if (/emalacca|192/.test(document.location.origin)) {
  ERP.syncAuthStatus() //同步erp用户信息
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
