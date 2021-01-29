// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     var html = $("html").html();
//     var url = message.url;
//     var data = { url: url, html: html, type: "rightCrawl", repeatCheck: 1 };
//     imageCrawl(url, null); //采集操作
// });
import $ from 'jquery'
import { getRule } from '@/lib/rules'
import { closeRepeatCrawl, submitRepeatCrawl } from '@/background/config/repeat'
import { CONFIGINFO } from '@/background/config.js'
import { ShopeModal } from '@/background/config/modal.js'
import { Html } from '@/background/server/html.js'
import { Crawl } from '@/background/server/crawl.js'

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

$(function() {
  $('#submitRepeatCrawl').on('click', submitRepeatCrawl)
})
//显示通知
//msg 消息内容
//type : normal 点击采集按钮即显示的内容 success 采集成功 error 采集失败
var sm_timeout
var progress_timeout
function notify(msg, type) {
  msg = msg || '采集到系统,请稍等...'
  var html =
    '<div class="notify ' +
    (type ? type : '') +
    '">' +
    msg +
    '<span class="remove_notify">×</span></div>'
  var len = $('body').find('.notify').length
  if (len == 0) {
    setToHtml(html)
  } else {
    clearTimeout(sm_timeout)
    sm_timeout = setTimeout(function() {
      $('body .notify').remove()
      setTimeout(setToHtml(html), 1000)
    }, 3000)
  }
}
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
      })
    }, 3000)
  }
}

