// 虾皮网站商品详情页的历史数据查看

import Vue from 'vue'
import $ from 'jquery'
import { debounce, isEmpty } from '@/lib/utils'
import { sendMessageToBackground } from '@/lib/chrome-client.js'

import HistoryData from '@/components/HistoryData.vue'
import WUI from '@/components/index'
import '@/wui-theme/src/index.scss'
import ViewUI from 'view-design'

const History = {
  domain: window.location.origin,
  shopId: null,
  itemId: null,
  // 获取客优云数据
  getDynamicPrices: function(params) {
    params = Object.assign({ itemId: this.itemId, shopId: this.shopId }, params)
    return new Promise((resolve, reject) => {
      sendMessageToBackground('request', params, 'GET_DYNAMIC_PRICES_SALES', data => {
        resolve(data)
      })
    })
  },

  //获取商品详情数据
  getGoodDetailInfo: function() {
    let param = { itemId: this.itemId, shopId: this.shopId, domain: this.domain }
    return new Promise((resolve, reject) => {
      sendMessageToBackground('request', param, 'GET_GOODS_DETAIL_INFO', data => {
        resolve(data)
      })
    })
  }
}

const insertHistoryWrap = debounce(function() {
  let condition =
    /shopee|xiapibuy/.test(window.location.host) && window.location.pathname.search('-i.') > -1
  try {
    let urlId = window.location.href.split('-i.')[1]
    if (isEmpty(urlId)) return
    History.shopId = urlId.split('.')[0]
    History.itemId = urlId.split('.')[1]
    if (condition && !$('#emalaccaHistoryData')[0]) {
      let HistoryDataWrap = '<div id="ShoppeHistoryData">啊哈哈</div>'
      $(HistoryDataWrap).insertAfter($('.product-briefing'))

      Vue.use(ViewUI)
      Vue.use(WUI)

      new Vue({
        render: h => h(HistoryData)
      }).$mount('#ShoppeHistoryData')
    }
  } catch (error) {
    console.log(error)
  }
}, 800)
// 判断是否是shopee网站
if (/(shopee\.)|(xiapibuy\.)/.test(window.location.host)) {
  $(window).scroll(insertHistoryWrap)
}

export default History
