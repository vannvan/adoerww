// erp系统植入脚本
import { sendMessageToBackground } from '@/lib/chrome-client.js'
<<<<<<< HEAD
import { ERP_SYSTEM } from '@/lib/env.conf'
=======
>>>>>>> 170d99bae1f3f289ec99c5d5e45a6170fe143306

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
              //   let { userInfo } = authInfo
              //   let { memberNO = '' } = userInfo.userInfo
              console.log('Information synchronization successful')
              //   $.fn.message({
              //     type: 'success',
              //     msg: `【马六甲插件】:用户${memberNO}授权成功`
              //   })
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
<<<<<<< HEAD
  ERP.syncAuthStatus() //同步erp用户信息
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.cmd == 'erp-logout') {
      window.localStorage.clear()
      sendResponse(request.type)
      setTimeout(() => {
        window.location.href = '/auth/login'
      }, 500)
=======
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.cmd == 'logout') {
      window.localStorage.clear()
      window.location.href = '/auth/login'
      sendResponse(request.type)
>>>>>>> 170d99bae1f3f289ec99c5d5e45a6170fe143306
      return true
    }
    return true
  })
<<<<<<< HEAD
=======
  ERP.syncAuthStatus() //同步erp用户信息
>>>>>>> 170d99bae1f3f289ec99c5d5e45a6170fe143306
}
