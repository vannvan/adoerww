import $$ from 'jquery'
import { WEBSITES, getMatchSite } from '../lib/conf'

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
  return true
  //   return true //return true可以避免The message port closed before a response was received报错
})

//需要请求数据
const Request = {
  //登录虾皮
  handleLoginShopee: function(params) {
    // console.log(getMatchSite(params.domain), '匹配域名')
    let matchSite = getMatchSite(params.domain)
    return new Promise((resolve, reject) => {
      $$.ajax({
        type: 'get',
        url: `${matchSite.seller}/api/v2/login/`,
        dataType: 'json',
        success: function(data) {
          resolve(data)
        },
        complete: function() {
          reject(-1)
        },
      })
    })
  },
  // 获取店铺信息
  getStoreInfoById: function(params, type, call) {
    $$.ajax({
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
      },
    })
  },

  //获取店铺粉丝信息
  getFollowersInfoByName: function(params, type, call) {
    $$.ajax({
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
      },
    })
  },

  //请求虾皮的关注或取关接口
  postShoppeFollowAction: function(params, type, call) {
    let { actionType, shopid, domain } = params || {}
    let Opts = {
      follow: `${domain}/buyer/`,
      unfollow: `${domain}/buyer/`,
    }
    if (!shopid) return
    // console.log(`${Opts[actionType]}${actionType}/shop/${shopid}/`)
    $$.ajax({
      type: 'post',
      url: `${Opts[actionType]}${actionType}/shop/${shopid}/`,
      data: {
        csrfmiddlewaretoken: localStorage.getItem('csrfToken'),
      },
      success: function(data) {
        call({ type: type, result: data })
      },
      complete: function(data) {
        if (data.status != 200) {
          call({ type: type, result: { error: -1 } })
        }
      },
    })
  },

  //获取erp平台用户绑定的店铺列表
  getUserBindStoreOfErp: function(params, type, call) {
    $$.ajax({
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
      },
    })
  },

  //获取虾皮店铺信息
  getCurrentStoreId: function(params, type, call) {
    // console.log(getMatchSite(params.domain), '匹配域名')
    let matchSite = getMatchSite(params.domain)
    $$.ajax({
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
      },
    })
  },
}

const Auth = {
  //同步虾皮登录token
  setCookies: function(params, type, call) {
    if (
      params.csrfToken &&
      localStorage.setItem('csrfToken', params.csrfToken)
    ) {
      call({ type: type, result: '设置成功' })
    }
  },

  // 配置虾皮平台信息
  syncShoppeBaseInfo: function(params, type, call) {
    Request.handleLoginShopee(params)
      .then((res) => {
        if (res) {
          localStorage.setItem('userInfo', JSON.stringify(res))
          console.log(localStorage.getItem('userInfo'))
        }
      })
      .catch(() => {
        call({ type: type, result: { error: -1 } })
      })
      .finally(() => {
        let userInfo = localStorage.getItem('userInfo')
          ? JSON.parse(localStorage.getItem('userInfo'))
          : {}
        call({
          type: type,
          result: {
            storeId: userInfo.shopid,
            country: getMatchSite(params.domain).key,
            username: userInfo.username,
          },
        })
      })
  },
}
