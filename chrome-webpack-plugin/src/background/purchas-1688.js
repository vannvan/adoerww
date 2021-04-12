// 无货源绑定订单脚本
console.log('1688无货源脚本加载')
const regeneratorRuntime = require('@/assets/js/runtime.js')

var csrf_token = ''
var contentNotifyHandler = {} //content-script 消息通知

class purchas1688AddAddress {
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

  //判断当前页面是不是下单程序打开的
  isPurchaseTab() {
    return new Promise(async (resolve, reject) => {
      // await this.sleep(200);//延迟100毫秒启动
      let tabData = await getTabData()
      if (!tabData || !tabData.purchaseItem) {
        reject(null)
      } else {
        resolve(tabData)
      }
    })
  }

  initListener() {
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
   * 获取当前订单关联的系统收货人信息
   */
  initAddress() {
    console.log('initAddress')
  }

  validateAddress(realConsigneeInfo) {
    return new Promise((resolve, reject) => {
      let { mobile, fullname, fullAddress } = realConsigneeInfo
      let _this = this
      let addressUrl = 'https://wuliu.1688.com/foundation/receive_address_manager.htm'
      $.ajax({
        type: 'get',
        url: addressUrl,
        success: function(response) {
          var matchCsrf = /data-csrftoken="(.*?)"/.exec(response)
          if (!matchCsrf) {
            // 提示前台给出提示
            resolve(-1)
            return false
          }
          resolve(0)
          csrf_token = matchCsrf[1]
          console.log('csrftoken', csrf_token)
          const matchAddressHtmlList = [...$(response).find('.single-address')]

          let addressList = _this.parseAddressInfoFromAddressHtml(matchAddressHtmlList) || []
          console.log('matchAddressHtmlList:', JSON.stringify(addressList))
          let exitAddress = addressList.find(
            el =>
              el.mobile == mobile && el.fullName == fullname && fullAddress.indexOf(el.address) >= 0
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
            _this.parse1688Address()
          }
        }
      })
    })
  }

  parseAddressInfoFromAddressHtml(html) {
    return html.map(el => JSON.parse($(el).attr('data-address')))
  }

  parse1688Address() {
    let { fullname, mobile, fullAddress } = realConsigneeInfo
    let _this = this
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
          _this.saveAddressTo1688({ operateType: 'add', addressInfo: ret.data })
          if (
            !ret.success ||
            !ret.data.districtCode ||
            (ret.data.city && ret.data.city.indexOf(realConsigneeInfo.city.substr(0, 2)) == -1) ||
            (ret.data.district.indexOf(realConsigneeInfo.city.substr(0, 2)) == -1 &&
              ret.data.district.indexOf(realConsigneeInfo.county.substr(0, 2)) == -1)
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

export default purchas1688AddAddress
