import $ from 'jquery'
import { getRule } from '@/lib/rules'
import { CONFIGINFO } from '@/background/config.js'
import { ShopeModal } from '@/background/config/modal.js'
import { Html } from '@/background/server/html.js'
import { Crawl } from '@/background/server/crawl.js'
import { taobaoTranslationUrl, albbTranslationUrl } from '@/lib/handle-url'
import { operationPanelTemplate, operationSelectTemplate, collectText } from './content-template'
import { MESSAGE } from '../lib/conf'
// import { setItem, getItem } from '@/lib/chrome'

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
//显示通知
//msg 消息内容
var progress_timeout

//progress进度条
function notifyProgress(sum, succNum, failNum) {
  var progressHtml =
    '<div class="sellerwant-progress-box"><p class="ellerwant-progress-txt"></p><div class="sellerwant-progress-inner"><span></span><div class="sellerwant-progress-bg"></div></div><p class="sellerwant-progress-results"><span class="sellerwant-progress-results-success"></span><span class="sellerwant-progress-results-failure"></span></p></div>'
  clearTimeout(progress_timeout)
  if (sum == 0) {
    $(progressHtml).appendTo('body')
    $('.sellerwant-progress-box').fadeTo(1000, 1)
    $('.sellerwant-progress-box')
      .find('.ellerwant-progress-txt')
      .text('采集中')
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-inner>span')
      .text('0%')
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-bg')
      .css({ width: '0' })
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-results>.sellerwant-progress-results-success')
      .text('成功 0')
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-results>.sellerwant-progress-results-failure')
      .text('失败 0')
  } else if (sum !== 100) {
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-inner>span')
      .text(sum + '%')
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-bg')
      .css({ width: sum + '%' })
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-results>.sellerwant-progress-results-success')
      .text('成功 ' + succNum)
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-results>.sellerwant-progress-results-failure')
      .text('失败 ' + failNum)
  } else if (sum == 100) {
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-inner>span')
      .text('100%')
    $('.sellerwant-progress-box')
      .find('.ellerwant-progress-txt')
      .text('采集完成')
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-bg')
      .css({ width: '100%' })
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-results>.sellerwant-progress-results-success')
      .text('成功 ' + succNum)
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-results>.sellerwant-progress-results-failure')
      .text('失败 ' + failNum)
    progress_timeout = setTimeout(function() {
      $('.sellerwant-progress-box').fadeOut(3000, function() {
        $('.sellerwant-progress-box').remove()
        // 采集完成清除样式
        hintBatch()
      })
    }, 3000)
  }
}

//----------------------------------------------新增内容---------------------------------------------
var CONFIG,
  OPTIONS = {}
//分类采集使用的url
var urls = ''
var uid = ''
var dataArr = [] //存放重复的采集数据
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

var shopeeCrawlSetTime, //定时控制shoppe采集，初始化时间
  shopeeUrl = window.location.href,
  timed

function timedCount() {
  shopeeUrl = window.location.href
  timed = setTimeout('timedCount()', 1000)
  if (
    shopeeUrl.indexOf('shopee.') === -1 ||
    shopeeUrl.indexOf('tw.shopeesz.com') === -1 ||
    shopeeUrl.indexOf('xiapibuy.com') === -1
  ) {
    clearTimeout(timed)
  } else if (
    (shopeeUrl.indexOf('shopee.') !== -1 ||
      shopeeUrl.indexOf('tw.shopeesz.com') !== -1 ||
      shopeeUrl.indexOf('xiapibuy.com') !== -1) &&
    shopeeUrl.indexOf('-i.') !== -1
  ) {
    $('.fetch').remove()
    preload()
    clearTimeout(timed)
  }
}
timedCount()

