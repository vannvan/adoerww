import { Crawl } from '@/background/server/crawl.js'
import { Html } from '@/background/server/html.js'
import { CONFIGINFO } from '@/background/config.js'
import { MESSAGE } from '../lib/conf'

import { getLoginInfo } from '@/lib/chrome-client'

// 在图片上直接采集
export function imageCrawl(url, $span, type, crawlType, noBrandDetect) {
  const imageCrawlCallback = function(data) {
    if (!data.status) {
      $.fn.message({ type: 'error', msg: MESSAGE.error.checkIsAuthedERP })
      if ($span) $span.find('.emalacca-goods-btn[data-type=collect]').text('请登录')
      return
    }
    let uid = data.data.token
    let urls = window.location.href

    //天猫处理
    if (url.indexOf('tmall.hk') !== -1) url = url.replace('tmall.hk', 'tmall.com')

    //shopee
    if (location.href.indexOf('shopee.') !== -1 && url.indexOf('shopee.') === -1) {
      url = 'https://' + location.host + url
    } else if (
      type &&
      +type === 1 &&
      location.href.indexOf('tw.shopeesz.com') !== -1 &&
      url.indexOf('tw.shopeesz.com') === -1
    ) {
      url = 'https://tw.shopeesz.com' + url
    } else if (location.href.indexOf('xiapibuy.com') !== -1 && url.indexOf('xiapibuy.com') === -1) {
      url = 'https://' + location.host + url
    }
    if (urls.indexOf('www.wish.com/') !== -1) {
      urls = urls.substring(0, urls.indexOf('com/') + 3)
      if (url.indexOf('https://') === -1) {
        url = urls + url
      }
    }

    //速卖通 将旧版链接直接修改为新版采集
    if (url) {
      if (url.indexOf('aliexpress.com/item/') !== -1 && url.indexOf('.html') !== -1) {
        var itemId = url.substring(url.indexOf('aliexpress.com/item/') + 20, url.indexOf('.html'))
        if (itemId && itemId.indexOf('/') !== -1) {
          itemId = itemId.substring(0, itemId.indexOf('/') + 1)
          url = url.replace(itemId, '')
        }
      } else if (
        url.indexOf('.aliexpress.com/store/product/') !== -1 &&
        url.indexOf('.html') !== -1
      ) {
        url = url.substring(0, url.indexOf('.html') + 5)
        if (url) {
          var urlHost = url.substring(0, url.indexOf('/store/product/'))
          var itemStr = url.substring(url.lastIndexOf('/'), url.indexOf('.html'))
          if (itemStr && itemStr.indexOf('_') > -1) {
            url = urlHost + '/item/' + itemStr.split('_')[1] + '.html'
          }
        }
      }
    }
    var crawlObj = Crawl.getCrawlObject('single', url)
    if (url.indexOf('http') === -1) {
      url = 'https:' + url
    } else if (url.indexOf('https') === -1) {
      url = url.replace('http', 'https')
    }
    //lazada
    // 判断当前地址是否是列表
    // lazada不调用html
    if (url.indexOf('www.lazada.') > -1) {
      var params = {
        baseURL: CONFIGINFO.url.ApiUrl,
        token: uid,
        detailUrl: url,
        url: url
      }
      Html.postCrawlHtml(CONFIGINFO.url.postCrawlHtml(), params, 0, function(result) {
        if (result.code == 0) {
          if ($span) {
            $span
              .css({
                color: '#fff',
                backgroundColor: '#67c23a',
                borderColor: '#67c23a'
              })
              .find('.emalacca-goods-btn[data-type=collect]')
              .text('采集成功')
            $.fn.message({ type: 'success', msg: MESSAGE.success.collectSuccess })
          }
        } else {
          $.fn.message({ type: 'error', msg: result.msg })
        }
      })
      return
    }

    crawlObj &&
      crawlObj.crawl(url, function(data) {
        let baseURL = CONFIGINFO.url.ApiUrl
        data.detailUrl = data.url
        data.token = uid
        data.baseURL = baseURL
        data.repeatCheck = 1 //必须查重
        Html.postCrawlHtml(CONFIGINFO.url.postCrawlHtml(), data, 0, function(result) {
          if (result.code == '0') {
            $.fn.message({ type: 'success', msg: MESSAGE.success.savehaveBeenAdd })
            $span
              .css({
                color: '#fff',
                backgroundColor: '#67c23a',
                borderColor: '#67c23a'
              })
              .html('采集成功')
          } else {
            // 后台返回错误信息
            if (!noBrandDetect && $span) {
              $span.find('.emalacca-goods-btn[data-type=collect]').text('重新采集')
            } else {
              $span.html('重新采集')
            }
            $.fn.message({ type: 'success', msg: result.msg })
          }
        })
      })
  }
  getLoginInfo(data => {
    imageCrawlCallback(data)
  })
}
