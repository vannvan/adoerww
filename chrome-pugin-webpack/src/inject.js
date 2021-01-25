import './inject/shopee'
import './inject/history-data'
import { sendMessageToBackground } from '@/lib/chrome-client.js'

//如果当前在erp平台,将erp的登录信息同步至background
// if (/emalacca|112/.test(document.location.origin)) {
//   console.log('sync auth info...')
//   sendMessageToBackground(
//     'auth',
//     { origin: document.location.origin },
//     'SYNC_ERP_AUTH_INFO',
//     (data) => {
//       console.log(data)
//     }
//   )
// }
