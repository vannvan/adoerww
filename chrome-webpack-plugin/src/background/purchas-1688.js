// 无货源绑定订单脚本
console.log('1688无货源脚本加载')
const regeneratorRuntime = require('@/assets/js/runtime.js')
const { reject } = require('lodash')
const realConsigneeInfo = {
  fullname: '李大锤',
  telephone: '13798210310',
  mobile: '13798210310',
  provinceAreaId: '279',
  province: '广东省',
  cityAreaId: '490',
  city: '深圳市',
  countyAreaId: '2674',
  county: '龙华区',
  townAreaId: '29264',
  town: '民治街道办事处',
  address: '光浩国际中心A栋24楼',
  fullAddress: '广东省深圳市龙华区民治街道办事处光浩国际中心A栋24楼',
  hasHide: false,
  tradeAddress: {
    address: '光浩国际中心A栋24楼',
    addressCode: '440311',
    addressCodeText: '广东省 深圳市 龙华区',
    addressId: 2733662396,
    fullName: '李大锤',
    isDefault: true,
    isLatest: false,
    mobile: '13798210310',
    postCode: '000000'
  },
  deliverId: {
    addressCode: '440311',
    address: '光浩国际中心A栋24楼',
    bizType: '',
    mobile: '13798210310',
    fullName: '李大锤',
    addressCodeText: '广东省 深圳市 龙华区',
    addressId: '2733662396',
    isDefault: true,
    isLatest: false,
    phone: '',
    postCode: '000000'
  }
}

