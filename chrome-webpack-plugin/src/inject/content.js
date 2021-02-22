import $ from 'jquery'
import { getRule } from '@/lib/rules'
import { CONFIGINFO } from '@/background/config.js'
import { Html } from '@/background/server/html.js'
import { Crawl } from '@/background/server/crawl.js'
import { taobaoTranslationUrl, albbTranslationUrl } from '@/lib/handle-url'
import { operationPanelTemplate, operationSelectTemplate, collectText } from './content-template'
import { MESSAGE } from '../lib/conf'
import locationBtn from '@/lib/location-btn'
import { getLoginInfo } from '@/lib/chrome-client'

//----------------------------------------------新增内容---------------------------------------------
var CONFIG = {}

chrome.extension.onMessage.addListener(function(message, sender, callback) {
  if (message.ID !== 'content') {
    return
  }
  switch (message.action) {
    case 'notify':
      $.fn.message({ type: 'error', msg: message.msg })
      break
    case 'handleLinks':
      debounceHandleLinks()
      break
  }
})

if (document.contentType === 'text/html') {
  chrome.storage.sync.get(
    {
      showPageFetchBar: true,
      showProductFetchBtn: true
    },
    function(data) {
      preload()
      new MutationObserver(function(mutations) {
        preload()
      })
    }
  )
}

var debounceHandleLinks = debounce(function() {
  if (CONFIG && CONFIG.detail) {
    handleLinks(CONFIG.detail)
  }
}, 800)
//获取当前域名配置信息
function preload() {
  var linkrule = getRule(location.href)

  try {
    CONFIG = JSON.parse(linkrule)
    handleLinks(CONFIG.detail)
    $(window).scroll(debounceHandleLinks)
  } catch (e) {
    return
  }
}
//过滤超链接，将满足条件的图片上加上采集按钮
//fnBody 过滤方法的方法体
function handleLinks(fnBody) {
  //遍历页面所有的链接,如果满足条件，则加上导入按钮
  $.each(document.links, function(index, a) {
    if (a.dataset.sm) return
    a.dataset.sm = true
    var href = a.href
    //如果是相对地址，浏览器会自动变成完整地址。
    //getAttribute获取的是原始地址
    if (!href) return
    if (a.getAttribute('href') === '#' || a.getAttribute('href') === '#none') return
    if (href.indexOf('javascript:') === 0) return
    if (href.indexOf('//') === 0) href = location.protocol + href
    if (href.indexOf('item-img') !== -1) return
    if (
      href.indexOf('help.tw.shopeesz.com') !== -1 ||
      href.indexOf('seller.tw.shopeesz.com') !== -1
    )
      return
    try {
      //将链接与后台返回的规则进行匹配
      var test = new Function('url', fnBody)(href)
      if (window.location.href.indexOf('joom.com') && test) {
        var $a = $(a)
        insertFetchBtn($a, href)
      } else if (test && validArea(a)) {
        var $a = $(a)
        insertFetchBtn($a, href)
      }
    } catch (e) {}
  })

  if (CONFIG.selectors) {
    CONFIG.selectors.forEach(function(item) {
      var getUrl = function($hys) {
        if (
          $hys
            .parent()
            .next()
            .html()
        ) {
          var ids = $hys
            .parent()
            .next()
            .html()
            .match(/wishID:(\w+)/)
          if (ids) return 'http://www.haiyingshuju.com/wish/wish/detail.html?pid=' + ids[1]
        }
      }
      $(item.css).each(function(index, el) {
        var $hys = $(el)
        if (el.dataset.sm) return
        el.dataset.sm = true
        if (getUrl($hys)) insertFetchBtn($hys, getUrl($hys), 'hy')
      })
    })
  }
}

/*
 根据a自动插入采集按钮
 $a 超链接元素
 url 超链接地址
 */
