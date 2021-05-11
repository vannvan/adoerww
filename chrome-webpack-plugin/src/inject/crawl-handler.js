import { Crawl } from '@/background/server/crawl.js'
import { Html } from '@/background/server/html.js'
import { CONFIGINFO } from '@/background/config.js'
import { MESSAGE } from '../lib/conf'
import { isEmpty } from '@/lib/utils'
import { sendMessageToServer } from '@/lib/chrome-client'

// 在图片上直接采集
/**
 *
 * @param {string} url 采集商品的url
 * @param {object} data  用户信息
 * @param {boolean} isBatch 是否批量采集
 * @param {NamedNodeMap} $span 单采时，对应的按钮
 */
export function imageCrawl(url, data, isBatch = false, $span) {
  let uid = data.data.token
  let urls = window.location.href

  //天猫处理
  if (url.indexOf('tmall.hk') !== -1) url = url.replace('tmall.hk', 'tmall.com')

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

  crawlObj &&
    crawlObj.crawl(url, function(data) {
      data.token = uid
      // data.repeatCheck = 1 //必须查重
      // 淘宝广告页处理(获取正确的url)
      if (urls.indexOf('taobao.com') > -1 || urls.indexOf('tmall.com') > -1) {
        var realUrl = ''
        data.html.replace(/\<link rel="canonical".*?\/>/g, function(items) {
          items.replace(/(http|https).*?id=\d+/g, function(item) {
            realUrl = item
          })
        })
        if (!isEmpty(realUrl)) {
          data.url = realUrl
        }
      }
      Html.postCrawlHtml(CONFIGINFO.url.postCrawlHtml(), data, 0, function(result) {
        if (!isBatch) {
          handleResult(result, $span)
        }
      })
    })
}

//
export function handleResult(res, $span) {
  if (res.code == '0') {
    $.fn.message({
      type: 'success',
      msg: MESSAGE.success.savehaveBeenAdd
    })
    if ($span) {
      $span
        .css({
          color: '#fff',
          backgroundColor: '#67c23a',
          borderColor: '#67c23a'
        })
        .html('采集成功')
    }
  } else {
    // 后台返回错误信息
    if ($span) {
      $span.find('.emalacca-goods-btn[data-type=collect]').text('重新采集')
    }

    $.fn.message({
      type: 'error',
      msg: res.msg
    })
  }
}

// 处理淘宝列表里的广告url
export const taobaoTranslationUrl = function($a, url) {
  let id = $a.attr('data-nid') || '' // 获取商品ID
  let $parents = $a.parents('.item.J_MouserOnverReq.item-ad') // 获取商品的祖父级
  let isTM = false
  if ($parents.length > 0) {
    let divTM = $parents.find('.icon-service-tianmao') // 判断祖父级里是否有天猫图标
    isTM = divTM.length > 0
  }
  let newUrl = ''
  // 列表内的广告
  if (isTM && id) {
    newUrl = 'https://detail.tmall.com/item.htm?id=' + id
  } else if (!isTM && id) {
    newUrl = 'https://item.taobao.com/item.htm?id=' + id
  } else {
    /*
        g_page_config：  p4pdata
        RESOURCEID 有值，URL不一定有值
        
        // 右侧广告栏(父级没有id, 参数都在g_page_config)
        var headObj = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        var headString = headObj.textContent;
        // 获取g_page_config值
        var startNum = headString.indexOf('g_page_config');
        var endNum = headString.indexOf('g_srp_loadCss');
        var configString = headString.slice(startNum, endNum);  // g_page_config参数
        var itemsArr = configString.match(/"RESOURCEID.*?CUSTOMERID/g, '');
        console.log(itemsArr, 'itemsArr')
        var codeArr = url.split('&e='); // 广告url处理
        var code = codeArr[codeArr.length - 1]; // 获取url中的code
        var re = new RegExp(code+ '.*?"CUSTOMERID','ig'); // 动态正则的code
        // 获取对应的url参数
        var urlCodeString = ''
        configString.replace(re,function(items, item){    //configString全参数找出对应的参数
            urlCodeString = items;
        });
        urlCodeString.replace(/(http|https):.*?u003d\d+/,function(items, item){    //正则匹配出url
             // 处理编译后的url
            var urlCode = items.replace(/\\/g, '');
            newUrl = urlCode.replace('u003d', '=');
        });
        */
  }
  return newUrl
}

// 处理1688列表里的广告url
export const albbTranslationUrl = function($a) {
  let id = ''
  let $parents = $a.parents('.ad-item')
  if ($parents.length > 0) {
    let string = $parents.attr('data-aplus-report')
    let arrId = string.match(/object_id@\w.+?\^/gi, '')
    if (arrId.length > 0) {
      id = arrId[0].replace(/\D/gi, '')
    }
  }
  let url = ''
  if (id) {
    url = 'https://detail.1688.com/offer/' + id + '.html'
  }
  return url
}

// 当前商品是否已经采集过
export const postHasCrawl = url => {
  return new Promise((resolve, reject) => {
    sendMessageToServer(
      'postHasCrawl',
      {
        url: url
      },
      data => {
        resolve(data)
      }
    )
  })
}

// 上传图片到阿里云
export const handleUploadImages = function(url) {
  return new Promise(resolve => {
    sendMessageToServer(
      'handleUploadImages',
      {
        url: url
      },
      data => {
        resolve(data)
      }
    )
  })
}
