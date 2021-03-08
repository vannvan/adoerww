//粉丝关注相关
import $ from 'jquery'
import { getCookie, debounce, isEmpty } from '@/lib/utils'
import { sendMessageToBackground, getURL } from '@/lib/chrome-client.js'
import { dataViewElementTemplate, operationPanelTemplate, collectText } from './template'
import { solidCrawl } from './shopee-crawl'
import { MESSAGE, getSiteLink } from '../lib/conf'
require('@/background/config/message')

const Cookies = require('js-cookie')

const EmalaccaPluginGoodsPanelWrapClass = '.emalacca-plugin-goods-panel-wrap' //操作面板容器
const EmalaccaPluginGoodsDataViewClass = '.emalacca-plugin-goods-data-view' //数据展示容器

//添加操作面板
const debounceHandleActions = debounce(function() {
  Follow.setGoodDetailInfoToPanel()
  Follow.insertAction()
}, 800)

//粉丝关注
const Follow = {
  domain: window.location.origin,
  goodsMap: new Map(), //页面可操作商品映射，属性名为urlId ，值为采集状态  默认采集商品 -> 采集中 -> 采集成功
  preload: function() {
    try {
      Follow.insertAction()
      $(window).scroll(debounceHandleActions)
    } catch (e) {
      return
    }
  },

  //应用初始化
  init: function() {
    // console.log(this.domain, 'domain')
    let followActionWrap = operationPanelTemplate()
    $('body').append(followActionWrap)
    Follow.initPanelEvent()
  },

  //给a标签添加操作面板
  insertAction: function() {
    $.each(document.links, function(index, a) {
      $(a).mouseenter(function() {
        let storeId = $(this)[0].href.split('-i.')[1]
        if (isEmpty(storeId)) return
        try {
          let firstImg = $(this).find('img:first-child')
          let contentOffsetLeft = $(this).offset().left || firstImg.offset().left
          let contentOffsetTop = $(this).offset().top || firstImg.offset().top
          let contentWidth = $(this).width() || firstImg.width() || 190
          // 操作面板显示
          let actionListElement = $(EmalaccaPluginGoodsPanelWrapClass)
          actionListElement.attr('data-store-id', storeId) //粉丝关注用
          actionListElement.attr('data-store-url', $(this)[0].href) //采集用
          actionListElement.css({
            top: contentOffsetTop + 30,
            left: contentOffsetLeft + parseInt((contentWidth - 150) / 2),
            opacity: 1,
            'pointer-events': 'auto'
          })
        } catch (error) {
          console.log(error)
        }

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
        $.fn.message({ type: 'warning', msg: MESSAGE.error.faildGetGoodsInfo })
        return false
      }
      switch (actionType) {
        //   粉丝关注
        case 'follow':
          Follow.syncShoppeBaseInfo().then(res => {
            if (res.code == -1) {
              $.fn.message({ type: 'warning', msg: MESSAGE.error.pleaseCheckWhetherHaveAuthoriz })
            } else {
              //   window.open(`/shop/${realStoreId}/followers?other=true`)
              window.open(`${getSiteLink('cnfront')}/shop/${realStoreId}/followers`)
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
              $.fn.message({ type: 'success', msg: MESSAGE.success.collectSuccess })
            },
            err => {
              Follow.goodsMap.set(storeId, 'fail')
              $.fn.message({
                type: 'error',
                msg: err.msg || MESSAGE.error.collectExceptionEncounter
              })
            }
          )
          break
        //   查看店铺
        case 'view':
          window.open(`${window.location.origin}/shop/${realStoreId}`)
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

          let storeId = $(this)[0].href.split('-i.')[1]

          if (isEmpty(storeId)) return

          let itemId = storeId ? storeId.split('.')[1] : null

          let storeInfo = items.find(el => el.itemid == itemId)
          if ($(this)[0].href && storeInfo && !$(this).attr('data-view')) {
            let dataViewElement = dataViewElementTemplate(storeId, storeInfo)
            $(this).attr('data-view', true) //添加过的打上标记

            // 如果当前a标签有高度就在下一级添加
            if ($(this).height() > 0 && $(this).height() > 200) {
              $(this).append(dataViewElement)
            }

            // 如果当前a标签没有高度就在下下一级添加
            if (
              $(this).height() == 0 &&
              $(this)
                .children()
                .children()
                .height() > 200
            ) {
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
          if (data) {
            resolve(data)
          }
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
        { csrfToken: getCookie('csrftoken') || window.csrf, domain: this.domain },
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
  //   getCurrentStoreId: function() {
  //     return new Promise(resolve => {
  //       sendMessageToBackground('request', { domain: this.domain }, 'GET_CURRENT_STORE_ID', data => {
  //         resolve(data)
  //       })
  //     })
  //   },

  //同步虾皮基础信息
  syncShoppeBaseInfo: function() {
    return new Promise(resolve => {
      sendMessageToBackground('auth', { domain: this.domain }, 'SYNC_SHOPEE_BASE_INFO', data => {
        console.log('SYNC_SHOPEE_BASE_INFO', data)
        if (data.code == 0) {
          //   document.cookie = `SPC_EC=${data.result.cs_token}`
          Cookies.set('SPC_EC', data.result.cs_token, { expires: 7 })
        }
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

export default Follow
