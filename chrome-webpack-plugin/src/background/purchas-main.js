import Purchas1688AddAddress from './purchas-1688'
import PurchasePddAddAddress from './purchas-pdd'
import { setStorageSync, getStorageSync, getTabId2, getCookies, getAllTabs } from '@/lib/chrome'
import { CONFIGINFO } from '@/background/config.js'
var contentNotify = {} //content-script 消息通知

class Purchas {
  constructor() {
    this.t1688 = null
    this.pdd = null
    this.userInfo = JSON.parse(localStorage.getItem('pt-plug-access-user'))
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
      _this.pdd = new PurchasePddAddAddress({
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

      if (action == 'purchas' && type == 'GET_PURCHAS_SITE_LOGIN_STATUS') {
        const t1688LoginStatus = await _this.t1688.checkLogin()
        const pddLoginStatus = await _this.pdd.checkLogin()
        sendResponse({
          code: 0,
          result: { pddLoginStatus: pddLoginStatus.cookieStr, t1688LoginStatus: t1688LoginStatus },
          message: null
        })
        console.log('pdd登录状态', pddLoginStatus.cookieStr, '1688登录状态', t1688LoginStatus)
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
      let {
        orderInfo: { tabId }
      } = tabOrderInfo
      getTabId2(async currentTabId => {
        if (tabId == currentTabId) {
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
      getCookies(options.siteOrigin, async cookies => {
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
          ordersn: orderInfo.ordersn,
          purchaseOrderno: options.purchaseOrderno,
          status: 2,
          reqCookie: cookieStr,
          purchaseSeller: uniqueSiteId
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
    let _this = this
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
    getAllTabs(urls => {
      urls.map(el => {
        if (el.url.match(/192|emalacca/)) {
          chrome.tabs.sendMessage(el.id, { type: 'UPDATE_PAGE' }, function(response) {
            console.log('UPDATE_PAGE', response)
          })
        }
      })
    })
  }
}

const SO = new Purchas()
SO.init()