function setToHtml(html) {
  $(html)
    .appendTo('body')
    .fadeIn(function() {
      var $el = $(this)
      $el.find('.remove_notify').on('click', function() {
        $(this)
          .closest('.notify')
          .remove()
      })
      sm_timeout = setTimeout(function() {
        $el.fadeOut(function() {
          $el.remove()
        })
      }, 5000) //5s 后消失
    })
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
      notify(message.msg)
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
  var $crawl = $(
    '<div class="solid-else-box"><span class="link-next" data-salePrice="" data-url=""><span class="link-con-box LinkConBox"><span class="link-con LinkCon">开始采集</span></span></span><div class="cheap-supply-goods" data-href="">低价货源</div></div>'
  )
  var $crawlSelect = $(
    '<div class="link-sellSelectBox" data-selected="0" data-selecturl=""><span class="icon iconfont link-sellSelect">&#x9e69;</span></div>'
  )
  var $crawlBg = $('<div class="link-sellMask"></div>')
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
      $crawl.find('.cheap-supply-goods').attr({
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
      $crawl.find('.cheap-supply-goods').attr({
        'data-href': imgALBBUrl
      })
    }
  }
  // 隐藏div
  var hideCreationDiv = function() {
    $crawl.css({
      display: 'none',
      'pointer-events': 'none'
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
    if (sumaitongShowArr.includes(pageType)) {
      $a.after($crawl)
      $a.after($crawlSelect)
      $a.after($crawlBg)
      $a.css({
        display: 'inline-block'
      })
      $a.parent().css('position', 'relative')
      // 隐藏div
      $a.parent().on('mouseleave', function() {
        hideCreationDiv()
      })
    }
  }
  if (!sumaitongShowArr.includes(pageType)) {
    $crawl.insertAfter($body)

    // 隐藏div
    $a.on('mouseleave', function() {
      $crawl.css({
        display: 'none',
        'pointer-events': 'none'
      })
    })
    $crawl.on('mouseenter', function() {
      $(this).css({
        'pointer-events': 'auto',
        display: 'block'
      })
    })
    $crawl.on('mouseleave', function() {
      $(this).css({
        display: 'none',
        'pointer-events': 'none'
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
        $crawl.find('.link-next').each(function() {
          $(this).attr({
            'data-url': href
          })
        })
        $crawl.find('.link-next').css({
          'pointer-events': 'auto',
          display: 'block',
          padding: '5px 0px'
        })
        $crawl.css({
          display: 'block'
        })
        $crawlSelect.css({
          'pointer-events': 'auto',
          display: 'block'
        })
        $crawlBg.css('display', 'block')
      }
    } else {
      // 活动页
      var $firstImg = $a.find('img:first-child'),
        href = '',
        crawlTop,
        crawlLeft,
        firstImgTop,
        firstImgLeft,
        pos,
        top,
        left
      if (status == 'hy') $firstImg = $a
      href = $a.attr('href')
      crawlTop = $crawl.offset().top
      crawlLeft = $crawl.offset().left
      if ($firstImg.length > 0) {
        firstImgTop = $firstImg.offset().top
        firstImgLeft = $firstImg.offset().left
      } else {
        firstImgTop = $a.offset().top
        firstImgLeft = $a.offset().left
      }
      firstImgLeft ? (left = firstImgLeft) : (left = crawlLeft)
      firstImgTop ? (top = firstImgTop) : (top = crawlTop)

      $crawl.find('.link-next').each(function() {
        $(this).attr({
          'data-url': href
        })
      })
      $crawl.css({
        // top: top + 5,
        // left: left + 50,
        top: top,
        left: left,
        display: 'block',
        'pointer-events': 'auto'
      })
    }
    // 1688添加低价货源
    if (url.indexOf('1688.com') > -1) {
      $crawl.find('.cheap-supply-goods').css({
        'pointer-events': 'auto',
        display: 'block',
        padding: '5px 0px'
      })
    }

    // 淘宝店铺获取折扣价格  天猫店铺获取折扣价格
    try {
      if (
        document.location.href.includes('taobao.com/search.htm?spm') ||
        document.location.href.includes('tmall.com/search.htm') ||
        !!$a
          .parent()
          .parent()
          .find('.c-price').length > 0
      ) {
        try {
          let salePrice = $a
            .parent()
            .parent()
            .find('.c-price')
            .text()
          if (salePrice) {
            $crawl.attr({
              'data-salePrice': salePrice
            })
            $crawlSelect.attr({
              'data-salePrice': salePrice
            })
          } else if (
            $a
              .parent()
              .parent()
              .find('.s-price')
              .text()
          ) {
            salePrice = $a
              .parent()
              .parent()
              .find('.s-price')
              .text()
            $crawl.attr({
              'data-salePrice': salePrice
            })
            $crawlSelect.attr({
              'data-salePrice': salePrice
            })
          }
        } catch (e) {
          // console.log(e)
        }
        // 淘宝搜索获取折扣价
      } else if (document.location.href.includes('s.taobao.com')) {
        try {
          let salePrice = $a
            .parent()
            .parent()
            .parent()
            .parent()
            .find('.g_price-highlight')
            .find('strong')
            .text()
          if (salePrice) {
            $crawl.attr({
              'data-salePrice': salePrice
            })
            $crawlSelect.attr({
              'data-salePrice': salePrice
            })
          }
        } catch (e) {
          // console.log(e)
        }
        // 天猫搜索获取折扣价
      } else if (document.location.href.includes('tmall.com/search_product')) {
        try {
          let salePrice = $a
            .parent()
            .parent()
            .find('.productPrice')
            .find('em')
            .attr('title')
          if (salePrice) {
            $crawl.attr({
              'data-salePrice': salePrice
            })
            $crawlSelect.attr({
              'data-salePrice': salePrice
            })
          }
        } catch (e) {
          // console.log(e)
        }
      }
    } catch (e) {
      // console.log(e)
    }
    return false
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
        .find('.link-sellSelect')
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
        .find('.link-sellSelect')
        .css({
          display: 'none'
        })
      $(this).attr({
        'data-selected': '0'
      })
      return false
    }
  })

  // 隐藏div
  // $a.on('mouseleave', function() {
  //     hideCreationDiv()
  // });
  // 单采
  $crawl.find('.link-next').on('click', function() {
    if ($('.notify').length > 0) $('.notify').remove()
    isBatchGather = false // 取消采集选中的状态
    var $span = $(this)
    if (!$span.hasClass('success')) {
      $span.find('.LinkConBox .LinkCon').text('采集中...')
      imageCrawl(url, $span, 1) //采集操作
    }
    return false
  })
  // 1688低价货源
  $crawl.find('.cheap-supply-goods').on('click', function() {
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
  // notify('成功采集' + batchGatherObj.batchSuccessNum + '条，采集失败' + batchGatherObj.batchErrorNum + '条', 'success');
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
  batchGatherObj.batchGatherSum++
  if (isSucc) {
    batchGatherObj.batchSuccessNum++
  } else {
    batchGatherObj.batchErrorNum++
  }
  var num = (batchGatherObj.batchGatherSum / batchGatherObj.batchGatherLength).toFixed(2)
  num = parseInt(num * 100)
  notifyProgress(num, batchGatherObj.batchSuccessNum, batchGatherObj.batchErrorNum)
  // 采集完成清除样式
  if (num === 100) {
    hintBatch()
  }
}

// 在图片上直接采集
function imageCrawl(url, $span, type, crawlType, noBrandDetect, isSuccessPrompt) {
  var imageCrawlEnd = function(data) {
    if (!data) {
      notify('您还未登录，请登录采集插件', 'error')
      $('.fetch-btn').text('请登录')
      if ($span) $span.find('.LinkConBox .LinkCon').text('采集到系统后台')
      return
    }
    uid = data.data.token
    urls = window.location.href
    // brandData = JSON.parse(data.brandData)
    //Amazon其他站点
    if (url.indexOf('/gp/product/') != -1 && url.indexOf('https://www.amazon.') != -1) {
      url = url
      //Amazon美国站
    } else if (
      (url.indexOf('/gp/') != -1 || url.indexOf('/dp/') != -1) &&
      urls.indexOf('www.amazon.com/') != -1 &&
      url.indexOf('www.amazon.com') == -1
    ) {
      url = 'https://www.amazon.com' + url
    }
    // 英国站的
    if (
      urls.indexOf('www.amazon.co.uk/') != -1 &&
      url.indexOf('/dp/') != -1 &&
      url.indexOf('www.amazon.co.uk') == -1
    ) {
      url = 'https://www.amazon.co.uk' + url
    }
    if (
      (url.indexOf('/gp/') != -1 || url.indexOf('/dp/') != -1) &&
      url.indexOf('www.amazon.') == -1 &&
      urls.indexOf('www.amazon.') != -1
    ) {
      urls = urls.substring(urls.indexOf('https://') + 8)
      urls = 'https://' + urls.substring(0, urls.indexOf('/') + 1)
      url = urls.substring(0, urls.length - 1) + url
    }
    //天猫处理
    if (url.indexOf('tmall.hk') !== -1) url = url.replace('tmall.hk', 'tmall.com')
    //易选品处理
    if (location.href.indexOf('yixuanpin.cn') !== -1 && url.indexOf('yixuanpin.cn') === -1) {
      url = 'https://yixuanpin.cn' + url
      if (location.href.indexOf('www.') !== -1) url = 'https://www.yixuanpin.cn' + url
    }
    if (url.indexOf('/en/products/') !== -1) {
      if (url.indexOf('https://www.joom.com') !== -1) {
        url = url
      } else {
        url = 'https://www.joom.com' + url
      }
    }
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
          notify('请先登录1688后再采集', 'error')
          return
        }
        if (data.detailUrl.includes('https://login.tmall.com/')) {
          notify('请先登录天猫后再采集', 'error')
          return
        }
        if (data.detailUrl.includes('https://login.taobao.com/')) {
          notify('请先登录淘宝后再采集', 'error')
          return
        }
        if (data.detailUrl.includes('https://login.aliexpress.com/')) {
          notify('请先登录速卖通后再采集', 'error')
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
              window.clearTimeout(batchTimer)
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
                          .addClass('linkSuccess')
                          .find('.LinkConBox .LinkCon')
                          .text('采集成功')
                      // notify('已添加到采集任务 <a class="aLable" href="' + CONFIGINFO.url.showAlreadyCrawl() + '" target="_blank">前往查看</a>', 'success');
                      notify('已添加到采集任务', 'success')
                    }
                  })
                } else {
                  if ($span) $span.find('.LinkConBox .LinkCon').text('采到后台')
                }
              } else {
                if (!noBrandDetect) {
                  //正常过滤提示
                  if ($span)
                    $span
                      .addClass('linkSuccess')
                      .find('.LinkConBox .LinkCon')
                      .text('采集成功')
                  if (crawlType === 'detail') {
                    $('.fetch').show()
                    $('.fetch-btn.FetchDetailBtn').text('重新采集')
                  }
                  if ($span)
                    $span
                      .addClass('linkSuccess')
                      .find('.LinkConBox .LinkCon')
                      .text('采集成功')
                } else {
                  //不过滤弹框
                  $span.addClass('linkSuccess').html('采集成功')
                  $('.fetch').show()
                }
                if (!isSuccessPrompt) {
                  // notify('已添加到采集任务 <a class="aLable" href="' + CONFIGINFO.url.showAlreadyCrawl() + '" target="_blank">前往查看</a>', 'success');
                  notify('采集成功', 'success')
                }
              }
            } else {
              // 后台返回错误信息
              if (!noBrandDetect) {
                if ($span) $span.find('.LinkConBox .LinkCon').text('重新采集')
                $('.fetch-btn.FetchDetailBtn').text('重新采集')
              } else {
                $span.html('重新采集')
              }
              notify(result.msg, 'error')
            }
          })
        } else {
          // 含有品牌词
          if ($span) $span.find('.LinkConBox .LinkCon').text('重新采集')
          $('.fetch-btn.FetchDetailBtn').text('重新采集')
          notify(
            '该产品包含品牌词信息 <button id="singleRightNowCrawl" data-url="' +
              data.detailUrl +
              '"  type="button" class="brandBtn">确认采集</button>',
            'error'
          )
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

function checkSiblingAllA($a) {
  var doms = $a.siblings()
  if (doms.length <= 2) return false
  var $el, el
  for (var i = 0, len = doms.length; i < len; i++) {
    el = doms[i]
    var $el = $(el)
    if ($el.hasClass('link-next')) continue
    if (el.tagName.toLowerCase() !== 'a') return false
  }
  return true
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
          notify('您还未登录，请登录采集插件', 'error')
          return
        }
        isBatchGather = true
        batchGatherObj = {
          batchGatherSum: 0,
          batchGatherLength: $('.link-sellSelectBox').length,
          batchSuccessNum: 0,
          batchErrorNum: 0
        }
        $('.fetch .FetchBtn').css('pointer-events', 'none')
        $('.fetch .fetch-selectBtn').css('pointer-events', 'none')
        $('.fetch .FetchBtn').html('采集中...')
        $('.link-sellSelectBox').each(function(index) {
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
          notify('您还未登录，请登录采集插件', 'error')
          return
        }
        var selectNum = 0
        $('.link-sellSelectBox').each(function() {
          if ($(this).attr('data-selected') === '1') {
            ++selectNum
          }
        })
        if (selectNum === 0) {
          notify('请选择需要采集的商品', 'error')
          return
        }
        if (selectNum > 50) {
          notify('批量采集不能超过50条', 'error')
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
        $('.link-sellSelectBox').each(function() {
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
      $('.link-sellSelectBox').attr({
        'data-selected': '1'
      })
      $('.link-sellSelectBox').css({
        'border-width': '0',
        'pointer-events': 'auto',
        display: 'block'
      })
      $('.link-sellSelectBox')
        .find('.link-sellSelect')
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
}

$(function() {
  //文档载入之后执行
  $('.Close').on('click', function(e) {
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

// 登录
function login() {}

// 处理淘宝列表里的广告url
function taobaoTranslationUrl($a, url) {
  var id = $a.attr('data-nid') || '' // 获取商品ID
  var $parents = $a.parents('.item.J_MouserOnverReq.item-ad') // 获取商品的祖父级
  var isTM = false
  if ($parents.length > 0) {
    var divTM = $parents.find('.icon-service-tianmao') // 判断祖父级里是否有天猫图标
    isTM = divTM.length > 0
  }
  var newUrl = ''
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
function albbTranslationUrl($a) {
  var id = ''
  var $parents = $a.parents('.ad-item')
  if ($parents.length > 0) {
    var string = $parents.attr('data-aplus-report')
    var arrId = string.match(/object_id@\w.+?\^/gi, '')
    if (arrId.length > 0) {
      id = arrId[0].replace(/\D/gi, '')
    }
  }
  var url = ''
  if (id) {
    url = 'https://detail.1688.com/offer/' + id + '.html'
  }
  return url
}
