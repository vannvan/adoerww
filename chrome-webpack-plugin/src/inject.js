import './inject/content'
import './inject/shopee'
// import './inject/history-data'
import { sendMessageToBackground } from '@/lib/chrome-client.js'

//如果当前在erp平台,将erp的登录信息同步至background
if (/emalacca|192/.test(document.location.origin)) {
  try {
    let timer = null
    timer = setInterval(() => {
      syncERP()
    }, 1500)

    function syncERP(param) {
      console.log('sync auth info...')
      let authInfo = JSON.parse(window.localStorage.getItem('erp')).auth
      sendMessageToBackground(
        'auth',
        { origin: document.location.origin, authInfo: authInfo },
        'SYNC_ERP_AUTH_INFO',
        data => {
          if (data && data.result) {
            console.log('Information synchronization successful')
            clearInterval(timer)
          }
        }
      )
    }
  } catch (error) {
    console.log(error)
  }
}
