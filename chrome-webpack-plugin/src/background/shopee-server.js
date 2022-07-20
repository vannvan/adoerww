// 粉丝关注相关
// -1 接口错误 -2 数据错误
import $ from 'jquery'
import { getSiteLink, WEBSITES } from '@/lib/conf'
import { requestResult } from '@/lib/utils'
import { CONFIGINFO } from '@/background/config.js'
import { getCookies } from '@/lib/chrome'

// import { getAllTabs } from '@/lib/chrome'

function clearAllShopeeCookies(shopeeUrl) {
  console.log('清除cookies', shopeeUrl)
  chrome.cookies.getAll(
    {
      url: shopeeUrl
    },
    function(cookies) {
      cookies.map(el => {
        chrome.cookies.remove({
          url: shopeeUrl,
          name: el.name
        })
      })
    }
  )
}

/**
 * 将当前跨境站点的cookies同步至本土站点 或者反过来
 *
 * @param {*} cookies
 * @param {*} otherSites
 */
function syncAllSameSiteCookies(cookies, otherSites) {
  console.log('同步cookies', cookies)
  console.log('other sites', otherSites)
  otherSites.map(siteEl => {
    cookies.map(cookie => {
      chrome.cookies.set({
        url: siteEl,
        name: cookie.name,
        value: cookie.value
      })
    })
  })
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if (/logout/.test(details.url)) {
      //   console.log(details)
      console.log('退出')
      let currentUrl = details.initiator
      const countryList = WEBSITES.map(el => el.key)
      let countryCode = countryList.find(item => currentUrl.match(new RegExp(item))) || 'tw'
      let contrySiteInfo = WEBSITES.find(el => el.key == countryCode)
      let siteArr = Object.values(contrySiteInfo).filter(item => /http/.test(item))
      siteArr.map(el => {
        clearAllShopeeCookies(el)
      })
      localStorage.setItem('userInfo', null)
      localStorage.setItem('shopeeLoginStatus', -1)
      // setTimeout(() => {
      //   localStorage.setItem('shopeeLoginStatus', 1)
      // }, 20000) //生产环境调大
      localStorage.setItem('csrfToken', '')
    }
  },
  {
    urls: [
      '*://*.shopee.tw/*',
      '*://shopee.tw/*',
      '*://*.shopee.cn/*',
      '*://shopee.cn/*',
      '*://*.shopeesz.com/*',
      '*://*.shopee.co.id/*',
      '*://shopee.co.id/*',
      '*://*.shopee.vn/*',
      '*://shopee.vn/*',
      '*://shopee.co.th/*',
      '*://*.shopee.co.th/*',
      '*://shopee.ph/*',
      '*://*.shopee.ph/*',
      '*://shopee.com.my/*',
      '*://*.shopee.com.my/*',
      '*://shopee.sg/*',
      '*://*.shopee.sg/*',
      '*://shopee.com.br/*',
      '*://*.shopee.com.br/*',
      '*://shopee.com/*',
      '*://*.shopee.com/*',
      '*://*.xiapibuy.com/*',
      'https://*.xiapibuy.com/*-i.*/'
    ]
  },
  ['blocking', 'requestHeaders']
)
// 监控登录
chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (/login/.test(details.url) && details.statusCode === 200) {
      console.log('登录监听', details)
      let shopeeLoginStatus = localStorage.getItem('shopeeLoginStatus')
      let currentUrl = details.initiator
      const countryList = WEBSITES.map(el => el.key)
      let countryCode = countryList.find(item => currentUrl.match(new RegExp(item))) || 'tw'
      let contrySiteInfo = WEBSITES.find(el => el.key == countryCode)
      let siteArr = Object.values(contrySiteInfo).filter(item => /http/.test(item))
      getCookies({ url: details.initiator }, cookies => {
        syncAllSameSiteCookies(
          cookies,
          siteArr.filter(item => item != details.initiator)
        )
      })
      // 同步当前站点相关的跨境站或本土站所有网站的cookies
      if (shopeeLoginStatus == -1) {
        localStorage.setItem('shopeeLoginStatus', 1)
      }
    }
  },
  {
    urls: [
      '*://*.shopee.tw/*',
      '*://shopee.tw/*',
      '*://*.shopee.cn/*',
      '*://shopee.cn/*',
      '*://*.shopeesz.com/*',
      '*://*.shopee.co.id/*',
      '*://shopee.co.id/*',
      '*://*.shopee.vn/*',
      '*://shopee.vn/*',
      '*://shopee.co.th/*',
      '*://*.shopee.co.th/*',
      '*://shopee.ph/*',
      '*://*.shopee.ph/*',
      '*://shopee.com.my/*',
      '*://*.shopee.com.my/*',
      '*://shopee.sg/*',
      '*://*.shopee.sg/*',
      '*://shopee.com.br/*',
      '*://*.shopee.com.br/*',
      '*://shopee.com/*',
      '*://*.shopee.com/*',
      '*://*.xiapibuy.com/*',
      'https://*.xiapibuy.com/*-i.*/'
    ]
  }
)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let { action, options, type } = request
  if (action == 'request' && type == 'GET_SHOPPE_STORE_INFO_BY_ID') {
    Request.getStoreInfoById(options, type, sendResponse)
    return true
  }
  if (action == 'request' && type == 'GET_STORE_FOLLOEWERS_INFO') {
    Request.getFollowersInfoByName(options, type, sendResponse)
    return true
  }

  if (action == 'request' && type == 'POST_SHOPPE_FOLLOW_ACTION') {
    Request.postShoppeFollowAction(options, type, sendResponse)
    return true
  }

  if (action == 'request' && type == 'GET_CURRENT_STORE_ID') {
    Request.getCurrentStoreId(options, type, sendResponse)
    return true
  }

  if ((action = 'request' && type == 'GET_SHOPPE_ITEM_LIST_INFO')) {
    Request.getShopeeItemsList(options, type, sendResponse)
    return true
  }
  if ((action = 'request' && type == 'GET_FOLLOWERS_OF_SHOPEE_USER')) {
    Request.getFollowersOfShopeeUser(options, type, sendResponse)
    return true
  }
  return true
  //   return true //return true可以避免The message port closed before a response was received报错
})

