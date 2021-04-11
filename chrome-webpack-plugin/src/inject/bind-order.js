console.log('订单采购')
import { sendMessageToBackground } from '@/lib/chrome-client.js'

if (/1688/.test(location.origin)) {
  sendMessageToBackground('1688-order-purchas', {}, 'INIT_ORDER_INFO', data => {
    if (data) {
      console.log(data)
      if (data.code == -1) {
        $.fn.message({
          type: 'error',
          msg: data.message
        })
      }
      resolve(data)
    }
  })
}

if (/yangkeduo/.test(location.origin)) {
  sendMessageToBackground('pdd-order-purchas', {}, 'INIT_ORDER_INFO', data => {
    if (data) {
      console.log(data)
      if (data.code == -1) {
        $.fn.message({
          type: 'error',
          msg: data.message
        })
      }
      resolve(data)
    }
  })
}