var BOP = {}
var csrf_token = ''
var contentNotify = {} //content-script 消息通知
!(function($) {
  var self
  var purchas1688AddAddress = function() {
    this.purchaseOrderInfo = {}
    self = this
  }

  purchas1688AddAddress.prototype = {
    //前台消息通知
    contengNotify: function(code, result, message) {
      contentNotify.sendResponse({
        type: contentNotify.type,
        code: code,
        result: result,
        message: message
      })
    },

    initListener: function() {
      chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
          if (/operate_receive_address/.test(details.url)) {
            details.requestHeaders.push({
              name: 'origin',
              value: 'https://www.1688.com/'
            })
          }

          return {
            requestHeaders: details.requestHeaders
          }
        },
        {
          urls: ['*://*.1688.com/*']
        },
        ['blocking', 'requestHeaders', 'extraHeaders']
      )
    },
    /**
     * 获取当前订单关联的系统收货人信息
     */
    initAddress: function() {
      console.log('initAddress')
    },
    validateAddress: function(realConsigneeInfo) {
      let { mobile, fullname, fullAddress } = realConsigneeInfo

      let addressUrl = 'https://wuliu.1688.com/foundation/receive_address_manager.htm'
      $.ajax({
        type: 'get',
        url: addressUrl,
        success: function(response) {
          var matchCsrf = /data-csrftoken="(.*?)"/.exec(response)
          if (!matchCsrf) {
            // 提示前台给出提示
            self.contengNotify(-1, null, '请登录1688')
            return false
          }
          csrf_token = matchCsrf[1]
          console.log('csrftoken', csrf_token)
          const matchAddressHtmlList = [...$(response).find('.single-address')]

          let addressList = self.parseAddressInfoFromAddressHtml(matchAddressHtmlList) || []
          console.log('matchAddressHtmlList:', JSON.stringify(addressList))
          let exitAddress = addressList.find(
            el =>
              el.mobile == mobile && el.fullName == fullname && fullAddress.indexOf(el.address) >= 0
          )
          console.log('exitAddress:', exitAddress)
          // 如果当前地址不是1688的默认地址，就修改为默认地址
          if (exitAddress && !exitAddress.isDefault) {
            console.log('设置为默认地址')
            self.saveAddressTo1688({ operateType: 'set_default', addressId: exitAddress.addressId })
          }
          // 如果当前地址不存在，或者地址列表为空
          if (!exitAddress) {
            console.log('新增地址')
            self.parse1688Address()
          }
        }
      })
    },

    parseAddressInfoFromAddressHtml: function(html) {
      return html.map(el => JSON.parse($(el).attr('data-address')))
    },

    parse1688Address: function() {
      let { fullname, mobile, fullAddress } = realConsigneeInfo
      fullAddress = fullname + mobile + fullAddress
      const url =
        'https://wuliu.1688.com/address/ajax/address_parse.jsx?callback=jQuery17209390225001079777_1538036004820&address=' +
        encodeURIComponent(fullAddress) +
        '&_csrf_token=' +
        csrf_token +
        '&_input_charset=utf-8'
      return new Promise((resolve, reject) => {
        $.ajax({
          method: 'get',
          url: url,
          success: responseText => {
            var match = /jQuery17209390225001079777_1538036004820\((.*)\)/.exec(responseText)
            var ret = JSON.parse(match[1])
            console.log('parse1688Address', ret)
            self.saveAddressTo1688({ operateType: 'add', addressInfo: ret.data })
            if (
              !ret.success ||
              !ret.data.districtCode ||
              (ret.data.city && ret.data.city.indexOf(realConsigneeInfo.city.substr(0, 2)) == -1) ||
              (ret.data.district.indexOf(realConsigneeInfo.city.substr(0, 2)) == -1 &&
                ret.data.district.indexOf(realConsigneeInfo.county.substr(0, 2)) == -1)
            ) {
              self.contengNotify(
                -1,
                null,
                '关联1688地址失败，请将当前1688订单地址修改为ERP订单地址'
              )
            }
          },
          error: error => {
            self.contengNotify(-1, null, '关联1688地址失败，请将当前1688订单地址修改为ERP订单地址')
            console.error(error)
          }
        })
      })
    },

    // 新增和更新地址，修改为默认
    /**
     *
     * @param {*} operateType add|set_default|delete
     * @param {*} addressInfo 待新增的地址信息
     * @param {*} addressId 待更新的地址id
     */
    saveAddressTo1688: function({ operateType = {}, addressId, addressInfo }) {
      const url =
        'https://wuliu.1688.com/foundation/ajax/operate_receive_address.jsx?_input_charset=UTF-8'
      let params = {
        operateType: operateType,
        _csrf_token: csrf_token
      }

      if (operateType == 'set_default') {
        params.addressId = addressId
      }
      if (operateType == 'add') {
        const additionParams = {
          isNew: true,
          fullName: addressInfo.personalName,
          address: addressInfo.addressDetail,
          addressCode: addressInfo.addressCode || addressInfo.districtCode,
          mobile: addressInfo.mobileNO,
          phone: '',
          phoneCode: '',
          phoneNumber: '',
          phoneSubCode: '',
          postCode: addressInfo.divisionZip || '000000',
          addressCodeText:
            addressInfo.province +
            ' ' +
            addressInfo.city +
            ' ' +
            (addressInfo.district
              ? addressInfo.district
              : addressInfo.town
              ? addressInfo.town
              : ''),
          provinceCode: addressInfo.provinceCode,
          cityCode: addressInfo.cityCode,
          areaCode: addressInfo.districtCode ? addressInfo.districtCode : '',
          townCode: addressInfo.townCode ? addressInfo.townCode : '',
          provinceName: addressInfo.province,
          cityName: addressInfo.city,
          areaName: addressInfo.district ? addressInfo.district : '',
          townName: addressInfo.town ? addressInfo.town : '',
          isDefault: true,
          isInland: true,
          addressNamePath:
            addressInfo.province + ' ' + addressInfo.city + ' ' + addressInfo.district
              ? addressInfo.district
              : '' + ' ' + addressInfo.town
              ? addressInfo.town
              : '',
          bizType: '',
          isLatest: true
        }
        params = Object.assign(additionParams, params)
      }
      $.ajax({
        method: 'post',
        url: url,
        contentType: 'application/x-www-form-urlencoded',
        data: params,
        success: res => {
          console.log('saveAddressTo1688', res)
        },
        error: error => {
          console.error('saveAddressTo1688:', error)
          self.contengNotify(-1, null, '关联1688地址失败，请将当前1688订单地址修改为ERP订单地址')
        }
      })
    }
  }
  BOP.purchas = new purchas1688AddAddress()
})(jQuery)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let { action, options, type } = request
  contentNotify = {
    type: type,
    sendResponse: sendResponse
  }
  if (action == '1688-order-purchas' && type == 'INIT_ORDER_INFO') {
    BOP.purchas.initListener()
    BOP.purchas.validateAddress(realConsigneeInfo)
    return true
  }
})