function insertFetchBtn($a, url, status) {
  var $body = $('body')
  $a.addClass('link') //头部悬浮01
  //$a.parent().addClass('link-box');
  let $crawlPanel = operationPanelTemplate()
  let $crawlSelect = operationSelectTemplate()

  var $crawlBg = $('<div class="emalacca-plugin-mask"></div>')
  var $firstImg = $a.find('img:first-child')
  let hrefItem = $a.attr('href')
  const hrefReg = /^#/
  // 判断href是否正确
  if (hrefReg.test(hrefItem)) {
    return
  }
  var linkruleHref = getRule(location.href)
  var CONFIG_OBJ = JSON.parse(linkruleHref)
  var pageType = new Function('url', CONFIG_OBJ.detect)(location.href)
  var sumaitongShowArr = ['category', 'sortlist']
  var imgALBBUrl =
    'https://s.1688.com/youyuan/index.htm?tab=imageSearch&imageType=https://cbu01.alicdn.com&imageAddress='
  // 1688
  if (url.indexOf('1688.com') > -1 && $firstImg.length == 0) {
    $firstImg = $a.find('.img:first-child')
    var styleString = ''
    if ($firstImg.length > 0) {
      $firstImg.each(function() {
        styleString = $(this).prop('style').backgroundImage
      })
      styleString.replace(/\/img\/.*?(\.(png|jpg|gif|jpeg|webp))/, function(items, item) {
        imgALBBUrl = imgALBBUrl + items
      })
      $crawlPanel.find('.emalacca-goods-btn[data-type=view]').attr({
        'data-href': imgALBBUrl
      })
    } else {
      // 文字不采集
      return
    }
  } else if (url.indexOf('1688.com') > -1 && $firstImg.length > 0) {
    var $imgSrc = $a.find('.offer-img>img')
    var srcString = ''
    if ($imgSrc.length === 0) {
      $imgSrc = $a.find('img:first-child')
    }
    if ($imgSrc.length > 0) {
      $imgSrc.each(function() {
        srcString = $(this).prop('src')
      })
      srcString.replace(/\/img\/.*?(\.(png|jpg|gif|jpeg|webp))/, function(items, item) {
        imgALBBUrl = imgALBBUrl + items
      })
      $crawlPanel.find('.emalacca-goods-btn[data-type=view]').attr({
        'data-href': imgALBBUrl
      })
    }
  }
  // 隐藏div
  var hideCreationDiv = function() {
    $crawlPanel.css({
      display: 'none'
    })
    $crawlSelect.css({
      'pointer-events': 'none'
    })
    var isSelected = $crawlSelect.attr('data-selected')
    // 查看是否选中
    if (isSelected === '0') {
      $crawlSelect.css({
        display: 'none'
      })
    }
    $crawlBg.css('display', 'none')
  }
  // 列表页显示
  if ($firstImg.length > 0) {
    // 淘宝列表采集(广告商品需要改url)
    if (sumaitongShowArr.includes(pageType) && url.indexOf('click.simba.taobao.com/cc') > -1) {
      url = taobaoTranslationUrl($a, url)
      if (url === '') {
        return
      }
    }
    // 1688列表采集(广告商品需要改url)
    if (sumaitongShowArr.includes(pageType) && url.indexOf('dj.1688.com/ci_') > -1) {
      url = albbTranslationUrl($a)
      if (url === '') {
        return
      }
    }
    // lazada列表采集(小图不显示采集按钮)
    if (sumaitongShowArr.includes(pageType) && url.indexOf('www.lazada.') > -1) {
      var classString = $a.attr('class')
      if (classString.indexOf('c1dZ-V') > -1) {
        return
      }
    }

    $crawlSelect.attr({
      'data-selecturl': url
    })
    // 列表引入
    if (sumaitongShowArr.includes(pageType)) {
      if (!/(shopee\.)|(xiapibuy\.)/.test(window.location.host)) {
        $a.after($crawlBg)
        $('body').append($crawlPanel)
      }

      $a.after($crawlSelect)

      // $a.css({
      //   display: 'inline-block'
      // })
      $a.parent().css('position', 'relative')
      // 隐藏div
      $a.parent().on('mouseleave', function() {
        hideCreationDiv()
      })
    }
  }
  //非列表页
  if (!sumaitongShowArr.includes(pageType)) {
    // $crawl.insertAfter($body)
    
    // 隐藏div
    $a.on('mouseleave', function() {
      $crawlPanel.css({
        display: 'none'
      })
    })

    $crawlPanel.on('mouseleave', function() {
      $(this).css({
        display: 'none'
      })
    })
  }
  $a.on('mouseenter', function() {
    if (sumaitongShowArr.includes(pageType)) {
      // 列表页显示
      var $isShowImgGather = $(this).find('img:first-child')
      if (url.indexOf('1688.com') > -1 && $isShowImgGather.length == 0) {
        $isShowImgGather = $(this).find('.img:first-child')
      }
      if ($isShowImgGather.length > 0) {
        $crawlSelect.css({
          'pointer-events': 'auto',
          display: 'block'
        })
        $crawlBg.css('display', 'block')
      }
      var href = '',
        crawlTop,
        crawlLeft,
        firstImgTop,
        firstImgLeft,
        top,
        left
      if (status == 'hy') $isShowImgGather = $a
      href = $(this).attr('href')
      crawlTop = $crawlPanel.offset().top
      crawlLeft = $crawlPanel.offset().left
      if ($isShowImgGather.length > 0) {
        firstImgTop = $isShowImgGather.offset().top
        firstImgLeft = $isShowImgGather.offset().left
      } else {
        firstImgTop = $a.offset().top
        firstImgLeft = $a.offset().left
      }
      firstImgLeft ? (left = firstImgLeft) : (left = crawlLeft)
      firstImgTop ? (top = firstImgTop) : (top = crawlTop)
      let contentWidth = $(this).width() ? $(this).width() : $isShowImgGather.width()
      let contentHeight = $(this).height() ? $(this).height() : $isShowImgGather.height()
      $crawlPanel.find('.emalacca-goods-btn[data-type=collect]').each(function() {
        $(this).attr({
          'data-url': href
        })
      })

      $crawlPanel.css({
        top: top + parseInt(contentHeight / 2),
        left: left + parseInt(contentWidth / 2),
        transform: 'translateY(-50%) translateX(-50%)',
        display: 'block'
      })
      let $that = $(this)
      $crawlPanel.on('mouseenter', function() {
        $(this).css({
          display: 'block'
        })
        $that
          .parent()
          .find('.emalacca-plugin-goods-acquisition-select')
          .css({
            display: 'block'
          })
        $that
          .parent()
          .find('.emalacca-plugin-mask')
          .css({
            display: 'block'
          })
      })
    } else {
      // 非列表页
      // shopee&&xiapi不显示
      if (!/(shopee\.)|(xiapibuy\.)/.test(window.location.host)) {
        $('body').append($crawlPanel)
      } else {
        return
      }
      locationBtn($(this),  $crawlPanel)
      // $crawlPanel.find('.emalacca-goods-btn[data-type=collect]').each(function() {
      //   $(this).attr({
      //     'data-url': href
      //   })
      // })
      // $crawlPanel.css({
      //   top: top + parseInt(contentHeight / 2),
      //   left: left + parseInt(contentWidth / 2),
      //   transform: 'translateY(-50%) translateX(-50%)',
      //   display: 'block'
      // })
      $crawlPanel.on('mouseenter', function() {
        $(this).css({
          display: 'block'
        })
      })
    }
    // 1688添加低价货源
    if (url.indexOf('1688.com') === -1) {
      $crawlPanel.find('.emalacca-goods-btn[data-type=view]').css({
        display: 'none'
      })
    }
  })
  // 选中商品
  $crawlSelect.on('click', function() {
    //去对应的链接
    var isSelected = $(this).attr('data-selected')
    if (isSelected === '0') {
      $(this).css({
        'border-width': '0'
      })
      $(this)
        .find('.emalacca-goods-icon-select')
        .css({
          display: 'block'
        })
      $(this).attr({
        'data-selected': '1'
      })
      return false
    } else {
      $(this).css({
        'border-width': '2px'
      })
      $(this)
        .find('.emalacca-goods-icon-select')
        .css({
          display: 'none'
        })
      $(this).attr({
        'data-selected': '0'
      })
      return false
    }
  })

  // 单采
  $crawlPanel.find('.emalacca-goods-btn[data-type=collect]').on('click', function() {
    if ($('.alert').length > 0) $('.alert').remove()
    if (!$(this).hasClass('success')) {
      $(this)
        .find('.emalacca-goods-btn[data-type=collect]')
        .text('采集中...')
      imageCrawl(url, $(this), 1) //采集操作
    }
    return false
  })
  // 1688低价货源
  $crawlPanel.find('.emalacca-goods-btn[data-type=view]').on('click', function() {
    var hrefString = $(this).attr('data-href')
    window.open(hrefString)
    return false
  })
}

