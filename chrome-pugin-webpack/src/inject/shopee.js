//粉丝关注相关
import Vue from 'vue'
import $ from 'jquery'
import { getCookie, debounce, isEmpty } from '@/lib/utils'
import { getRule } from '@/lib/rules'
import { dragApp } from './drag'
import { sendMessageToBackground, getURL } from '@/lib/chrome-client.js'
import Home from '@/components/Home.vue'
import WUI from '@/components/index'
import '@/wui-theme/src/index.scss'
import { dataViewElementTemplate, operationPanelTemplate, collectText } from './template'
import { solidCrawl } from './shopee-crawl'
require('@/background/config/message')

const EmalaccaPluginGoodsPanelWrapClass = '.emalacca-plugin-goods-panel-wrap' //操作面板容器
const EmalaccaPluginGoodsDataViewClass = '.emalacca-plugin-goods-data-view' //数据展示容器

const ClassPrefix = 'emalacca-plugin'

var CONFIG = null //站点规则

//初始化虾皮网站的基础脚本
if (/shopee|xiapibuy/.test(window.location.host)) {
  let rightFixed = document.createElement('div')
  rightFixed.id = 'ShoppeFollow'
  document.body.appendChild(rightFixed)

  setTimeout(() => {
    Vue.use(WUI)
    new Vue({
      el: '#ShoppeFollow',
      render: createElement => {
        return createElement(Home)
      }
    })
    Follow.init()
    Follow.sendCsrfToken()
  }, 500)
}

//添加操作面板
const debounceHandleActions = debounce(function() {
  if (CONFIG && CONFIG.detail) {
    Follow.setGoodDetailInfoToPanel()
    Follow.insertAction(CONFIG.detail)
  }
}, 800)

