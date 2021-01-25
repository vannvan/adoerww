// 虾皮网站商品详情页的历史数据查看

import Vue from 'vue'
import $ from 'jquery'

import HistoryData from '@/components/HistoryData.vue'
import WUI from '@/components/index'
import '@/wui-theme/src/index.scss'

let condition =
  /shopee|xiapibuy/.test(window.location.host) && window.location.pathname.search('-i.') > -1

if (condition) {
  let rightFixed = document.createElement('div')
  rightFixed.id = 'ShoppeHistoryData'
  //   document.body.appendChild(rightFixed)

  setTimeout(() => {
    Vue.use(WUI)
    new Vue({
      el: '#ShoppeHistoryData',
      render: createElement => {
        return createElement(HistoryData)
      }
    })
    $('.product-briefing').after($('#ShoppeHistoryData'))
  }, 500)
}