// 在图片上直接采集
export function imageCrawl(url, $span, type, crawlType, noBrandDetect, isSuccessPrompt) {
  var imageCrawlEnd = function(data) {
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
        if (result.code == 0) {
          if ($span) {
            $span.css({
              color: '#fff',
              backgroundColor: '#67c23a',
              borderColor: '#67c23a'}).html('采集成功')
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
        // 淘宝广告页处理(获取正确的url)
        if (urls.indexOf('taobao.com') > -1) {
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
          if (result.code == '0') {
            $.fn.message({ type: 'success', msg: MESSAGE.success.savehaveBeenAdd })
            $span.css({
              color: '#fff',
              backgroundColor: '#67c23a',
              borderColor: '#67c23a'}).html('采集成功')
          } else {
            // 后台返回错误信息
            if (!noBrandDetect) {
              if ($span) $span.find('.emalacca-goods-btn[data-type=collect]').text('重新采集')
            } else {
              $span.html('重新采集')
            }
            $.fn.message({ type: 'success', msg: result.msg })
          }
        })
      })
  }
  getLoginInfo(data => {
    imageCrawlEnd(data)
  })
}

function fetchHide(url) {
  var FetchType = true
  if (url.indexOf('kj.1688.com/') !== -1 || url.indexOf('seller.shopee') !== -1) {
    FetchType = false
  }
  return FetchType
}

//当前链接是否为有效链接
function validArea(a) {
  var $a = $(a)
  return (
    $a.find('img').length ||
    $a.css('background-image') !== 'none' ||
    $a.html().indexOf('background') !== -1
  )
}

function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

