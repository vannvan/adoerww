// 粉丝关注相关
// -1 接口错误 -2 数据错误
import $ from 'jquery'
import { getMatchSite } from '../lib/conf'
import { getStorage } from '@/lib/utils'

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let { action, options, type } = request
  // 判断是否是shopee网站
  if (window.location.href.indexOf('xiapibuy.com') === -1 || window.location.href.indexOf('shopee.com') === -1) {
    return;
  } 
  if (action == 'request' && type == 'GET_SHOPPE_STORE_INFO_BY_ID') {
    Request.getStoreInfoById(options, type, sendResponse)
    return true
  }
  if (action == 'request' && type == 'GET_STORE_FOLLOEWERS_INFO') {
    Request.getFollowersInfoByName(options, type, sendResponse)
    return true
  }
  if (action == 'auth' && type == 'SET_SHOPPE_CRSF_TOKEN') {
    Auth.setCookies(options, type, sendResponse)
    return true
  }
  if (action == 'request' && type == 'POST_SHOPPE_FOLLOW_ACTION') {
    Request.postShoppeFollowAction(options, type, sendResponse)
    return true
  }
  if (action == 'auth' && type == 'SYNC_ERP_AUTH_INFO') {
    Auth.syncErp(options, type, sendResponse)
    return true
  }
  if (action == 'request' && type == 'GET_CURRENT_STORE_ID') {
    Request.getCurrentStoreId(options, type, sendResponse)
    return true
  }
  if (action == 'auth' && type == 'SYNC_SHOPPE_BASE_INFO') {
    Auth.syncShoppeBaseInfo(options, type, sendResponse)
    return true
  }
  if ((action = 'requet' && type == 'GET_SHOPPE_ITEM_LIST_INFO')) {
    Request.getShopeeItemsList(options, type, sendResponse)
    return true
  }
  return true
  //   return true //return true可以避免The message port closed before a response was received报错
})

//需要请求数据
const Request = {
  //登录虾皮
  handleLoginShopee: function(params, type) {
    // console.log(getMatchSite(params.domain), '匹配域名')
    let matchSite = getMatchSite(params.domain)
    console.log(params, type, matchSite)
    return new Promise((resolve, reject) => {
      if (!matchSite) {
        reject(-1)
      }
      $.ajax({
        type: 'get',
        url: `${matchSite.seller}/api/v2/login/`,
        dataType: 'json',
        success: function(data) {
          resolve(data)
        },
        complete: function() {
          reject(-1)
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
      success: function(data) {
        call({ type: type, result: data })
      },
      complete: function(data) {
        if (data.status != 200) {
          call({ type: type, result: { error: -1 } })
        }
      }
    })
  },

  //获取店铺粉丝信息
  getFollowersInfoByName: function(params, type, call) {
    console.log(params, type)
    $.ajax({
      type: 'get',
      url: `${params.domain}/api/v4/shop/get_shop_detail?username=${params.userName}`,
      dataType: 'json',
      success: function(data) {
        call({ type: type, result: data })
      },
      complete: function(data) {
        if (data.status != 200) {
          call({ type: type, result: { error: -1 } })
        }
      }
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
    // console.log(`${Opts[actionType]}${actionType}/shop/${shopid}/`)
    $.ajax({
      type: 'post',
      url: `${Opts[actionType]}${actionType}/shop/${shopid}/`,
      data: {
        csrfmiddlewaretoken: localStorage.getItem('csrfToken')
      },
      success: function(data) {
        call({ type: type, result: data })
      },
      complete: function(data) {
        if (data.status != 200) {
          call({ type: type, result: { error: -1 } })
        }
      }
    })
  },

  //获取erp平台用户绑定的店铺列表
  getUserBindStoreOfErp: function(params, type, call) {
    console.log(params, type)
    $.ajax({
      type: 'get',
      url: params.domain + '/api/store/info/page',
      beforeSend: function(XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader(
          'Authorization',
          'Bearer ' + localStorage.getItem('refresh_token')
        )
      },
      success: function(data) {
        localStorage.setItem('storeList', JSON.stringify(data.records))
      },
      complete: function(data) {
        if (data.status != 200) {
          call({ type: type, result: { error: -1 } })
        }
      }
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
      success: function(data) {
        call({ type: type, result: data || null })
      },
      complete: function(data) {
        if (data.status != 200) {
          call({ type: type, result: { error: -1 } })
        }
      }
    })
  },

  //获取虾皮店铺信息
  getCurrentStoreId: function(params, type, call) {
    // console.log(getMatchSite(params.domain), '匹配域名')
    console.log(params, type)
    let matchSite = getMatchSite(params.domain)
    if (!matchSite) {
      call({ type: type, result: { error: -1 } })
      return
    }
    $.ajax({
      type: 'get',
      url: `${matchSite.front}/api/v2/shop/get?username=${params.storeName}`,
      dataType: 'json',
      success: function(data) {
        call({ type: type, result: data || null })
      },
      complete: function(data) {
        if (data.status != 200) {
          call({ type: type, result: { error: -1 } })
        }
      }
    })
  }
}

const Auth = {
  //同步虾皮登录token
  setCookies: function(params, type, call) {
    console.log(params, type)
    if (params.csrfToken && localStorage.setItem('csrfToken', params.csrfToken)) {
      call({ type: type, result: '设置成功' })
    }
  },

  // 配置虾皮平台信息
  syncShoppeBaseInfo: function(params, type, call) {
    console.log(params, type)
    Request.handleLoginShopee(params, type)
      .then(res => {
        if (res) {
          localStorage.setItem('userInfo', JSON.stringify(res))
        }
      })
      .catch(() => {
        call({ type: type, result: { error: -1 } })
      })
      .finally(() => {
        let userInfo = getStorage('userInfo', {})
        call({
          type: type,
          result: {
            storeId: userInfo.shopid,
            username: userInfo.username,
            country: getMatchSite(params.domain) ? getMatchSite(params.domain).key : null
          }
        })
      })
  }
}
