// DOM节点模板
import $ from 'jquery'

import dayjs from 'dayjs'
import { division } from '@/lib/utils'

// console.log(dayjs(1599121140 * 1000).format('YYYY-MM-DD'))

const ClassPrefix = 'emalacca-plugin'

// 数据展示节点模板
export const dataViewElementTemplate = (storeId, storeInfo) => {
  let {
    ctime = dayjs().unix(),
    view_count = 0,
    sold = 0,
    item_rating: { rating_star }
  } = storeInfo
  return $(
    `<div class="${ClassPrefix}-goods-data-view" data-store-id="${storeId}">
        <p>上架时间  ${dayjs(ctime * 1000).format('YYYY-MM-DD')}</p>
          <div class="list-group">
              <div class="item">
                  <span class="title">综合评分</span>
                  <span class="value">${rating_star ? rating_star.toFixed(1) : '暂无'}</span>
              </div>
              <div class="item">
                  <span class="title">访问量</span>
                  <span class="value">${view_count}</span>
              </div>
          </div>
          <div class="list-group">
              <div class="item">
                  <span class="title">销量</span>
                  <span class="value">${sold}</span>
              </div>
              <div class="item">
                  <span class="title">转化率</span>
                  <span class="value">${(division(sold, view_count) * 100).toFixed(2) + '%'}</span>
              </div>
         </div>
        </div>`
  )
}

// 操作面板节点模板
export const operationPanelTemplate = () => {
  return $(`
    <div class="${ClassPrefix}-goods-panel-wrap">
        <span class="emalacca-goods-panel-button" data-type="follow">获取粉丝</span>
      
        <span class="emalacca-goods-panel-button" data-type="view">查看店铺</span> 
    </div>
   `)
}

//   <span class="emalacca-goods-panel-button" data-type="collect">采集商品</span>
