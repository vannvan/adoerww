import { sendMessageToBackground } from '@/lib/chrome-client.js'
import { isEmpty } from '@/lib/utils'
import { ERP_SYSTEM } from '@/lib/env.conf'

const ERP_DOMAIN = ERP_SYSTEM[process.env.NODE_ENV]

// const ERP_DOMAIN = 'http://127.0.0.1:8080/'

function CookieCache() {
  this.cookies = {}

  this.reset = function() {
    this.cookies = {}
  }

  this.add = function(cookie) {
    let domain = cookie.domain
    if (!this.cookies[domain]) {
      this.cookies[domain] = []
    }
    this.cookies[domain].push(cookie)
  }

  this.getCommerceCookies = () => {
    return new Promise(resolve => {
      sendMessageToBackground('request', {}, 'GET_COMMERCE_COOKIES', data => {
        resolve(data)
      })
    })
  }
}
const cache = new CookieCache()
// 在ERP中发送消息，接收ERP消息
if (location.href.indexOf(ERP_DOMAIN) > -1) {
  window.addEventListener('message', handleMessageChange, false)
} else {
  // 移除监听器的方法handleMessageChange
  window.removeEventListener('message', handleMessageChange)
}

function handleMessageChange(event) {
  // 判断是否是ERP发送的消息
  if (!isEmpty(event) && event.data.isEmalaccaErp) {
    if (!event.data.isUrlGather) {
      // ERP初始化校验
      window.postMessage(
        {
          isStartPlug: true
        },
        ERP_DOMAIN
      ) // 匹配域名
    } else {
      // ERP--链接采集中，点击【采集到采集箱】按钮时，发送消息到插件
      // 接收ERP点击事件
      // 在ERP 链接采集时, 获取cookies
      cache.reset() // 清空cookies
      cache.getCommerceCookies().then(cookies => {
        for (let i in cookies) {
          cache.add(cookies[i])
        }
        let params = {
          isStartPlug: true,
          isCookies: true,
          cookies: cache.cookies
        }
        // 把参数传回ERP
        window.postMessage(params, ERP_DOMAIN) // 匹配域名 'http://192.168.50.44:8080/'
      })
    }
  }
}
