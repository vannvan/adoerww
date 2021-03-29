const $ = require('jquery')
require('bootstrap')
require('bootstrap/js/dist/util')
require('bootstrap/js/dist/alert')
const API = require('../../utils/api.conf')

const checkboxTemplate = (id, items) => {
  return $(`
    <div class="custom-control custom-checkbox">
      <input type="checkbox" class="custom-control-input" id="${id}" data-code="${items.countryCode}" value="${items.shopId}">
      <label class="custom-control-label" for="${id}">${items.storeName}</label>
    </div>
  `)
}
// 切换tabs
$('.em-tabs-items').click(function (event) {
  let index = $(this).attr('data-index')
  $('.em-tabs-items.is-em-active').removeClass('is-em-active')
  $(this).addClass('is-em-active')
  $('.em-tabs-content.is-em-content').removeClass('is-em-content')
  $('.em-tabs-content:eq(' + index + ')').addClass('is-em-content')
  $('.em-tabs-footer.is-em-footer').removeClass('is-em-footer')
  $('.em-tabs-footer:eq(' + index + ')').addClass('is-em-footer')
  if (index === '2') {
    $('#erpStoreList').html('')
    // 获取erp店铺列表
    API.getErpStoreList().then(res => {
      let data = res.data || []
      if (Array.isArray(data) && data.length !== 0) {
        data.forEach((item, index) => {
          let domId = 'erpShop_' + index
          $('#erpStoreList').append(checkboxTemplate(domId, item))
        })
      }
    })
  }
})
// input type密码显示隐藏
$('.em-iconfont-password').click(function (event) {
  if ($(this).hasClass('em-icon-jiesuo')) {
    $(this).addClass('em-icon-mima')
    $('#validationPassword').attr('type', 'password')
    $('.em-iconfont-password.em-icon-jiesuo').removeClass('em-icon-jiesuo')
  } else {
    $(this).addClass('em-icon-jiesuo')
    $('#validationPassword').attr('type', 'text')
    $('.em-iconfont-password.em-icon-mima').removeClass('em-icon-mima')
  }
})


