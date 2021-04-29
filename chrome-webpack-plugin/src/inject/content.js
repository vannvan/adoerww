import $ from 'jquery'
import { getRule } from '@/lib/rules'
import {
  operationPanelTemplate,
  operationSelectTemplate,
  operationSpideredTemplate
} from './content-template'
import { MESSAGE, getSiteLink } from '../lib/conf'
import { isEmpty, debounce } from '@/lib/utils'
import Follow from './shopee'
import {
  imageCrawl,
  taobaoTranslationUrl,
  albbTranslationUrl,
  postHasCrawl,
  handleUploadImages
} from './crawl-handler'
import getBtnLocationItems from '@/lib/location-btn'
import { getLoginInfo } from '@/lib/chrome-client'
import { getStorageSync } from '@/lib/chrome'
//----------------------------------------------新增内容---------------------------------------------
const linkrule = getRule(location.href)

const CONFIG = linkrule ? JSON.parse(linkrule) : null

chrome.extension.onMessage.addListener(function(message, sender, callback) {
  if (message.ID !== 'content') {
    return
  }
  switch (message.action) {
    case 'notify':
      $.fn.message({
        type: 'error',
        msg: message.msg
      })
      break
    case 'handleLinks':
      debounceHandleLinks()
      break
  }
})

const debounceHandleLinks = debounce(function() {
  if (CONFIG && CONFIG.detail) {
    handleLinks(CONFIG.detail)
  }
}, 800)

if (CONFIG) {
  // 判断插件是否被停用
  getStorageSync('isDisabledPlug').then(data => {
    if (!data['isDisabledPlug']) {
      $(document).ready(handleLinks(CONFIG.detail))
      $(window).scroll(debounceHandleLinks)
    }
  })
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
        if (getUrl($hys)) insertFetchBtn($hys, getUrl($hys))
      })
    })
  }
}

/*
 根据a自动插入采集按钮
 $a 超链接元素
 url 超链接地址
 */
