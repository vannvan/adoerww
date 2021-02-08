// 批量采集操作脚本
import { checkLoginStatus } from './content'
import { getRule } from '@/lib/rules'
import { CONFIGINFO } from '@/background/config.js'
import { Crawl } from '@/background/server/crawl.js'
import { Html } from '@/background/server/html.js'
import { hintNotifyProgress, notifyProgress } from './progress'
import { MESSAGE } from '../lib/conf'

export function imageCrawl(url) {
  var imageCrawlEnd = function(data) {
    if (!data.status) {
      $.fn.message({ type: 'error', msg: MESSAGE.error.checkIsAuthedERP })
      return
    }
    let uid = data.data.token
    let urls = window.location.href
    // brandData = JSON.parse(data.brandData)

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
    var linkruleHref = getRule(location.href)
    var CONFIG_OBJ = JSON.parse(linkruleHref)
    var pageType = new Function('url', CONFIG_OBJ.detect)(location.href)
    var sumaitongShowArr = ['category', 'sortlist']
    // lazada列表页不调用html
    if (url.indexOf('www.lazada.') > -1 && sumaitongShowArr.includes(pageType)) {
      var params = {
        baseURL: CONFIGINFO.url.ApiUrl,
        token: uid,
        detailUrl: url,
        url: url
      }
      Html.postCrawlHtml(CONFIGINFO.url.postCrawlHtml(), params, 0, function(result) {
        var isSucc = result.code == '0'
        hintNotifyProgress(isSucc)
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
        // 淘宝广告页处理(获取正确的url)
        if (urls.indexOf('huodong.taobao') > -1) {
          var realUrl = ''
          data.html.replace(/\<link rel="canonical".*?\/>/g, function(items) {
            items.replace(/(http|https).*?id=\d+/g, function(item) {
              realUrl = item
            })
          })
          data.detailUrl = realUrl
          data.url = realUrl
        }

        Html.postCrawlHtml(CONFIGINFO.url.postCrawlHtml(), data, 0, function(result) {
          var isSucc = result.code == '0'
          hintNotifyProgress(isSucc)
        })
      })
  }
  checkLoginStatus(imageCrawlEnd)
}

const BatchCollect = {
  handleSelectAll({ isCheck = true }) {
    // 选中商品
    $('.emalacca-plugin-goods-acquisition-select').attr({
      'data-selected': isCheck ? '1' : '0'
    })
    $('.emalacca-plugin-goods-acquisition-select').css({
      'border-width': isCheck ? '0' : '2px',
      'pointer-events': 'auto',
      display: isCheck ? 'block' : 'none'
    })
    $('.emalacca-plugin-goods-acquisition-select')
      .find('.emalacca-goods-icon-select')
      .css({
        display: isCheck ? 'block' : 'none'
      })
  },

  handleCollectSelected() {
    console.log('采集选中')
    let selectedLen = [
      ...document.querySelectorAll('.emalacca-plugin-goods-acquisition-select')
    ].filter(item => item.getAttribute('data-selected') == 1).length
    if (!selectedLen) {
      $.fn.message({ type: 'error', msg: MESSAGE.error.pleaseSelectSomeGoods })
      return
    }
    $('.emalacca-plugin-goods-acquisition-select').each(function(index) {
      if (index === 0) {
        // 批量采集，显示进度条
        notifyProgress({ percent: 0, count: selectedLen })
      }
      let isSelected = $(this).attr('data-selected')
      if (isSelected) {
        imageCrawl($(this).attr('data-selecturl')) //采集操作
      }
    })
  },

  handleCollectCurrPage() {
    console.log('采集本页')
    let pageGoodsLen = [...document.querySelectorAll('.emalacca-plugin-goods-acquisition-select')]
      .length
    $('.emalacca-plugin-goods-acquisition-select').each(function(index) {
      if (index === 0) {
        // 批量采集，显示进度条
        notifyProgress({ percent: 0, count: pageGoodsLen })
      }
      let urlString = $(this).attr('data-selecturl')
      imageCrawl(urlString) //采集操作
    })
  }
}

export default BatchCollect
