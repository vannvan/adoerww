import { contextMenu, getCurrent } from './lib/chrome'
import $$ from 'jquery'

function dump(tabId) {
  console.log('tabId', tabId)
}

getCurrent(dump)

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
  return true
  //   return true //return true可以避免The message port closed before a response was received报错
})

//需要请求数据
const Request = {
  // 获取店铺信息
  getStoreInfoById: function(params, type, call) {
    $$.ajax({
      type: 'get',
      url:
        'https://my.xiapibuy.com/api/v2/shop/get?is_brief=1&shopid=' +
        params.storeId,
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
      url:
        'https://my.xiapibuy.com/api/v4/shop/get_shop_detail?username=' +
        params.userName,
      dataType: 'json',
      success: function(data) {
        call({ type: type, result: data })
      },
    })
  },
}