function insertFetchBtn($a, url) {
  let $crawlPanel = operationPanelTemplate() // 操作按钮
  let $crawlSelect = operationSelectTemplate() // 多选复选框
  let $crawlSpidered = operationSpideredTemplate() // 已采集标识
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
  // 1688 商品图片处理
  if (url.indexOf('1688.com') > -1 && $firstImg.length == 0) {
    $firstImg = $a.find('.img')
    if ($firstImg.length > 0) {
      let divImgString = $firstImg.css('background-image')
      divImgString.replace(/\/img\/.*?(\.(png|jpg|gif|jpeg|webp))/, function(items, item) {
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
  } else if (/(shopee\.)|(xiapibuy\.)/.test(url)) {
    let storeId = url.split('-i.')[1]
    $crawlPanel.attr({
      'data-store-id': storeId
    }) // 虾皮整上storeid
  }

  // lazada列表采集(小图不显示采集按钮, 大图初始化默认为0)
  if (sumaitongShowArr.includes(pageType) && url.indexOf('www.lazada.') > -1) {
    if ($firstImg.length > 0 && $firstImg.width() < 37 && 0 < $firstImg.width()) {
      return
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
  // 加载遮罩层和多选，操作界面
  let appendItems = () => {
    // 列表引入
    $a.after($crawlBg)
    $('body').append($crawlPanel)
    $a.after($crawlSelect)
    $a.parent().css('position', 'relative')
    // 隐藏div
    $a.parent().on('mouseleave', function() {
      hideCreationDiv()
    })
  }

  // 列表页显示
  if (sumaitongShowArr.includes(pageType)) {
    if ($firstImg.length > 0) {
      // 淘宝列表采集(广告商品需要改url) 获取真实url判断是否采集过
      if (url.indexOf('click.simba.taobao.com/cc') > -1) {
        url = taobaoTranslationUrl($a, url) ? taobaoTranslationUrl($a, url) : url
      }
      // 1688列表采集(广告商品需要改url)  获取真实url判断是否采集过
      if (url.indexOf('dj.1688.com/ci_') > -1) {
        url = albbTranslationUrl($a) ? albbTranslationUrl($a) : url
      }
      // 单独处理速卖通，卖家首页商品样式
      if (location.href.indexOf('aliexpress.com/store') > -1) {
        $a.parents('.img').append($crawlBg)
        $('body').append($crawlPanel)
        $a.parents('.img').append($crawlSelect)
        $a.parents('.img').css('position', 'relative')
        // 隐藏div
        $a.parents('.img').on('mouseleave', function() {
          hideCreationDiv()
        })
      } else{
        // 处理淘宝小图显示
        if (location.href.indexOf('taobao.com') > -1 && ($firstImg.width() > 30 || $a.width() > 30)) {
          appendItems()
        } else if (location.href.indexOf('taobao.com') === -1) {
          appendItems()
        }
        
      }
    } else if (url.indexOf('dhgate.com') > -1 && $a.hasClass('pic')) {
      // 敦煌列表的商品，img延迟加载处理
      appendItems()
    }
    $crawlSelect.attr({
      'data-selecturl': url
    })
  }

  $a.on('mouseenter', function() {
    
    //   如果是列表
    if (sumaitongShowArr.includes(pageType)) {
      // 列表页显示
      var $isShowImgGather = $(this).find('img:first-child')
      if (url.indexOf('1688.com') > -1 && $isShowImgGather.length == 0) {
        $isShowImgGather = $(this).find('.img')
      }
      if (url.indexOf('dhgate.com') > -1 && $isShowImgGather.length == 0) {
        $isShowImgGather = $(this).find('img')
      }
      if ($isShowImgGather.length > 0 ) {
        $crawlSelect.css({
          'pointer-events': 'auto',
          display: 'block'
        })
        $crawlBg.css('display', 'block')
      }
      let $that = $(this)

      $crawlPanel.on('mouseenter', function() {
        // 单独处理速卖通，卖家首页商品样式
        if (location.href.indexOf('aliexpress.com/store') > -1) {
          $that
            .parents('.img')
            .find('.emalacca-plugin-goods-acquisition-select')
            .css({
              display: 'block'
            })
          $that
            .parents('.img')
            .find('.emalacca-plugin-mask')
            .css({
              display: 'block'
            })
        } else {
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
        }
      })
    } else {
      // 非列表页
      if (!$(this).attr('data-emalacca-btn') !== '1') {
        $('body').append($crawlPanel)
        $(this).attr('data-emalacca-btn', '1')
      }
    }
    let locationParams = getBtnLocationItems($(this))
    const { imgTop, imgLeft, imgHeight, imgWidth, imgUrl } = locationParams
    // width>36 1688的商品有视频按钮，按钮的宽度为37
    // 操作按钮显示$crawlPanel
    if (!isEmpty(imgTop) && imgWidth > 36) {
      $crawlPanel.css({
        top: imgTop + parseInt(imgHeight / 2),
        left: imgLeft + parseInt(imgWidth / 2),
        transform: 'translateY(-50%) translateX(-50%)',
        display: 'block'
      })
    }

    // 已经标识过的商品，不再调用接口
    if ($(this).attr('data-emalacca-spidered') !== '1') {
      // 当前商品是否已采集
      postHasCrawl(url).then(data => {
        if (data) {
          $(this).attr('data-emalacca-spidered', '1')
          // 引入角标
          $('body').append($crawlSpidered)
          $crawlSpidered.css({
            top: imgTop,
            left: imgLeft,
            display: 'block'
          })
        }
      })
    }

    $crawlPanel.on('mouseenter', function() {
      $(this).css({
        display: 'block'
      })
    })
    $crawlPanel.on('mouseleave', function() {
      $(this).css({
        display: 'none'
      })
    })
    // 隐藏div
    $a.on('mouseleave', function() {
      $crawlPanel.css({
        display: 'none'
      })
    })
    // 只有1688, 虾皮显示低价货源
    if (url.indexOf('1688.com') === -1 && !/(shopee\.)|(xiapibuy\.)/.test(url)) {
      $crawlPanel.find('.emalacca-goods-btn[data-type=view]').css({
        display: 'none'
      })
    }

    // 查看店铺，获取粉丝, 只有虾皮才显示
    if (!/(shopee\.)|(xiapibuy\.)/.test(url)) {
      $crawlPanel.find('.emalacca-goods-btn[data-type=view-store]').css({
        display: 'none'
      })
      $crawlPanel.find('.emalacca-goods-btn[data-type=get-follower]').css({
        display: 'none'
      })
    } else {
      // 给虾皮的商品a标签添加imgurl
      $crawlPanel.attr('data-emalacca-imgurl', imgUrl)
    }
  })
  // 选中商品
  $crawlSelect.on('click', function() {
    //去对应的链接
    var isSelected = $(this).attr('data-selected')
    if (isSelected === '0') {
      // 选中时操作
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
    }
    // 显示采集选中的数量
    let selectedLen = [
      ...document.querySelectorAll('.emalacca-plugin-goods-acquisition-select')
    ].filter(item => item.getAttribute('data-selected') == 1).length
    let text = selectedLen > 0 ? '采集选中（' + selectedLen + '）' : '采集选中'
    $('.emalacca-plugin-quick-action-sub-button[data-action-type=collect-selected]').text(text)
    return false
  })

  // 采集商品
  $crawlPanel.find('.emalacca-goods-btn[data-type=collect]').on('click', function() {
    getLoginInfo(data => {
      // 判断是否登录
      if (!data.status) {
        $.fn.message({
          type: 'error',
          msg: MESSAGE.error.checkIsAuthedERP
        })
        return
      }
      $(this)
        .find('.emalacca-goods-btn[data-type=collect]')
        .text('采集中...')
      imageCrawl(url, data, false, $(this)) //采集操作
    })
    return false
  })

  // 1688低价货源
  $crawlPanel.find('.emalacca-goods-btn[data-type=view]').on('click', function() {
    let hrefString = $(this).attr('data-href')
    if (isEmpty(hrefString)) {
      let imgUrl = $(this)
        .parent()
        .attr('data-emalacca-imgurl')
      handleUploadImages(imgUrl).then(data => {
        if (data.code === -1) {
          $.fn.message({ type: 'error', msg: MESSAGE.error.checkIsAuthedERP })
          return
        }
        let newFileUrl = data[0]
        if (!isEmpty(newFileUrl)) {
          let imgUrls = newFileUrl.split(/\.com\//)
          hrefString =
            'https://s.1688.com/youyuan/index.htm?tab=imageSearch&imageType=' +
            imgUrls[0] +
            '.com&imageAddress=/' +
            imgUrls[1]
          window.open(hrefString)
        }
      })
    } else {
      window.open(hrefString)
    }

    return false
  })

  //查看店铺
  $crawlPanel.find('.emalacca-goods-btn[data-type=view-store]').on('click', function() {
    let storeId = $(this)
      .parent()
      .attr('data-store-id')
    let realStoreId = storeId ? storeId.split('.')[0] : null
    if (!realStoreId) {
      $.fn.message({
        type: 'warning',
        msg: MESSAGE.error.faildGetGoodsInfo
      })
      return false
    }
    window.open(`${window.location.origin}/shop/${realStoreId}`)
  })

  // 获取粉丝
  $crawlPanel.find('.emalacca-goods-btn[data-type=get-follower]').on('click', function() {
    let storeId = $(this)
      .parent()
      .attr('data-store-id')
    let realStoreId = storeId ? storeId.split('.')[0] : null
    if (!realStoreId) {
      $.fn.message({
        type: 'warning',
        msg: MESSAGE.error.faildGetGoodsInfo
      })
      return false
    }
    // window.open(`${getSiteLink('front', location.host, true)}/shop/${realStoreId}/followers`)
    Follow.syncShoppeBaseInfo().then(res => {
      if (res.code == -1) {
        $.fn.message({
          type: 'warning',
          msg: MESSAGE.error.pleaseCheckWhetherHaveAuthoriz
        })
      } else {
        window.open(`${getSiteLink('front', location.host, true)}/shop/${realStoreId}/followers`)
        // window.open(`/shop/${realStoreId}/followers?other=true`)
      }
    })
  })
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
