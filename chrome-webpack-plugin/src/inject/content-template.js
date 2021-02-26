// DOM节点模板
import $ from 'jquery'

const ClassPrefix = 'emalacca-plugin'

export const collectText = {
  collect: {
    name: '采集商品',
    color: 'rgba(238,77,45, 0.8)'
  },
  pending: {
    name: '采集中',
    color: 'rgba(243,156,18,0.8)'
  },
  success: {
    name: '采集完成',
    color: 'rgba(46,204,113,0.8)'
  },
  fail: {
    name: '采集失败',
    color: 'rgba(231,76,60,0.8)'
  }
}
// 操作面板节点模板
export const operationPanelTemplate = (collectStatus = 'collect', origin) => {
  return $(`
    <div class="${ClassPrefix}-goods-acquisition-supply">
			<span class="emalacca-goods-acquisition-btn emalacca-goods-btn" data-type="collect" style="background:${collectText[collectStatus].color}">${collectText[collectStatus].name}</span>
			<span class="emalacca-goods-supply-btn emalacca-goods-btn" data-type="view">低价货源</span>
            <span class="emalacca-goods-supply-btn emalacca-goods-btn" data-type="view-store">查看店铺</span>
            <span class="emalacca-goods-supply-btn emalacca-goods-btn" data-type="get-follower">获取粉丝</span>
    </div>
   `)
}

// 批量选择模板 (默认未选中)
export const operationSelectTemplate = () => {
  return $(`
    <div class="${ClassPrefix}-goods-acquisition-select" data-selected="0">
			<span class="icon em-iconfont emalacca-goods-icon-select">&#x9e69;</span>
    </div>
   `)
}
