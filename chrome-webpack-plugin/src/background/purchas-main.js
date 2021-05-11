import Purchas1688AddAddress from './purchas-1688'
import PurchasPddAddAddress from './purchas-pdd'
import {
  setStorageSync,
  getStorageSync,
  getTabId2,
  getCookies,
  sendMessageToContentScript
} from '@/lib/chrome'
import { CONFIGINFO } from '@/background/config.js'
import dayjs from 'dayjs'

var contentNotify = {} //content-script 消息通知

class Purchas {
  constructor() {
    this.t1688 = null
    this.pdd = null
    this.purchaseOrderInfo = {}
  }

  init() {
    let _this = this
    chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
      let { action, options, type } = request
      console.log(type, options, action)
      contentNotify = {
        type: type,
        sendResponse: sendResponse
      }
      _this.pdd = new PurchasPddAddAddress({
        contentNotify: contentNotify
      })
      _this.t1688 = new Purchas1688AddAddress({
        contentNotify: contentNotify
      })
      if (action == 'purchas' && type == 'INIT_ORDER_INFO') {
        _this.saveOrderAndInitListener(options)
        return true
      }

      if (action == 'purchas' && type == 'CHECK_CURRENT_TAB_ORDER') {
        _this.checkCurrentTabOrder(options, sendResponse)
        return true
      }

      if (action == 'purchas' && type == 'SUBMIT_PURCHAS_ORDER_NUMBER') {
        _this.submitPurchasOrderNumber(options, sendResponse)
        return true
      }

      if (action == 'purchas' && type == 'SYNC_PURCHAS_ORDER_DETAIL') {
        let { purchaseOrderno, purchasBuyerName, site } = options
        switch (site) {
          case '1688':
            _this.handleSync1688OrderInfo(purchaseOrderno, purchasBuyerName, sendResponse)
            break
          case 'pdd':
            _this.handleSyncYangkeduoOrderInfo(purchaseOrderno, purchasBuyerName, sendResponse)
            break
          default:
            break
        }
        return true
      }
    })
  }

  // 存储订单信息及初始化监听
  async saveOrderAndInitListener(options) {
    let _this = this
    let { purchasLink, orderInfo } = options
    chrome.tabs.create({ url: purchasLink, selected: true }, async function(nextTab) {
      setStorageSync({ orderInfo: Object.assign(orderInfo, { tabId: nextTab.id }) }) //存储orderInfo
      _this.purchaseOrderInfo = orderInfo

      if (/1688/.test(purchasLink)) {
        _this.t1688.initListener()
      }
      if (/yangkeduo/.test(purchasLink)) {
        _this.pdd.initListener()
      }
    })
  }

  // 获取当前标签页的订单信息
  async checkCurrentTabOrder(options, call) {
    let _this = this
    let { currentSite } = options
    try {
      let tabOrderInfo = await getStorageSync('orderInfo')
      let { orderInfo } = tabOrderInfo || {}
      getTabId2(async currentTabId => {
        if (orderInfo && orderInfo.tabId == currentTabId) {
          if (currentSite == '1688') {
            const t1688LoginStatus = await _this.t1688.validateAddress(tabOrderInfo.orderInfo)
            !t1688LoginStatus && call({ code: -1, result: null, message: '请登录1688后刷新此页面' })
          }
          if (currentSite == 'yangkeduo') {
            const pddLoginStatus = await _this.pdd.validateAddress(tabOrderInfo.orderInfo)
            !pddLoginStatus && call({ code: -1, result: null, message: '请登录拼多多后刷新此页面' })
          }
          call({ code: 0, result: tabOrderInfo, message: null })
        }
      })
    } catch (error) {
      // sendResponse({ code: -2, result: tabOrderInfo, message: '当前标签页不匹配' })
      console.error(error)
    }
  }

  // 取cookies及整合订单号
  async submitPurchasOrderNumber(options, call) {
    let _this = this
    try {
      getCookies({ url: options.siteOrigin }, async cookies => {
        let cookieStr = cookies.reduce((prev, curr) => {
          return `${curr.name}=${curr.value}; ` + prev
        }, '')
        // 如果是pdd 就拿 pdd_user_id 如果是1688 就拿 lid
        let uniqueSiteId = ''
        if (/1688/.test(options.siteOrigin)) {
          uniqueSiteId = decodeURI(cookies.find(el => el.name == 'lid').value)
        }
        if (/yangkeduo/.test(options.siteOrigin)) {
          uniqueSiteId = cookies.find(el => el.name == 'pdd_user_id').value
        }
        console.log(`${options.siteOrigin}cookies:`, cookieStr)
        let tabOrderInfo = await getStorageSync('orderInfo')
        let { orderInfo } = tabOrderInfo
        let updateParams = {
          ordersn: orderInfo.ordersn, //原始订单号
          purchaseOrderno: options.purchaseOrderno, //采购平台(1688/yangkeduo)订单号
          orderno: orderInfo.orderno, //采购单号
          status: 2, // 待付款
          reqCookie: cookieStr,
          purchaseAccount: uniqueSiteId,
          purchaseTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
        let orderStatus = await _this.updatePurchasStatus(updateParams)
        call({
          code: orderStatus ? 0 : -1,
          result: null,
          message: orderStatus
            ? `关联马六甲订单成功，请继续完成付款`
            : '关联马六甲订单失败，请关闭页面重新下单'
        })
        _this.refreshERPsystem()
      })
    } catch (error) {
      call({
        code: -1,
        result: null,
        message: '关联马六甲订单失败，请关闭页面重新下单'
      })
      console.error(error)
    }
  }

  updatePurchasStatus(data) {
    return new Promise(resolve => {
      $.ajax({
        url: CONFIGINFO.url.updatePurchasStatus(),
        type: 'post',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('pt-plug-access-user')).token
        },
        success: res => {
          console.log('updatePurchasStatus', res.data)
          if (res.data) {
            resolve(true)
          } else {
            resolve(false)
          }
        },
        error: error => {
          console.error(error)
          resolve(false)
        }
      })
    })
  }

  //刷新erp
  refreshERPsystem() {
    sendMessageToContentScript({ type: 'UPDATE_PAGE' }, function(response) {
      console.log(response, 'UPDATE_PAGE')
    })
  }

  // 取1688订单详情
  // 待付款 1778452597138175459
  // 待收获 1778453857153175459
  // 交易关闭 1778192605893175459
  async handleSync1688OrderInfo(orderNO, orderBuyer, call) {
    let { result, code, message } = await this.t1688.get1688OrderInfo(orderNO, orderBuyer)
    if (code == 0 && result) {
      let orderStatusTextNode = $(result).find('.stress') //订单状态节点
      let orderLogisticsNode = $(result).find('.logistics-flow-exposure') || []
      console.log('orderStatusTextNode', orderStatusTextNode)
      const orderStatusText = orderStatusTextNode.length
        ? orderStatusTextNode[0].innerText
        : '未知状态'
      const orderLogistic = orderLogisticsNode.length ? orderLogisticsNode[0].dataset : null
      call({
        code: 0,
        message: message,
        result: {
          purchaseSourceStatus: orderStatusText,
          purchaseOrderno: orderNO,
          ...orderLogistic
        }
      })
    } else {
      call({
        code: -1,
        message: message,
        result: null
      })
    }
  }

  // 取yangkeduo订单详情
  // 订单已取消 210416-287971738610624
  // 已签收 210506-406569687943457
  // 待付款 210510-123612765063457
  async handleSyncYangkeduoOrderInfo(orderNO, orderBuyer, call) {
    let { result, code, message } = await this.pdd.getYangkeduoOrderInfo(orderNO, orderBuyer)
    if (code == 0 && result) {
      let { data } = JSON.parse(result)
      const orderLogistic = data.expressInfo || null
      call({
        code: 0,
        message: message,
        result: {
          purchaseSourceStatus: data.pddStatusDesc, // pddStatusDesc是物流状态 orderStatusText 是订单状态
          purchaseOrderno: orderNO,
          ...orderLogistic
        }
      })
    } else {
      call({
        code: -1,
        message: message,
        result: null
      })
    }
  }
}

const SO = new Purchas()
SO.init()
