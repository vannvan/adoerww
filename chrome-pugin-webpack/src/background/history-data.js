// -1 接口错误 -2 数据错误
import $ from 'jquery'
import { objectToQueryString, requestResult } from '@/lib/utils'
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let { action, options, type } = request
  if (action == 'request' && type == 'GET_DYNAMIC_PRICES_SALES') {
    Request.getDynamicPrices(options, type, sendResponse)
    return true
  }
  if (action == 'request' && type == 'GET_GOODS_DETAIL_INFO') {
    Request.getGoodDetailInfo(options, type, sendResponse)
    return true
  }
})

const Request = {
  getDynamicPrices: function(params, type, call) {
    console.log(params, type)
    $.ajax({
      type: 'get',
      url: `https://api.keyouyun.com/lux/api/historical-dynamic-prices-sales?${objectToQueryString(
        params
      )}`,
      dataType: 'json',
      ...requestResult(type, call)
    })
  },

  //获取商品详情数据
  getGoodDetailInfo: function(params, type, call) {
    console.log(params, type)
    let { itemId, shopId, domain } = params
    if (!itemId) return
    $.ajax({
      type: 'get',
      url: `${domain}/api/v2/item/get?itemid=${itemId}&shopid=${shopId}`,
      dataType: 'json',
      ...requestResult(type, call)
    })
  }
}
