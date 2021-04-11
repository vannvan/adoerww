// 无货源绑定订单脚本
console.log('拼多多无货源脚本加载')
import { getCookies } from '@/lib/chrome'
const regeneratorRuntime = require('@/assets/js/runtime.js')
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
  address: '详细地址阿哈哈哈',
  fullAddress: '详细地址阿哈哈哈',
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

var PDD = {}
var pddUserId = null
var pddAccesstoken = null
var contentNotify = {} //content-script 消息通知

!(function($) {
  var self
  var purchasePddAddAddress = function() {
    this.purchaseOrderInfo = {}
    self = this
  }
  purchasePddAddAddress.prototype = {
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
    },
    initAddress: function() {
      //
    },

    getPddAddressList: function(userId) {
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
    },
    /**
     * setp1 获取拼多多地址列表，判断是否已存在
     * step2 如果不存在，根据省市区获取拼多多对应地址id
     * step3 新增地址，is_default 值为 1
     * @param {*} realConsigneeInfo
     */
    validateAddress: function(realConsigneeInfo) {
      console.log('pdd validateAddress')
      getCookies('http://mobile.yangkeduo.com/', async cookies => {
        try {
          let { province, city, county, mobile, fullname, fullAddress } = realConsigneeInfo
          pddUserId = cookies.find(el => el.name == 'pdd_user_id').value
          pddAccesstoken = cookies.find(el => el.name == 'PDDAccessToken').value
          console.log('pdd_user_id:', pddUserId, 'PDDAccessToken:', pddAccesstoken)
          let addressList = (await self.getPddAddressList(pddUserId)) || []
          console.log('addressList:', addressList)

          let exitAddress = addressList.find(
            el => el.mobile == mobile && el.name == fullname && fullAddress.indexOf(el.address) >= 0
          )
          console.log('exitAddress:', exitAddress)
          // 如果当前地址不是拼多多的默认地址，调用默认地址接口
          if (exitAddress && exitAddress.is_default == '0') {
            let setDefault = await self.handleSetDefaultAddress(exitAddress.address_id)
            if (!setDefault || !setDefault.result) {
              self.contengNotify(
                -1,
                null,
                '关联拼多多地址失败，请将当前拼多多订单地址修改为ERP订单地址'
              )
            }
          }
          // 如果当前地址不存在，或者地址列表为空
          if (!exitAddress) {
            let pddAddressIds = await self.getPddAddressIds(province, city, county)
            pddAddressIds &&
              pddAddressIds.result == 'success' &&
              self.handleAddAddressToPdd(pddAddressIds)
          }
        } catch (error) {
          self.contengNotify(-1, null, '请登录拼多多')
          console.error(error)
        }
      })
    },

    getPddAddressIds: function(province, city, county) {
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
    },

    handleSetDefaultAddress: function(address_id) {
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
    },

    handleAddAddressToPdd: function({ provinceId, cityId, countyId }) {
      const url = `https://mobile.yangkeduo.com/proxy/api/api/origenes/address?pdduid=${pddUserId}`
      let { mobile, fullname, address } = realConsigneeInfo
      const params = {
        name: fullname,
        mobile: mobile,
        province_id: provinceId,
        city_id: cityId,
        district_id: countyId,
        address: address,
        is_default: 1
      }
      return new Promise((resolve, reject) => {
        $.ajax({
          method: 'post',
          url: url,
          data: params,
          success: res => {
            resolve(res)
          },
          error: error => {
            self.contengNotify(
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
  PDD.purchas = new purchasePddAddAddress()
})(jQuery)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let { action, options, type } = request
  contentNotify = {
    type: type,
    sendResponse: sendResponse
  }
  if (action == 'pdd-order-purchas' && type == 'INIT_ORDER_INFO') {
    PDD.purchas.initListener()
    PDD.purchas.validateAddress(realConsigneeInfo)
    return true
  }
})
