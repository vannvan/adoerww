import './inject/content'
import './inject/shopee'
import './inject/history-data'
import { sendMessageToBackground } from '@/lib/chrome-client.js'

//如果当前在erp平台,将erp的登录信息同步至background
if (/emalacca|192/.test(document.location.origin)) {
  console.log('sync auth info...')
  try {
    let authInfo = JSON.parse(window.localStorage.getItem('erp')).auth
    sendMessageToBackground(
      'auth',
      { origin: document.location.origin, authInfo: authInfo },
      'SYNC_ERP_AUTH_INFO',
      data => {
        console.log('Information synchronization successful')
      }
    )
  } catch (error) {
    console.log(error)
  }
}
