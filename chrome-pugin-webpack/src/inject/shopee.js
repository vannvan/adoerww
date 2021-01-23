//粉丝关注相关
import Vue from 'vue'
import $$ from 'jquery'
import { getCookie, debounce } from '@/lib/utils'
import { getRule } from '@/lib/rules'
import { dragApp } from './drag'
import { sendMessageToBackground, getURL } from '@/lib/chrome-client.js'
import Home from '@/components/Home.vue'
import WUI from '@/components/index'
import '@/wui-theme/src/index.scss'
import { Popup } from '@/lib/popup'

const popup = new Popup()

// var timed = null
// var shopeeUrl = null
var CONFIG = null

var globalGoodsInfo = {}

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

//添加操作面板
const debounceHandleActions = debounce(function() {
  if (CONFIG && CONFIG.detail) {
    Follow.insertAction(CONFIG.detail)
  }
}, 800)

//粉丝关注
const Follow = {
  domain: window.location.origin,
  goodsList: [],
  preload: function() {
    let linkrule = getRule(location.href)
    try {
      CONFIG = JSON.parse(linkrule)
      Follow.insertAction(CONFIG.detail)
      $$(window).scroll(debounceHandleActions)
    } catch (e) {
      return
    }
  },
  init: function() {
    // console.log(this.domain, 'domain')
    let followActionWrap = $$(`
    <div class="emalacca-plugin-goods-panel-wrap">
        <span class="emalacca-goods-panel-button" data-type="follow">获取粉丝</span>
        <span class="emalacca-goods-panel-button" data-type="collect">采集商品</span>   
        <span class="emalacca-goods-panel-button" data-type="view">查看店铺</span> 
    </div>
   `)
    $$('body').append(followActionWrap)
    Follow.initPanelEvent()
    dragApp()
  },

  insertAction: function(type) {
    let _this = this
    $$('a').each(function() {
      var test = new Function('url', type)($$(this)[0].href)
      if ($$(this)[0].href && test) {
        let storeId = $$(this)[0].href.split('-i.')[1]
        let dataViewElement = $$(
          `<div class="emalacca-plugin-goods-data-view" data-store-id="${storeId}">啊哈哈哈</div>`
        )
        if (!_this.goodsList.includes(storeId)) {
          _this.goodsList.push(storeId)
        }
        if (
          !$$(this)
            .children()
            .children()
            .is('.emalacca-plugin-goods-data-view')
        ) {
          $$(this)
            .children()
            .append(dataViewElement)
        }
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
          // 操作面板显示
          let actionListElement = $$('.emalacca-plugin-goods-panel-wrap')
          actionListElement.attr('data-store-id', storeId)
          actionListElement.css({
            top: offsetTop + 20,
            left: offsetLeft + 20,
            opacity: 1,
            'pointer-events': 'auto',
          })
        })
      }
    })
    this.getGoodsListDetailInfo(_this.goodsList).then((res) => {
      console.log(res)
      if (res.result.error == -1) {
        popup.toast('【马六甲ERP插件】:遇到未知的错误，虾皮店铺信息同步失败', 3)
      }
    })
  },

  //操作面板点击事件初始化
  initPanelEvent: function() {
    $$('.emalacca-plugin-goods-panel-wrap').on('click', 'span', function(e) {
      //   console.log(e.target.getAttribute('data-type'))
      let _this = this
      let actionType = e.target.getAttribute('data-type')
      let storeId = $$(_this)
        .parent()
        .attr('data-store-id')

      let realStoreId = storeId ? storeId.split('.')[0] : null
      if (!realStoreId) {
        popup.toast('【马六甲插件】:未获取到商品信息', 3)
        return false
      }
      switch (actionType) {
        //   粉丝关注
        case 'follow':
          window.open(`/shop/${realStoreId}/followers?other=true`)
          break
        case 'view':
          window.open(`shop/${realStoreId}`)
          break
        default:
          break
      }
    })
  },

  //获取店铺列表详情，数据展示
  getGoodsListDetailInfo: function(goodsList) {
    console.log(goodsList)
    return new Promise((resolve, reject) => {
      sendMessageToBackground(
        'request',
        { domain: this.domain, goodsList: goodsList },
        'GET_SHOPPE_ITEM_LIST_INFO',
        (data) => {
          resolve(data)
        }
      ).then((res) => {
        resolve(res)
      })
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

  //去粉丝关注演示页面
  handleGotoDemo() {
    window.open(getURL('options.html'))
  },
}

Follow.preload()

export default Follow