//粉丝关注
const Follow = {
  domain: window.location.origin,
  goodsMap: new Map(), //页面可操作商品映射，属性名为urlId ，值为采集状态  默认采集商品 -> 采集中 -> 采集成功
  preload: function() {
    let linkrule = getRule(location.href)
    try {
      CONFIG = JSON.parse(linkrule)
      Follow.insertAction(CONFIG.detail)
      $(window).scroll(debounceHandleActions)
    } catch (e) {
      return
    }
  },

  //粉丝关注应用初始化
  init: function() {
    // console.log(this.domain, 'domain')
    let followActionWrap = operationPanelTemplate()
    $('body').append(followActionWrap)

    Follow.initPanelEvent()
    dragApp()
  },

  //给a标签添加操作面板
  insertAction: function(type) {
    $.each(document.links, function(index, a) {
      $(a).mouseenter(function(param) {
        let storeId = $(this)[0].href.split('-i.')[1]
        if (isEmpty(storeId)) return

        let firstImg = $(this).find('img:first-child')
        let contentOffsetLeft = $(this).offset().left
          ? $(this).offset().left
          : firstImg.offset().left
        let contentOffsetTop = $(this).offset().top ? $(this).offset().top : firstImg.offset().top
        let contentWidth = $(this).width() ? $(this).width() : firstImg.width()
        // 操作面板显示
        let actionListElement = $(EmalaccaPluginGoodsPanelWrapClass)
        actionListElement.attr('data-store-id', storeId)
        actionListElement.attr('data-store-url', $(this)[0].href)
        actionListElement.css({
          top: contentOffsetTop + 30,
          left: contentOffsetLeft + parseInt((contentWidth - 150) / 2),
          opacity: 1,
          'pointer-events': 'auto'
        })

        // 鼠标进入
        $(EmalaccaPluginGoodsPanelWrapClass).mouseenter(function() {
          let targetCollectStatus = Follow.goodsMap.get(storeId) || 'collect'
          //   给当前商品对应的状态赋值
          $(this)
            .find('span')
            .eq(1)
            .text(collectText[targetCollectStatus].name)
            .css({ background: collectText[targetCollectStatus].color, opacity: 1 })
        })
        //鼠标离开
        $(EmalaccaPluginGoodsPanelWrapClass).mouseleave(function() {
          $(this).css('opacity', 0)
        })
      })
    })
  },

  //操作面板点击事件初始化
  initPanelEvent: function() {
    $(EmalaccaPluginGoodsPanelWrapClass).on('click', 'span', function(e) {
      let actionType = e.target.getAttribute('data-type')
      let storeId = $(this)
        .parent()
        .attr('data-store-id')
      let collectUrl = $(this)
        .parent()
        .attr('data-store-url')
      if (isEmpty(storeId)) return
      let realStoreId = storeId ? storeId.split('.')[0] : null
      if (!realStoreId) {
        $.fn.message({ type: 'warning', msg: '【马六甲插件】:未获取到商品信息' })
        return false
      }
      switch (actionType) {
        //   粉丝关注
        case 'follow':
          Follow.syncShoppeBaseInfo().then(res => {
            if (res.result && res.result.error == -1) {
              $.fn.message({ type: 'warning', msg: '【马六甲插件】:请登录虾皮卖家中心' })
            } else {
              window.open(`/shop/${realStoreId}/followers?other=true`)
            }
          })
          break
        //   采集商品
        case 'collect':
          $(EmalaccaPluginGoodsPanelWrapClass)
            .find('span')
            .eq(1)
            .text(collectText['pending'].name)
            .css({ background: collectText['pending'].color })
          Follow.goodsMap.set(storeId, 'pending')
          Follow.syncSolidCrawl(collectUrl).then(
            res => {
              Follow.goodsMap.set(storeId, 'success')
              $.fn.message({ type: 'success', msg: '采集成功' })
            },
            err => {
              Follow.goodsMap.set(storeId, 'fail')
              $.fn.message({ type: 'danger', msg: err.msg || '采集错误' })
            }
          )
          break
        //   查看店铺
        case 'view':
          window.open(`shop/${realStoreId}`)
          break
        default:
          break
      }
    })
  },

  //获取数据展示面板需要的数据，并赋值
  setGoodDetailInfoToPanel: function() {
    let allGoodsList = [...document.querySelectorAll('a')]
      .map(el =>
        /-i/.test(el.getAttribute('href')) ? el.getAttribute('href').split('-i.')[1] : null
      )
      .filter(Boolean)
    this.getGoodsListDetailInfo(allGoodsList).then(res => {
      if (res.code == 0 && res.result.items) {
        let { items } = res.result
        $('a').each(function() {
          let href = $(this)[0].href
          if (href.search('buyer') > 0) return
          let test = new Function('url', CONFIG.detail)(href) //链接是否匹配
          let storeId = $(this)[0].href.split('-i.')[1]
          if (isEmpty(storeId)) return
          let itemId = storeId ? storeId.split('.')[1] : null
          //   console.log(storeId)
          let storeInfo = items.find(el => el.itemid == itemId)
          if ($(this)[0].href && test && storeInfo) {
            let dataViewElement = dataViewElementTemplate(storeId, storeInfo)
            let aElExit = $(this)
              .children()
              .is(EmalaccaPluginGoodsDataViewClass)
            let subElElExit = $(this)
              .children()
              .children()
              .children()
              .is(EmalaccaPluginGoodsDataViewClass)
            // 如果当前a标签有高度就在下一级添加
            if ($(this).height() > 0 && !aElExit) {
              $(this).append(dataViewElement)
            }
            // 如果当前a标签没有高度就在下下一级添加
            if ($(this).height() == 0 && !subElElExit) {
              $(this)
                .children()
                .children()
                .append(dataViewElement)
            }
          }
        })
      }
    })
  },

  //获取店铺列表详情，数据展示
  getGoodsListDetailInfo: function(goodsList) {
    return new Promise((resolve, reject) => {
      sendMessageToBackground(
        'request',
        { domain: this.domain, goodsList: goodsList || [] },
        'GET_SHOPPE_ITEM_LIST_INFO',
        data => {
          resolve(data)
        }
      )
    })
  },

  //获取店铺信息
  getStoreInfoById: function(storeId) {
    return new Promise((resolve, reject) => {
      sendMessageToBackground(
        'request',
        { domain: this.domain, storeId: storeId },
        'GET_SHOPPE_STORE_INFO_BY_ID',
        data => {
          resolve(data)
        }
      )
    })
  },

  //批量获取关注者信息
  getStoreFollowers: function(userName) {
    return new Promise(resolve => {
      sendMessageToBackground(
        'request',
        { domain: this.domain, userName: userName },
        'GET_STORE_FOLLOEWERS_INFO',
        data => {
          resolve(data)
        }
      )
    })
  },

  //给后台传送csrfToken
  sendCsrfToken: function() {
    return new Promise(resolve => {
      sendMessageToBackground(
        'auth',
        { csrfToken: getCookie('csrftoken') },
        'SET_SHOPPE_CRSF_TOKEN',
        data => {
          resolve(data)
        }
      )
    })
  },

  //通知后台关注或取关
  notifyBackFollowOrUnFollow: function(actionType, shopid) {
    return new Promise(resolve => {
      sendMessageToBackground(
        'request',
        { domain: this.domain, actionType: actionType, shopid: shopid },
        'POST_SHOPPE_FOLLOW_ACTION',
        data => {
          resolve(data)
        }
      )
    })
  },

  //获取当前登录的店铺id
  getCurrentStoreId: function() {
    return new Promise(resolve => {
      sendMessageToBackground('request', { domain: this.domain }, 'GET_CURRENT_STORE_ID', data => {
        resolve(data)
      })
    })
  },

  //同步虾皮基础信息
  syncShoppeBaseInfo: function() {
    return new Promise(resolve => {
      sendMessageToBackground('auth', { domain: this.domain }, 'SYNC_SHOPPE_BASE_INFO', data => {
        resolve(data)
      })
    })
  },

  //采集商品
  syncSolidCrawl: function(url) {
    return new Promise((resolve, reject) => {
      solidCrawl(url, res => {
        if (res.code == 0) {
          resolve(res)
        } else {
          reject(res)
        }
      })
    })
  },

  //去粉丝关注演示页面
  handleGotoDemo() {
    window.open(getURL('options/options.html'))
  }
}

Follow.preload()

export default Follow
