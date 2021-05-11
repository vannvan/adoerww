// 无货源绑定订单脚本
console.log('拼多多无货源脚本加载')
import { getCookies } from '@/lib/chrome'
const regeneratorRuntime = require('@/assets/js/runtime.js')

var contentNotifyHandler = {} //content-script 消息通知

class PurchasPddAddAddress {
  constructor({ contentNotify }) {
    contentNotifyHandler = contentNotify
    this.pddUserId = null
    this.pddAccesstoken = null
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
      getCookies({ url: 'http://mobile.yangkeduo.com/' }, async cookies => {
        try {
          let { province, city, region, phone, contacts, fullAddress } = realConsigneeInfo
          _this.pddUserId = cookies.find(el => el.name == 'pdd_user_id').value
          _this.pddAccesstoken = cookies.find(el => el.name == 'PDDAccessToken').value
          resolve(_this.pddUserId && _this.pddAccesstoken)
          console.log('pdd_user_id:', _this.pddUserId, 'PDDAccessToken:', _this.pddAccesstoken)
          let addressList = (await _this.getPddAddressList(_this.pddUserId)) || []
          console.log('addressList:', addressList)

          let exitAddress = addressList.find(
            el => el.mobile == phone && el.name == contacts && fullAddress.indexOf(el.address) >= 0
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

  // 获取pdd已有地址列表
  getPddAddressList(userId) {
    let _this = this
    const url = `https://mobile.yangkeduo.com/proxy/api/addresses?pdduid=${userId ||
      this.pddUserId}`
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'get',
        url: url,
        beforeSend: xhr => {
          xhr.setRequestHeader('accesstoken', _this.pddAccesstoken)
        },
        success: res => {
          resolve(res)
        },
        error: error => {
          reject(error)
        }
      })
    })
  }

  // 获取pdd地址对应id
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

  //设为默认地址
  handleSetDefaultAddress(address_id) {
    let _this = this
    const url = `https://mobile.yangkeduo.com/proxy/api/api/origenes/address_default/${address_id}?pdduid=${this.pddUserId}`
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'post',
        url: url,
        beforeSend: xhr => {
          xhr.setRequestHeader('accesstoken', _this.pddAccesstoken)
        },
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

  // 添加地址
  handleAddAddressToPdd({ provinceId, cityId, countyId }) {
    let _this = this
    const url = `https://mobile.yangkeduo.com/proxy/api/api/origenes/address?pdduid=${_this.pddUserId}`
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
        beforeSend: xhr => {
          xhr.setRequestHeader('accesstoken', _this.pddAccesstoken)
        },
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

  // 获取pdd订单详情
  getYangkeduoOrderInfo(orderId, orderBuyer) {
    const url = `https://mobile.yangkeduo.com/order.html?order_sn=${orderId}`
    return new Promise(resolve => {
      $.ajax({
        methods: 'get',
        url: url,
        success: res => {
          let orderExit = /window\.rawData=({.*?};)/.exec(res)
          if (orderExit && orderExit.length > 0) {
            resolve({
              code: 0,
              result: orderExit[1].replace(/;/, ''),
              message: '同步拼多多订单信息成功'
            })
          } else {
            resolve({
              code: -1,
              result: null,
              message: `同步拼多多订单失败，请登录账户[${orderBuyer}]后刷新页面`
            })
          }
        }
      })
    })
  }
}

export default PurchasPddAddAddress
