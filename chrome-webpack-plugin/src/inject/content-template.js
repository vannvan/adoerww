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
export const operationPanelTemplate = (collectStatus = 'collect') => {
  return $(`
    <div class="${ClassPrefix}-goods-acquisition-supply">
			<div class="emalacca-goods-btn">
				<span class="emalacca-goods-acquisition-btn emalacca-goods-btn" data-type="collect" style="background:${collectText[collectStatus].color}">${collectText[collectStatus].name}</span>
				<span class="emalacca-goods-supply-btn emalacca-goods-btn" data-type="view">低价货源</span> 
			</div>
			<div class="emalacca-goods-acquisition-select" data-selected="0"><span class="icon iconfont emalacca-goods-icon-select">&#x9e69;</span>
			</div>
    </div>
   `)
}

// 右下角悬浮操作模板
export const suspensionBottomTemplate = (pageType = 'detail') => {
	let template = null
	if (pageType === 'detail') {
		template = $(`
			<div class="${ClassPrefix}-goods-suspension">
				<span class="emalacca-goods-gather-page-btn emalacca-goods-btn">采集本页</span>
				<span	title="关闭" class="emalacca-goods-close-btn">×</span>
			</div>
		`)
	} else if (['sortlist','category'].includes(pageType) &&
	url.indexOf('yangkeduo.com') === -1) {
		template = $(`
			<div class="${ClassPrefix}-goods-suspension">
				<span class="emalacca-goods-gather-select-btn emalacca-goods-btn">采集选中</span>
				<span class="emalacca-goods-gather-page-btn emalacca-goods-btn">采集本页</span>
				<span class="emalacca-goods-select-all-btn emalacca-goods-btn">全选</span>
				<span	title="关闭" class="emalacca-goods-close-btn">×</span>
			</div>
			`)
	}
	return template
}
