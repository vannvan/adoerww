console.log('订单采购')
import { sendMessageToBackground } from '@/lib/chrome-client.js'

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

class bindOrder {
  constructor() {
    //
  }
  locationObserver() {
    // 监听页面链接更新
    let self = this
    let oldHref = null
    let bodyList = document.querySelector('body'),
      observer = new MutationObserver(function(mutations) {
        if (oldHref != location.href && /1688|yangkeduo/.test(location.href)) {
          console.log('切换页面', location.href)
          oldHref = location.href
          sendMessageToBackground('purchas', {}, 'CHECK_CURRENT_TAB_ORDER', data => {
            console.log('check-current-tab-order', data)
            if (data && data.code == -1) {
              $.fn.message({
                type: 'error',
                msg: data.message
              })
            }
          })
        }
      })
    let config = {
      childList: true,
      subtree: true
    }
    observer.observe(bodyList, config)
    window.addEventListener('message', self.erpMessageHandler, false)
  }
  erpMessageHandler(e) {
    console.log('来自erp的消息', e.data)
    if (e.data && e.data.purchasLink) {
      let { purchasLink, orderInfo } = e.data
      if (/1688|yangkeduo/.test(purchasLink)) {
        sendMessageToBackground(
          'purchas',
          { purchasLink: purchasLink, orderInfo: orderInfo },
          'INIT_ORDER_INFO',
          data => {
            if (data) {
              console.log(data)
              if (data.code == -1) {
                $.fn.message({
                  type: 'error',
                  msg: data.message
                })
              }
            }
          }
        )
      }
    }
  }
}

const BO = new bindOrder()
BO.locationObserver()
