import Vue from 'vue'
import $$ from 'jquery'
import { throttle, getCookie } from '@/lib/utils'
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
    let followActionWrap = $$("<div id='FollowActionWrap'></div>")
    $$('body').append(followActionWrap)
  },

  insertAction: function() {
    let followItemHtml = $$('<div></div>')
    $$('.stardust-tabs-panels__panel div a').each(function() {
      if ($$(this)[0].href && $$(this)[0].href.search('i.')) {
        let storeId = $$(this)[0].href.split('i.')[1]
        $$(this).attr('sp-store-id', storeId)

        let followItem = $$(
          `<span class="follow-next" data-store-id="${storeId}">获取粉丝</span>`
        )
        followItemHtml.append(followItem)
        //鼠标进入
        $$(this).on('mouseenter', function() {
          let firstImg = $$(this).find('img:first-child')
          let offsetTop, offsetLeft
          if (firstImg.length > 0) {
            offsetTop = firstImg.offset().top
            offsetLeft = firstImg.offset().left
          }
          offsetTop = $$(this).offset().top
          offsetLeft = $$(this).offset().left
          followItem.css({
            top: offsetTop + 20,
            left: offsetLeft + 20,
            opacity: 1,
            'pointer-events': 'auto',
          })
        })
        //按钮点击
        followItem.on('click', function() {
          let _this = this
          let storeId = $$(_this).attr('data-store-id')
          if (storeId) {
            let realId = storeId.split('.')[0]
            window.open(`/shop/${realId}/followers?other=true`)
          }
        })
      }
    })
    $$('#FollowActionWrap').html($$(followItemHtml))
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

window.onscroll = function() {
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop > 2000) {
    throttle(Follow.insertAction(), 500)
  }
}

export default Follow
