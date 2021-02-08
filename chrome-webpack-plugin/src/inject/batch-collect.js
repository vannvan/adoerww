// 批量采集操作脚本
const BatchCollect = {
  handleSelectAll: function() {
    // 选中商品
    $('.emalacca-plugin-goods-acquisition-select').attr({
      'data-selected': '1'
    })
    $('.emalacca-plugin-goods-acquisition-select').css({
      'border-width': '0',
      'pointer-events': 'auto',
      display: 'block'
    })
    $('.emalacca-plugin-goods-acquisition-select')
      .find('.emalacca-goods-icon-select')
      .css({
        display: 'block'
      })
  }
}

export default BatchCollect
