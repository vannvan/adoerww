import purchas1688AddAddress from './purchas-1688'
import purchasePddAddAddress from './purchas-pdd'
import { setStorageSync, getStorageSync, getTabId2 } from '@/lib/chrome'
var contentNotify = {} //content-script 消息通知
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
class Purchas {
  constructor() {
    this.t1688 = null
    this.pdd = null
  }
  init() {
    chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
      let { action, options, type } = request
      contentNotify = {
        type: type,
        sendResponse: sendResponse
      }
      if (action == 'purchas' && type == 'INIT_ORDER_INFO') {
        let { purchasLink, orderInfo } = options
        chrome.tabs.create({ url: purchasLink, selected: true }, async function(nextTab) {
          orderInfo.tabId = nextTab.id
          setStorageSync({ orderInfo: orderInfo })
          this.pdd = new purchasePddAddAddress({
            contentNotify: contentNotify
          })
          this.t1688 = new purchas1688AddAddress({
            contentNotify: contentNotify
          })
          if (/1688/.test(purchasLink)) {
            this.t1688.initListener()
            setTimeout(() => {
              this.t1688.validateAddress(realConsigneeInfo, 'init')
            }, 2000)
          }
          if (/pdd/.test(purchasLink)) {
            this.pdd.initListener()
            setTimeout(() => {
              this.pdd.validateAddress(realConsigneeInfo, 'init')
            }, 2000)
          }
        })
        return true
      }

      if (action == 'purchas' && type == 'CHECK_CURRENT_TAB_ORDER') {
        let isLogin = await this.t1688.validateAddress(realConsigneeInfo)
        if (isLogin == -1) {
          sendResponse({ code: -1, result: null, message: '请登录1688后刷新此页面' })
        } else {
          try {
            let tabOrderInfo = await getStorageSync('orderInfo')
            let {
              orderInfo: { tabId }
            } = tabOrderInfo
            getTabId2(currenTabId => {
              if (tabId == currenTabId) {
                sendResponse({ code: 0, result: tabOrderInfo, message: '标签页数据获取成功' })
              }
            })
          } catch (error) {
            // sendResponse({ code: -2, result: tabOrderInfo, message: '当前标签页不匹配' })
            console.log(error)
          }
        }
        // console.log('isLogin', isLogin)
      }
    })
  }
}

const purchas = new Purchas()
purchas.init()
