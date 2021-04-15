// 无货源绑定订单脚本
console.log('拼多多无货源脚本加载')
import { getCookies } from '@/lib/chrome'
const regeneratorRuntime = require('@/assets/js/runtime.js')

var pddUserId = null
var pddAccesstoken = null
var contentNotifyHandler = {} //content-script 消息通知

class purchasPddAddAddress {
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
    console.log('pdd initListener')
    chrome.webRequest.onBeforeSendHeaders.addListener(
      function(details) {
        if (/proxy\/api/.test(details.url)) {
          details.requestHeaders.push(
            {
              name: 'origin',
              value: 'https://mobile.yangkeduo.com/'
            },
            {
              name: 'accesstoken',
              value: pddAccesstoken
            }
          )
        }
        if (/get_pdd_area_ids/.test(details.url)) {
          details.requestHeaders.push({
            name: 'origin',
            value: 'https://plw.szchengji-inc.com/'
          })
        }

        return {
          requestHeaders: details.requestHeaders
        }
      },
      {
        urls: ['*://*.yangkeduo.com/*', '*://*.szchengji-inc.com/*']
        //   urls: ['<all_urls>']
      },
      ['blocking', 'requestHeaders', 'extraHeaders']
    )
  }
  initAddress() {
    //
  }

  checkLogin() {
    return new Promise(resolve => {
      getCookies('http://mobile.yangkeduo.com/', async cookies => {
        try {
          pddUserId = cookies.find(el => el.name == 'pdd_user_id').value
          pddAccesstoken = cookies.find(el => el.name == 'PDDAccessToken').value
          if (pddUserId && pddAccesstoken) {
            let cookieStr = cookies.reduce((prev, curr) => {
              return `${curr.name}=${curr.value}; ` + prev
            }, '')
            resolve(cookieStr)
          } else {
            resolve(false)
          }
        } catch (error) {
          resolve(false)
        }
      })
    })
  }

  getPddAddressList(userId) {
    const url = `https://mobile.yangkeduo.com/proxy/api/addresses?pdduid=${userId || pddUserId}`
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'get',
        url: url,
        success: res => {
          resolve(res)
        },
        error: error => {
          reject(error)
        }
      })
    })
  }
  /**
   * setp1 获取拼多多地址列表，判断是否已存在
   * step2 如果不存在，根据省市区获取拼多多对应地址id
   * step3 新增地址，is_default 值为 1
   * @param {*} realConsigneeInfo
   */
  validateAddress(realConsigneeInfo) {
    let _this = this
    _this.purchaseOrderInfo = realConsigneeInfo
    console.log('pdd validateAddress')
    return new Promise(resolve => {
      getCookies('http://mobile.yangkeduo.com/', async cookies => {
        try {
          let { province, city, region, phone, fullname, fullAddress } = realConsigneeInfo
          pddUserId = cookies.find(el => el.name == 'pdd_user_id').value
          pddAccesstoken = cookies.find(el => el.name == 'PDDAccessToken').value
          if (pddUserId && pddAccesstoken) {
            resolve(true)
          }
          console.log('pdd_user_id:', pddUserId, 'PDDAccessToken:', pddAccesstoken)
          let addressList = (await _this.getPddAddressList(pddUserId)) || []
          console.log('addressList:', addressList)

          let exitAddress = addressList.find(
            el => el.mobile == phone && el.name == fullname && fullAddress.indexOf(el.address) >= 0
          )
          console.log('exitAddress:', exitAddress)
          // 如果当前地址不是拼多多的默认地址，调用默认地址接口
          if (exitAddress && exitAddress.is_default == '0') {
            let setDefault = await _this.handleSetDefaultAddress(exitAddress.address_id)
            if (!setDefault || !setDefault.result) {
              _this.contentNotify(
                -1,
                null,
                '关联拼多多地址失败，请将当前拼多多订单地址修改为ERP订单地址'
              )
            }
          }
          // 如果当前地址不存在，或者地址列表为空
          if (!exitAddress) {
            let pddAddressIds = await _this.getPddAddressIds(province, city, region)
            pddAddressIds &&
              pddAddressIds.result == 'success' &&
              _this.handleAddAddressToPdd(pddAddressIds)
          }
        } catch (error) {
          _this.contentNotify(-1, null, '请登录拼多多后刷新此页面')
          console.error(error)
        }
      })
    })
  }

  getPddAddressIds(province, city, county) {
    const url = `https://plw.szchengji-inc.com/order/purchase_order/get_pdd_area_ids?province=${province}&city=${city}&county=${county}`
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'get',
        url: url,
        success: res => {
          resolve(res)
        },
        error: error => {
          console.error(error)
          reject(0)
        }
      })
    })
  }

  handleSetDefaultAddress(address_id) {
    const url = `https://mobile.yangkeduo.com/proxy/api/api/origenes/address_default/${address_id}?pdduid=${pddUserId}`
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'post',
        url: url,
        success: res => {
          resolve(res)
        },
        error: error => {
          console.error(error)
          reject(0)
        }
      })
    })
  }

  handleAddAddressToPdd({ provinceId, cityId, countyId }) {
    let _this = this
    const url = `https://mobile.yangkeduo.com/proxy/api/api/origenes/address?pdduid=${pddUserId}`
    let { phone, contacts, detailedAddress } = _this.purchaseOrderInfo
    const params = {
      name: contacts,
      mobile: phone,
      province_id: provinceId,
      city_id: cityId,
      district_id: countyId,
      address: detailedAddress,
      is_default: 1,
      check_region: true
    }
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'post',
        url: url,
        data: JSON.stringify(params),
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: res => {
          resolve(res)
        },
        error: error => {
          _this.contentNotify(
            -1,
            null,
            '关联拼多多地址失败，请将当前拼多多订单地址修改为ERP订单地址'
          )
          reject(error)
        }
      })
    })
  }
}

export default purchasPddAddAddress
