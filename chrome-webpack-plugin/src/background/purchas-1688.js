// 无货源绑定订单脚本
console.log('1688无货源脚本加载')
const regeneratorRuntime = require('@/assets/js/runtime.js')

var csrf_token = ''
var contentNotifyHandler = {} //content-script 消息通知

class Purchas1688AddAddress {
  constructor({ contentNotify }) {
    contentNotifyHandler = contentNotify
    this.purchaseOrderInfo = {}
  }

  //前台消息通知
  contentNotify(code, result, message) {
    contentNotifyHandler.sendResponse({
      type: contentNotifyHandler.type,
      code: code,
      result: result,
      message: message
    })
  }

  initListener() {
    console.log('1688 initListener')
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
  }

  /**
   * 判断两个地址是否匹配
   * eg 龙华区民治街道办逸秀新村64栋908
   *let str2 = '龙华区民治街道办新村64栋908'  true
   *let str3 = '华龙区民治街道办新村64栋9082'  false
   *let str4 = '新村64栋908' true
   *let str5 = '新村64栋908下铺' false
   *
   * @param {*} longStr
   * @param {*} shortStr
   * @return {*}
   * @memberof Purchas1688AddAddress
   */
  isInclude(longStr, shortStr) {
    let str1Arr = longStr.replace(/\s+/g, '').split('')
    let strArr2 = shortStr.replace(/\s+/g, '').split('')
    return strArr2.every(el => str1Arr.includes(el))
  }

  async validateAddress(realConsigneeInfo) {
    return new Promise(resolve => {
      let { phone, contacts, fullAddress } = realConsigneeInfo
      console.log('采购单:', phone, contacts, fullAddress)
      let _this = this
      let addressUrl = 'https://wuliu.1688.com/foundation/receive_address_manager.htm'
      $.ajax({
        type: 'get',
        url: addressUrl,
        success: function(response) {
          var matchCsrf = /data-csrftoken="(.*?)"/.exec(response)
          if (!matchCsrf) {
            resolve(false)
            return false
          }
          resolve(true)
          csrf_token = matchCsrf[1]
          console.log('csrftoken', csrf_token)
          const matchAddressHtmlList = [...$(response).find('.single-address')]

          let addressList = _this.parseAddressInfoFromAddressHtml(matchAddressHtmlList) || []
          console.log('matchAddressHtmlList:', JSON.stringify(addressList))
          let exitAddress = addressList.find(
            el =>
              el.mobile == phone &&
              el.fullName == contacts &&
              _this.isInclude(fullAddress, el.address)
          )
          console.log('exitAddress:', exitAddress)
          // 如果当前地址不是1688的默认地址，就修改为默认地址
          if (exitAddress && !exitAddress.isDefault) {
            console.log('设置为默认地址')
            _this.saveAddressTo1688({
              operateType: 'set_default',
              addressId: exitAddress.addressId
            })
          }
          // 如果当前地址不存在，或者地址列表为空
          if (!exitAddress) {
            console.log('新增地址')
            _this.parse1688Address(realConsigneeInfo)
          }
        }
      })
    })
  }

  parseAddressInfoFromAddressHtml(html) {
    return html.map(el => JSON.parse($(el).attr('data-address')))
  }

  parse1688Address(realConsigneeInfo) {
    let { contacts, phone, fullAddress } = realConsigneeInfo
    let _this = this
    fullAddress = contacts + ' ' + phone + ' ' + fullAddress
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
          _this.saveAddressTo1688({ operateType: 'add', addressInfo: ret.data })
          if (
            !ret.success ||
            !ret.data.districtCode ||
            (ret.data.city && ret.data.city.indexOf(realConsigneeInfo.city.substr(0, 2)) == -1) ||
            (ret.data.district.indexOf(realConsigneeInfo.city.substr(0, 2)) == -1 &&
              ret.data.district.indexOf(realConsigneeInfo.region.substr(0, 2)) == -1)
          ) {
            _this.contentNotify(-1, null, '关联1688地址失败，请将当前1688订单地址修改为ERP订单地址')
          }
        },
        error: error => {
          _this.contentNotify(-1, null, '关联1688地址失败，请将当前1688订单地址修改为ERP订单地址')
          console.error(error)
        }
      })
    })
  }

  // 新增和更新地址，修改为默认
  /**
   *
   * @param {*} operateType add|set_default|delete
   * @param {*} addressInfo 待新增的地址信息
   * @param {*} addressId 待更新的地址id
   */
  saveAddressTo1688({ operateType = {}, addressId, addressInfo }) {
    let _this = this
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
          (addressInfo.district ? addressInfo.district : addressInfo.town ? addressInfo.town : ''),
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
        _this.contentNotify(-1, null, '关联1688地址失败，请将当前1688订单地址修改为ERP订单地址')
      }
    })
  }
}

export default Purchas1688AddAddress
