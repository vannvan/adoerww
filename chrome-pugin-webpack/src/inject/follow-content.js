//粉丝关注相关
import Vue from 'vue'
import $ from 'jquery'
import { throttle, getCookie, debounce } from '@/lib/utils'
import { getRule } from '@/lib/rules'
import { dragApp } from './drag'
import { sendMessageToBackground, getURL } from '@/lib/chrome-client.js'
import Home from '@/components/Home.vue'
import WUI from '@/components/index'
import '@/wui-theme/src/index.scss'

//初始化虾皮网站的基础脚本
if (/shopee|xiapibuy/.test(window.location.host)) {
  let rightFixed = document.createElement('div')
  rightFixed.id = 'ShoppeFollow'
  document.body.appendChild(rightFixed)

  setTimeout(() => {
    Vue.use(WUI)
    new Vue({
      el: '#ShoppeFollow',
      render: (createElement) => {
        return createElement(Home)
      },
    })
    Follow.init()
    Follow.sendCsrfToken()
  }, 500)
}

//粉丝关注
const Follow = {
  domain: window.location.origin,
  init: function() {
    // console.log(this.domain, 'domain')
    let followActionWrap = $("<div id='FollowActionWrap'></div>")
    $('body').append(followActionWrap)
    dragApp()
  },

  insertAction: function(type) {
    let followItemHtml = $('<div></div>')
    $('a').each(function() {
      //   if(/-i/.test($(this)[0].href))
      var test = new Function('url', type)($(this)[0].href)
      console.log(test)
      if ($(this)[0].href && test) {
        let storeId = $(this)[0].href.split('i.')[1]
        $(this).attr('sp-store-id', storeId)
        let followItem = $(
          `
          <div class="emalacca-plugin-goods-panel-wrap">
            <span class="emalacca-goods-panel-button emalacca-get-follow-button" data-store-id="${storeId}">获取粉丝</span>
            <span class="emalacca-goods-panel-button">采集商品</span>    
          </div>
          `
        )
        followItemHtml.append(followItem)
        //鼠标进入
        $(this).on('mouseenter', function() {
          let firstImg = $(this).find('img:first-child')
          let offsetTop, offsetLeft
          if (firstImg.length > 0) {
            offsetTop = firstImg.offset().top
            offsetLeft = firstImg.offset().left
          }
          offsetTop = $(this).offset().top
          offsetLeft = $(this).offset().left
          followItem.css({
            top: offsetTop + 20,
            left: offsetLeft + 20,
            opacity: 1,
            'pointer-events': 'auto',
          })
        })
      }
    })
    $('#FollowActionWrap').html($(followItemHtml))
    Follow.initFollowEvent()
  },
  //获取粉丝事件初始化
  initFollowEvent: function() {
    //按钮点击
    $('.emalacca-get-follow-button').on('click', function() {
      let _this = this
      let storeId = $(_this).attr('data-store-id')
      if (storeId) {
        let realId = storeId.split('.')[0]
        window.open(`/shop/${realId}/followers?other=true`)
      }
    })
  },
  //获取店铺信息
  getStoreInfoById: function(storeId) {
    return new Promise((resolve, reject) => {
      sendMessageToBackground(
        'request',
        { domain: this.domain, storeId: storeId },
        'GET_SHOPPE_STORE_INFO_BY_ID',
        (data) => {
          resolve(data)
        }
      ).then((res) => {
        resolve(res)
      })
    })
  },

  //批量获取关注者信息
  getStoreFollowers: function(userName) {
    return new Promise((resolve) => {
      sendMessageToBackground(
        'request',
        { domain: this.domain, userName: userName },
        'GET_STORE_FOLLOEWERS_INFO',
        (data) => {
          resolve(data)
        }
      ).then((res) => {
        resolve(res)
      })
    })
  },

  //给后台传送csrfToken
  sendCsrfToken: function() {
    return new Promise((resolve) => {
      sendMessageToBackground(
        'auth',
        { csrfToken: getCookie('csrftoken') },
        'SET_SHOPPE_CRSF_TOKEN',
        (data) => {
          resolve(data)
        }
      ).then((res) => {
        resolve(res)
      })
    })
  },

  //通知后台关注或取关
  notifyBackFollowOrUnFollow: function(actionType, shopid) {
    return new Promise((resolve) => {
      sendMessageToBackground(
        'request',
        { domain: this.domain, actionType: actionType, shopid: shopid },
        'POST_SHOPPE_FOLLOW_ACTION',
        (data) => {
          resolve(data)
        }
      ).then((res) => {
        resolve(res)
      })
    })
  },

  //获取当前登录的店铺id
  getCurrentStoreId: function() {
    return new Promise((resolve) => {
      sendMessageToBackground(
        'request',
        { domain: this.domain },
        'GET_CURRENT_STORE_ID',
        (data) => {
          resolve(data)
        }
      ).then((res) => {
        resolve(res)
      })
    })
  },

  //同步虾皮基础信息
  syncShoppeBaseInfo: function() {
    return new Promise((resolve) => {
      sendMessageToBackground(
        'auth',
        { domain: this.domain },
        'SYNC_SHOPPE_BASE_INFO',
        (data) => {
          resolve(data)
        }
      ).then((res) => {
        resolve(res)
      })
    })
  },

  handleGotoDemo() {
    window.open(getURL('options.html'))
  },
}

// window.onscroll = function() {
//   let linkrule = getRule(window.location.origin)
//   const CONFIG = JSON.parse(linkrule)
//   try {
//     CONFIG = JSON.parse(linkrule)
//     handleLinks(CONFIG.detail)
//     // var test = new Function('url', CONFIG.detect)(location.href)
//     // showTip(test, location.href)
//     // $(window).scroll(Follow.insertAction())
//     Follow.insertAction()
//   } catch (e) {
//     return
//   }
//   //   var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
//   //   if (scrollTop > 2000) {
//   //     throttle(Follow.insertAction(), 500)
//   //   }
// }

var timed = null
var shopeeUrl = null
var CONFIG = null
function timedCount() {
  console.log('timedCount')
  //   shopeeUrl = window.location.href
  //   timed = setTimeout('timedCount()', 1000)
  //   if (
  //     shopeeUrl.indexOf('shopee.') === -1 ||
  //     shopeeUrl.indexOf('tw.shopeesz.com') === -1 ||
  //     shopeeUrl.indexOf('xiapibuy.com') === -1
  //   ) {
  //     console.log('clearTimeout')
  //     clearTimeout(timed)
  //   } else if (
  //     (shopeeUrl.indexOf('shopee.') !== -1 ||
  //       shopeeUrl.indexOf('tw.shopeesz.com') !== -1 ||
  //       shopeeUrl.indexOf('xiapibuy.com') !== -1) &&
  //     shopeeUrl.indexOf('-i.') !== -1
  //   ) {
  //     preload()
  //     clearTimeout(timed)
  //   }
  preload()
}

//获取当前域名配置信息
function preload() {
  console.log('preload')
  var linkrule = getRule(location.href)
  try {
    CONFIG = JSON.parse(linkrule)
    Follow.insertAction(CONFIG.detail)
    // var test = (new Function("url", CONFIG.detect))(location.href);
    $(window).scroll(debounceHandleLinks)
  } catch (e) {
    return
  }
}

var debounceHandleLinks = debounce(function() {
  if (CONFIG && CONFIG.detail) {
    Follow.insertAction(CONFIG.detail)
  }
}, 800)

timedCount()

export default Follow