if (document.contentType === 'text/html') {
  chrome.storage.sync.get(
    {
      showPageFetchBar: true,
      showProductFetchBtn: true
    },
    function(data) {
      OPTIONS = data
      if (
        shopeeUrl.indexOf('shopee.') !== -1 ||
        shopeeUrl.indexOf('tw.shopeesz.com') !== -1 ||
        shopeeUrl.indexOf('xiapibuy.com') !== -1
      ) {
        $('.fetch').remove()
        $(document)
          .off('DOMNodeInserted', '#main')
          .on('DOMNodeInserted', '#main', function() {
            if (typeof shopeeCrawlSetTime !== undefined) {
              clearTimeout(shopeeCrawlSetTime)
              shopeeCrawlSetTime = null
            }
            shopeeCrawlSetTime = setTimeout(function() {
              $('.fetch').remove()
              preload()
            }, 500)
          })
      }
      preload()
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
    var test = new Function('url', CONFIG.detect)(location.href)
    showTip(test, location.href)
    $(window).scroll(debounceHandleLinks)
  } catch (e) {
    return
  }
}
//过滤超链接，将满足条件的图片上加上采集按钮
//fnBody 过滤方法的方法体
function handleLinks(fnBody) {
  if (!OPTIONS.showProductFetchBtn) return
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
  var href = ''
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
    // shopee&&xiapi不显示
    if (!/(shopee\.)|(xiapibuy\.)/.test(window.location.host)) {
      $('body').append($crawlPanel)
    }
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
      // 活动页
      // shopee&&xiapi不显示
      if (/(shopee\.)|(xiapibuy\.)/.test(window.location.host)) {
        return
      }
      var $firstImg = $a.find('img:first-child'),
        href = '',
        crawlTop,
        crawlLeft,
        firstImgTop,
        firstImgLeft,
        top,
        left
      if (status == 'hy') $firstImg = $a
      href = $a.attr('href')
      crawlTop = $crawlPanel.offset().top
      crawlLeft = $crawlPanel.offset().left
      if ($firstImg.length > 0) {
        firstImgTop = $firstImg.offset().top
        firstImgLeft = $firstImg.offset().left
      } else {
        firstImgTop = $a.offset().top
        firstImgLeft = $a.offset().left
      }
      firstImgLeft ? (left = firstImgLeft) : (left = crawlLeft)
      firstImgTop ? (top = firstImgTop) : (top = crawlTop)

      let contentWidth = $(this).width() ? $(this).width() : $firstImg.width()
      let contentHeight = $(this).height() ? $(this).height() : $firstImg.height()

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
    }
    // 1688添加低价货源
    if (url.indexOf('1688.com') > -1) {
      $crawl.find('.cheap-supply-goods').css({
        'pointer-events': 'auto',
        display: 'block',
        padding: '5px 0px'
      })
    } else {
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
    isBatchGather = false // 取消采集选中的状态
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
// 批量采集提示
function hintBatch() {
  $('.fetch .FetchBtn').css('pointer-events', 'auto')
  $('.fetch .fetch-selectBtn').css('pointer-events', 'auto')
  $('.fetch .fetch-selectBtn').html('采集选中')
  $('.fetch .FetchBtn').html('采集本页')
  isBatchGather = false
}
// 是否批量采集选中
var isBatchGather = false
var batchGatherObj = {
  batchGatherSum: 0, // 请求完的总数
  batchGatherLength: 0, // 需要请求的总数
  batchSuccessNum: 0, // 成功数
  batchErrorNum: 0 // 失败数
}
var batchTimer = null // 延时器
// 批量采集提示2
function hintNotifyProgress(isSucc) {
  window.clearTimeout(batchTimer)
  batchGatherObj.batchGatherSum++
  if (isSucc) {
    batchGatherObj.batchSuccessNum++
  } else {
    batchGatherObj.batchErrorNum++
  }
  var num = (batchGatherObj.batchGatherSum / batchGatherObj.batchGatherLength).toFixed(2)

  num = parseInt(num * 100)

  if (batchGatherObj.batchGatherSum == batchGatherObj.batchGatherLength) {
    notifyProgress(100, batchGatherObj.batchSuccessNum, batchGatherObj.batchErrorNum)
  } else {
    notifyProgress(num, batchGatherObj.batchSuccessNum, batchGatherObj.batchErrorNum)
    batchTimer = window.setTimeout(function() {
      batchGatherObj.batchErrorNum =
        batchGatherObj.batchGatherLength - batchGatherObj.batchSuccessNum
      notifyProgress(100, batchGatherObj.batchSuccessNum, batchGatherObj.batchErrorNum)
    }, 10000)
  }
}

// 在图片上直接采集
function imageCrawl(url, $span, type, crawlType, noBrandDetect, isSuccessPrompt) {
  var imageCrawlEnd = function(data) {
    if (!data.status) {
      $.fn.message({ type: 'error', msg: MESSAGE.error.checkIsAuthedERP })
      if ($span) $span.find('.emalacca-goods-btn[data-type=collect]').text('请登录')
      return
    }
    uid = data.data.token
    urls = window.location.href
    // brandData = JSON.parse(data.brandData)

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
        if (isBatchGather) {
          var isSucc = result.code == '0'
          hintNotifyProgress(isSucc)
        } else if (result.code == 0) {
          if ($span) {
            $span
              .addClass('emalacca-plugin-success')
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

        // 判断是否是1688登录地址
        if (data.detailUrl.includes('https://login.1688.com/')) {
          $.fn.message({ type: 'error', msg: MESSAGE.error.pleaseLogin1688 })
          return
        }
        if (data.detailUrl.includes('https://login.tmall.com/')) {
          $.fn.message({ type: 'error', msg: MESSAGE.error.pleaseLoginTmall })

          return
        }
        if (data.detailUrl.includes('https://login.taobao.com/')) {
          $.fn.message({ type: 'error', msg: MESSAGE.error.pleaseLoginTaobao })

          return
        }
        if (data.detailUrl.includes('https://login.aliexpress.com/')) {
          $.fn.message({ type: 'error', msg: MESSAGE.error.pleaseLoginAliexpress })
          return
        }
        try {
          if ($span && !!$span.attr('data-saleprice')) {
            data.price = $span.attr('data-saleprice')
          }
        } catch (e) {
          // console.log(e)
        }

        var hsaBrand = false
        if (!noBrandDetect) {
          //不过滤
          // brandData.forEach(item => {
          //     if (data.productTitle.toLowerCase().includes(item.toLowerCase())) return hsaBrand = true
          // })
        }
        if (!hsaBrand) {
          Html.postCrawlHtml(CONFIGINFO.url.postCrawlHtml(), data, 0, function(result) {
            if (isBatchGather) {
              var isSucc = result.code == '0'
              hintNotifyProgress(isSucc)
            } else if (result.code == '0') {
              var objCrawl = result.repeatCrawlProduct
              var isRepeat = 0
              // if (type != '1') $('.fetch').hide();
              if (objCrawl) isRepeat = objCrawl.repeatCrawl
              //判断是够重复
              if (isRepeat == 1) {
                if (confirm('该产品在系统后台已有采集记录，是否继续采集？')) {
                  data.repeatCheck = 0
                  Html.postCrawlHtml(CONFIGINFO.url.postCrawlHtml(), data, 0, function(results) {
                    if (results.code == '00') {
                      if ($span)
                        $span
                          .addClass('emalacca-plugin-success')
                          .find('.emalacca-goods-btn[data-type=collect]')
                          .text('采集成功')
                      $.fn.message({ type: 'success', msg: MESSAGE.success.savehaveBeenAdd })
                    }
                  })
                } else {
                  if ($span) $span.find('.emalacca-goods-btn[data-type=collect]').text('采到后台')
                }
              } else {
                if (!noBrandDetect) {
                  //正常过滤提示
                  if ($span) {
                    $span
                      .addClass('emalacca-plugin-success')
                      .find('.emalacca-goods-btn[data-type=collect]')
                      .text('采集成功')
                  }

                  if (crawlType === 'detail') {
                    $('.fetch').show()
                    $('.fetch-btn.FetchDetailBtn').text('重新采集')
                  }
                } else {
                  //不过滤弹框
                  $span.addClass('emalacca-plugin-success').html('采集成功')
                  $('.fetch').show()
                }
                if (!isSuccessPrompt) {
                  $.fn.message({ type: 'success', msg: MESSAGE.success.collectSuccess })
                }
              }
            } else {
              // 后台返回错误信息
              if (!noBrandDetect) {
                if ($span) $span.find('.emalacca-goods-btn[data-type=collect]').text('重新采集')
                $('.fetch-btn.FetchDetailBtn').text('重新采集')
              } else {
                $span.html('重新采集')
              }
              $.fn.message({ type: 'success', msg: result.msg })
            }
          })
        } else {
          // 含有品牌词
          if ($span) $span.find('.emalacca-goods-btn[data-type=collect]').text('重新采集')
          $('.fetch-btn.FetchDetailBtn').text('重新采集')
          $.fn.message({
            type: 'warning',
            msg: `该产品包含品牌词信息 <button id="singleRightNowCrawl" data-url="${data.detailUrl}"  type="button" class="brandBtn">确认采集</button>`
          })

          // 忽略品牌词直接采集
          $('#singleRightNowCrawl').on('click', function() {
            //去对应的链接
            var url = data.detailUrl
            imageCrawl(url, $(this), '', 'detail', true, true)
            $(this).html('采集中...')
          })
        }
      })
  }
  checkLoginStatus(imageCrawlEnd)
}

function fetchHide(url) {
  var FetchType = true
  if (url.indexOf('kj.1688.com/') !== -1 || url.indexOf('seller.shopee') !== -1) {
    FetchType = false
  }
  return FetchType
}

function showTip(type, url) {
  // 不是列表和详情页的隐藏【采集本页】按钮
  var isShowPageArr = ['category', 'sortlist', 'detail']
  var fetchHideType = fetchHide(url)
  if (fetchHideType && type == 'detail') {
    // 详情页
    $(
      '<div class="fetch Fetch"><span class="fetch-con FetchCon"></span><button  class=" btn btn-primaryMy fetch-btn FetchBtn FetchDetailBtn" action="fetch" href="javascript:">采集本页</button><span class="close Close" title="关闭" action="Close">×</span></div>'
    ).appendTo('body')
  } else if (
    fetchHideType &&
    (type == 'category' || type == 'sortlist') &&
    url.indexOf('yangkeduo.com') === -1
  ) {
    // 列表页
    $(
      '<div class="fetch Fetch" id="sellerwant-gather-list"><div><button  class="btn fetch-btn fetch-selectBtn" action="fetch" href="javascript:">采集选中</button></div><div><button  class=" btn fetch-btn FetchBtn" action="fetch" href="javascript:">采集本页</button></div><div><button  class=" btn fetch-selectAllBtn" action="fetch" href="javascript:">全选</button></div><span class="close Close" title="关闭" action="Close">×</span></div>'
    ).appendTo('body')
  }
  // else if (fetchHideType && !isShowPageArr.includes(type)) {    // 列表页
  //     $('<div class="fetch Fetch" id="sellerwant-gather-list"><div><button  class="btn fetch-btn fetch-selectBtn" action="fetch" href="javascript:">采集选中</button></div><div><button  class=" btn fetch-selectAllBtn" action="fetch" href="javascript:">全选</button></div><span class="close Close" title="关闭" action="Close">×</span></div>').appendTo('body');
  // }
  $('.fetch').hide()
  if (type == 'category' || type == 'sortlist' || !isShowPageArr.includes(type)) {
    $('.fetch').show()
    $('.source').hide()
    // 采集本页
    $('.fetch .FetchBtn').on('click', function() {
      var showTipCategoryEnd = function(data) {
        if (!data.status) {
          // $('.fetch-btn').text('请登录');
          $.fn.message({ type: 'error', msg: MESSAGE.error.checkIsAuthedERP })
          return
        }
        isBatchGather = true
        batchGatherObj = {
          batchGatherSum: 0,
          batchGatherLength: $('.emalacca-plugin-goods-acquisition-select').length,
          batchSuccessNum: 0,
          batchErrorNum: 0
        }
        $('.fetch .FetchBtn').css('pointer-events', 'none')
        $('.fetch .fetch-selectBtn').css('pointer-events', 'none')
        $('.fetch .FetchBtn').html('采集中...')
        $('.emalacca-plugin-goods-acquisition-select').each(function(index) {
          if (index === 0) {
            // 批量采集，显示进度条
            notifyProgress(0)
          }
          var urlString = $(this).attr('data-selecturl')
          imageCrawl(urlString, $(this), 1) //采集操作
        })
      }
      checkLoginStatus(showTipCategoryEnd)
    })
    // 采集选中
    $('.fetch .fetch-selectBtn').on('click', function() {
      var showTipCategorySelect = function(data) {
        if (!data.status) {
          $.fn.message({ type: 'error', msg: MESSAGE.error.checkIsAuthedERP })
          return
        }
        var selectNum = 0
        $('.emalacca-plugin-goods-acquisition-select').each(function() {
          if ($(this).attr('data-selected') === '1') {
            ++selectNum
          }
        })
        if (selectNum === 0) {
          $.fn.message({ type: 'error', msg: MESSAGE.error.pleaseSelectSomeGoods })
          return
        }
        if (selectNum > 50) {
          $.fn.message({ type: 'error', msg: MESSAGE.error.beyondMaximumLimit })
          return
        }
        isBatchGather = true
        batchGatherObj = {
          batchGatherSum: 0,
          batchGatherLength: selectNum,
          batchSuccessNum: 0,
          batchErrorNum: 0
        }
        $('.fetch .fetch-selectBtn').css('pointer-events', 'none')
        $('.fetch .FetchBtn').css('pointer-events', 'none')
        $('.fetch .fetch-selectBtn').html('采集中...')
        var num = 0 // 是否是第一个
        $('.emalacca-plugin-goods-acquisition-select').each(function() {
          if ($(this).attr('data-selected') === '1') {
            if (num === 0) {
              // 批量采集，显示进度条
              notifyProgress(0)
            }
            num++
            var urlString = $(this).attr('data-selecturl')
            imageCrawl(urlString, $(this), 1) //采集操作
          }
        })
      }
      checkLoginStatus(showTipCategorySelect)
    })
    // 全选
    $('.fetch .fetch-selectAllBtn').on('click', function() {
      // 选中商品
      $('.emalacca-plugin-goods-acquisition-select').attr({
        'data-selected': '1'
      })
      $('.emalacca-plugin-goods-acquisition-select').css({
        'border-width': '0',
        'pointer-events': 'auto',
        display: 'block'
      })
      $('.emalacca-plugin-goods-acquisition-select')
        .find('.emalacca-goods-icon-select')
        .css({
          display: 'block'
        })
    })
  } else if (type == 'detail') {
    isBatchGather = false
    $('.fetch').show()
    $('.fetch-con').text('单品采集')
    $('.fetch-btn').on('click', function() {
      $(this).html('采集中...')
      imageCrawl(url, null, '', 'detail')
    })
  }
  //文档载入之后执行
  $('.fetch .close').on('click', function(e) {
    if (e && e.preventDefault) {
      //非IE浏览器
      e.preventDefault()
    } else {
      //IE浏览器(IE11以下)
      window.event.returnValue = false
    }
    $('.fetch').hide()
    ShopeModal.hide('#repeatCrawlModal')
    return false //取消冒泡行为
  })
}

$(function() {
  $('.repeatCrawDefaultBtn').on('click', function() {
    ShopeModal.hide('#repeatCrawlModal')
  })
  $("input[name='curPage']").on('click', function() {
    if (this.checked) {
      $("input[name='sourceUrlRepeat']").each(function() {
        $(this).prop('checked', true)
      })
    } else {
      $("input[name='sourceUrlRepeat']").each(function() {
        $(this).prop('checked', false)
      })
    }
  })
  $(document).off('click', '#checkUrl')
  $(document).on('click', '#checkUrl', function() {
    $('#CopyUrl').select()
    document.execCommand('copy')
  })
})
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

//获取登录状态
function checkLoginStatus(call) {
  var checkLoginStatusEnd = function(data) {
    call(data)
  }
  sendMessageToBackground('checkLoginStatus', '', checkLoginStatusEnd)
}
