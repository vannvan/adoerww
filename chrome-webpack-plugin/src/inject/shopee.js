//粉丝关注相关
import $ from 'jquery'
import { getCookie, debounce, isEmpty } from '@/lib/utils'
import { sendMessageToBackground, getURL } from '@/lib/chrome-client.js'
import { dataViewElementTemplate, operationPanelTemplate, collectText } from './template'
import { solidCrawl } from './shopee-crawl'
import { MESSAGE, getSiteLink } from '../lib/conf'
require('@/background/config/message')

const Cookies = require('js-cookie')

var curTs = Date.now
  ? function() {
      return Date.now()
    }
  : function() {
      return +new Date()
    }
var rStringChoices = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
function _rc_set(key, len, domain, expires) {
  var oldV = null
  // Note: To avoid breaking server-rendered csrf logic, we should always use the one in the cookie if possible. Otherwise server-rendered FORMs with CRSF inside them will break.
  if (oldV) return oldV
  var newV = randomString(len)
  //   $.cookie(key, newV, { path: '/', domain: domain, expires: expires })
  return newV
}
function randomString(length, chars) {
  chars = _defaultFor(chars, rStringChoices)
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))]
  return result
}

function _defaultFor(arg, val) {
  return typeof arg !== 'undefined' ? arg : val
}

function delCookie() {
  var keys = document.cookie.match(/[^ =;]+(?==)/g)
  if (keys) {
    for (var i = keys.length; i--; ) {
      document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
      document.cookie =
        keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
      document.cookie =
        keys[i] + '=0;path=/;domain=ratingdog.cn;expires=' + new Date(0).toUTCString() // 清除一级域名下的或指定的，例如 .ratingdog.cn
    }
  }
}

// 两个cookies重点方法，解决关注功能403的问题
Cookies.set('csrftoken', _rc_set('SPC_F', 32, null, new Date(curTs() + 86400 * 1000 * 365 * 20)), {
  expires: 7
})

// Cookies.remove('_gcl_au')
Cookies.remove('_gcl_au', { path: '' }) // removed!

//添加操作面板
const debounceHandleActions = debounce(function() {
  Follow.setGoodDetailInfoToPanel()
}, 800)

//粉丝关注
const Follow = {
  domain: location.origin,
  preload: function() {
    try {
      $(window).scroll(debounceHandleActions)
    } catch (e) {
      return
    }
    Follow.syncShoppeBaseInfo()
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
        {
          csrfToken: getCookie('csrftoken') || window.csrf,
          domain: this.domain
        },
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

  //同步虾皮基础信息
  syncShoppeBaseInfo: function() {
    return new Promise(resolve => {
      sendMessageToBackground('auth', { domain: this.domain }, 'SYNC_SHOPEE_BASE_INFO', data => {
        console.log('SYNC_SHOPEE_BASE_INFO', data)
        if (data && data.code == 0) {
          console.log('SPC_CDS', Cookies.get('SPC_CDS'))
          if (/xiapibuy|shopee\.cn/.test(location.host)) {
            // 虾皮的xiapibuy.com的登录状态需要这个cookies值才能同步给页面
            Cookies.set('SPC_EC', data.result.cs_token, { expires: 7 })
          }
        } else {
          delCookie()
          console.log('clear cookies')
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

  // 到erp获取虾皮用户的粉丝列表，
  getFollowersOfShopeeUser: function({ countryCode, shopId }) {
    return new Promise(resolve => {
      sendMessageToBackground(
        'request',
        { countryCode: countryCode, shopId: shopId },
        'GET_FOLLOWERS_OF_SHOPEE_USER',
        data => {
          resolve(data)
        }
      )
    })
  },

  //去粉丝关注演示页面
  handleGotoDemo() {
    window.open(getURL('options/options.html'))
  }
}

export default Follow
