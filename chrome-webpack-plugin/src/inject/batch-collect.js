// 批量采集操作脚本
import { getLoginInfo } from '@/lib/chrome-client'
import { MESSAGE } from '../lib/conf'
import { imageCrawl } from './crawl-handler'

const BatchCollect = {
  handleSelectAll({ isCheck = true }) {
    // 选中商品
    $('.emalacca-plugin-goods-acquisition-select').attr({
      'data-selected': isCheck ? '1' : '0'
    })
    $('.emalacca-plugin-goods-acquisition-select').css({
      'border-width': isCheck ? '0' : '2px',
      'pointer-events': 'auto',
      display: isCheck ? 'block' : 'none'
    })
    $('.emalacca-plugin-goods-acquisition-select')
      .find('.emalacca-goods-icon-select')
      .css({
        display: isCheck ? 'block' : 'none'
      })
    // 显示采集选中的数量
    let selectedLen = [
      ...document.querySelectorAll('.emalacca-plugin-goods-acquisition-select')
    ].filter(item => item.getAttribute('data-selected') == 1).length
    let text = selectedLen > 0 ? '采集选中（' + selectedLen + '）' : '采集选中'
    $('.emalacca-plugin-quick-action-sub-button[data-action-type=collect-selected]').text(text)
  },

  handleCollectSelected() {
    console.log('采集选中')
    let handleSelectChange = data => {
      let selectedLen = [
        ...document.querySelectorAll('.emalacca-plugin-goods-acquisition-select')
      ].filter(item => item.getAttribute('data-selected') == 1).length
      if (!selectedLen) {
        $.fn.message({ type: 'error', msg: MESSAGE.error.pleaseSelectSomeGoods })
        return
      }
      $.fn.message({ type: 'success', msg: MESSAGE.success.savehaveBeenAdd })
      $('.emalacca-plugin-goods-acquisition-select').each(function(index) {
        let isSelected = $(this).attr('data-selected')
        if (isSelected === '1') {
          imageCrawl($(this).attr('data-selecturl'), data, true) //采集操作
        }
      })
    }
    getLoginInfo(data => {
      // 判断是否登录
      if (!data.status) {
        $.fn.message({ type: 'error', msg: MESSAGE.error.checkIsAuthedERP })
        return
      }
      handleSelectChange(data)
    })
  },

  handleCollectCurrPage() {
    console.log('列表&分类采集本页')
    let handleCurrPageChange = data => {
      $('.emalacca-plugin-goods-acquisition-select').each(function(index) {
        let urlString = $(this).attr('data-selecturl')
        imageCrawl(urlString, data, true) //采集操作
      })
    }
    getLoginInfo(data => {
      // 判断是否登录
      if (!data.status) {
        $.fn.message({ type: 'error', msg: MESSAGE.error.checkIsAuthedERP })
        return
      }
      $.fn.message({ type: 'success', msg: MESSAGE.success.savehaveBeenAdd })
      handleCurrPageChange(data)
    })
  },
  handleCollectCurrPageDetail() {
    console.log('详情采集本页')
    let handleCurrPageChange = data => {
      imageCrawl(location.href, data, false) //采集操作
    }
    getLoginInfo(data => {
      // 判断是否登录
      if (!data.status) {
        $.fn.message({ type: 'error', msg: MESSAGE.error.checkIsAuthedERP })
        return
      }
      handleCurrPageChange(data)
    })
  }
}

export default BatchCollect