//需要请求数据
export const Request = {
  //登录虾皮
  handleLoginShopee: function(params, type) {
    console.log(params, type)
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'get',
        url: `${getSiteLink('seller', params.domain)}api/v2/login/`,
        dataType: 'json',
        timeout: 10000,
        success: function(data) {
          resolve(data)
        },
        complete: function(res) {
          if (res.status != 200) {
            reject(-1)
          }
        }
      })
    })
  },
  // 获取店铺信息
  getStoreInfoById: function(params, type, call) {
    console.log(params, type)
    $.ajax({
      type: 'get',
      url: `${params.domain}/api/v2/shop/get?is_brief=1&shopid=${params.storeId}`,
      dataType: 'json',
      ...requestResult(type, call)
    })
  },

  //获取店铺粉丝信息
  getFollowersInfoByName: function(params, type, call) {
    console.log(params, type)
    $.ajax({
      type: 'get',
      url: `${params.domain}/api/v4/shop/get_shop_detail?username=${params.userName}`,
      dataType: 'json',
      ...requestResult(type, call)
    })
  },

  //请求虾皮的关注或取关接口
  postShoppeFollowAction: function(params, type, call) {
    console.log(params, type)
    let { actionType, shopid, domain } = params || {}
    let Opts = {
      follow: `${domain}/buyer/`,
      unfollow: `${domain}/buyer/`
    }
    if (!shopid) return
    $.ajax({
      type: 'post',
      url: `${Opts[actionType]}${actionType}/shop/${shopid}/`,
      data: {
        csrfmiddlewaretoken: localStorage.getItem('csrfToken')
      },
      ...requestResult(type, call)
    })
  },

  //获取虾皮商品列表中的店铺信息
  getShopeeItemsList: function(params, type, call) {
    console.log(params, type)
    let { goodsList, domain } = params
    if (goodsList && goodsList.length == 0) return
    let requestParams = {
      item_shop_ids: Array.from({ length: goodsList.length }, (v, k) => {
        return {
          shopid: Number(goodsList[k].split('.')[0]),
          itemid: Number(goodsList[k].split('.')[1])
        }
      })
    }
    $.ajax({
      type: 'post',
      url: `${domain}/api/v2/item/get_list`,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      headers: {
        Accept: 'application/json, text/plain, */*'
      },
      data: JSON.stringify(requestParams),
      ...requestResult(type, call)
    })
  },

  //获取虾皮店铺信息
  getCurrentStoreId: function(params, type, call) {
    console.log(params, type)
    $.ajax({
      type: 'get',
      url: `${getSiteLink('front', params.domain)}api/v2/shop/get?username=${params.storeName}`,
      dataType: 'json',
      ...requestResult(type, call)
    })
  },

  // 到erp获取虾皮用户的粉丝列表，
  getFollowersOfShopeeUser: function(params, type, call) {
    console.log(params, type)
    if (!params.countryCode) return
    $.ajax({
      type: 'post',
      url: CONFIGINFO.url.getShopeeFollowerList(),
      data: JSON.stringify({
        countryCode: params.countryCode.toUpperCase(),
        shopId: params.shopId
      }),
      dataType: 'json',
      contentType: 'application/json',
      ...requestResult(type, call)
    })
  }
}
