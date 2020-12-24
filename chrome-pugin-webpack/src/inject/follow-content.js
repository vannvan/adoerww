import Vue from 'vue'
import $$ from 'jquery'
import { getURL } from '@/lib/chrome-client.js'
import Home from '@/components/Home.vue'

let rightFixed = document.createElement('div')
rightFixed.id = 'shopEdenContent'
document.body.appendChild(rightFixed)

setTimeout(() => {
  new Vue({
    el: '#shopEdenContent',
    render: (createElement) => {
      return createElement(Home)
    },
  })
}, 500)

//给后台发送消息
const sendMessageToBackground = function(action, options, type, callback) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      '',
      { action: action, options: options, type: type },
      callback.bind(resolve)
    )
  })
}

//节流
function throttle(fn, wait) {
  var timer = null
  return function() {
    var context = this
    var args = arguments
    if (!timer) {
      timer = setTimeout(function() {
        fn.apply(context, args)
        timer = null
      }, wait)
    }
  }
}

//粉丝关注
const Follow = {
  init: function() {
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
            window.open(
              `https://my.xiapibuy.com/shop/${realId}/followers?__classic__=1`
            )
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
        { storeId: storeId },
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
        { userName: userName },
        'GET_STORE_FOLLOEWERS_INFO',
        (data) => {
          resolve(data)
        }
      ).then((res) => {
        resolve(res)
      })
    })
  },
}

Follow.init()

window.onscroll = function() {
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop > 2000) {
    throttle(Follow.insertAction(), 500)
  }
}

export default Follow
