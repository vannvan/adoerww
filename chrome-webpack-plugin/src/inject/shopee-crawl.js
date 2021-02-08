import { Html } from '@/background/server/html.js'
import { Crawl } from '@/background/server/crawl.js'
import { CONFIGINFO } from '@/background/config.js'
import { MESSAGE } from '../lib/conf'

//获取登录状态
function checkLoginStatus(call) {
  var checkLoginStatusEnd = function(data) {
    call(data)
  }
  sendMessageToBackground('checkLoginStatus', '', checkLoginStatusEnd)
}

var sendMessageToBackground = function(action, options, callback) {
  chrome.runtime.sendMessage(
    '',
    {
      sign: 'signShope',
      action: action,
      data: options
    },
    callback
  )
}

// 在图片上直接采集
export function solidCrawl(url, callback) {
  var imageCrawlEnd = function(data) {
    if (!data.status) {
      $.fn.message({ type: 'error', msg: MESSAGE.error.checkIsAuthedERP })
      return
    }
    let uid = data.data.token
    let urls = window.location.href

    //shopee
    if (location.href.indexOf('shopee.') !== -1 && url.indexOf('shopee.') === -1) {
      url = 'https://' + location.host + url
    } else if (
      location.href.indexOf('tw.shopeesz.com') !== -1 &&
      url.indexOf('tw.shopeesz.com') === -1
    ) {
      url = 'https://tw.shopeesz.com' + url
    } else if (location.href.indexOf('xiapibuy.com') !== -1 && url.indexOf('xiapibuy.com') === -1) {
      url = 'https://' + location.host + url
    }

    var crawlObj = Crawl.getCrawlObject('single', url)
    if (url.indexOf('http') === -1) {
      url = 'https:' + url
    } else if (url.indexOf('https') === -1) {
      url = url.replace('http', 'https')
    }

    crawlObj &&
      crawlObj.crawl(url, function(data) {
        let baseURL = CONFIGINFO.url.ApiUrl
        data.detailUrl = data.url
        data.token = uid
        data.baseURL = baseURL
        Html.postCrawlHtml(CONFIGINFO.url.postCrawlHtml(), data, 0, function(result) {
          callback(result)
        })
      })
  }
  checkLoginStatus(imageCrawlEnd)
}
