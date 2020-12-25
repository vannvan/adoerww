// import { contextMenu, getCurrent } from './lib/chrome'
import $$ from 'jquery'

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
  if (action == 'request' && type == 'SET_SHOPPE_CRSF_TOKEN') {
    Request.setCookies(options, type, sendResponse)
    return true
  }
  if (action == 'request' && type == 'POST_SHOPPE_FOLLOW_ACTION') {
    Request.postShoppeFollowAction(options, type, sendResponse)
    return true
  }
  return true
  //   return true //return true可以避免The message port closed before a response was received报错
})

//需要请求数据
const Request = {
  // 获取店铺信息
  getStoreInfoById: function(params, type, call) {
    $$.ajax({
      type: 'get',
      url: `${params.domain}/api/v2/shop/get?is_brief=1&shopid=${params.storeId}`,
      dataType: 'json',
      success: function(data) {
        call({ type: type, result: data })
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
    })
  },
  setCookies: function(params, type, call) {
    if (localStorage.setItem('csrfToken', params.csrfToken)) {
      call({ type: type, result: '设置成功' })
    }
  },
  //   请求虾皮的关注或取关接口
  postShoppeFollowAction: function(params, type, call) {
    let { actionType, shopid, domain } = params
    let mallUrl = 'https://mall.' + domain.split('//') //取关需要添加二级域名
    let Opts = {
      follow: `${domain}/buyer/`,
      unfollow: `${mallUrl}/buyer/`,
    }
    $$.ajax({
      type: 'post',
      url: `${Opts[actionType]}${actionType}/shop/${shopid}/`,
      data: {
        csrfmiddlewaretoken: localStorage.getItem('csrfToken'),
      },
      success: function(data) {
        call({ type: type, result: data })
      },
    })
  },
}

// Request.handleFollow()
// function getCookies(domain, name, callback) {
//   chrome.cookies.get({ url: domain, name: name }, function(cookie) {
//     if (callback) {
//       callback(cookie)
//     }
//   })
// }

// //usage:
// getCookies('https://shopee.com.my/', 'id', function(id) {
//   //   alert(id)
//   console.log(id)
// })
