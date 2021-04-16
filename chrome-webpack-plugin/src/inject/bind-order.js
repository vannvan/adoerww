console.log('订单采购')
import { sendMessageToBackground } from '@/lib/chrome-client.js'
import { sub } from '@/lib/utils'
import { getRule } from '@/lib/rules'
import dragApp from './drag'

class BindOrder {
  constructor() {
    this.supportSite = ['1688', 'yangkeduo']
    this.purchasOrderInfo = {}
  }
  locationObserver() {
    // 监听页面链接更新
    let self = this
    let oldHref = null
    let bodyList = document.querySelector('body'),
      observer = new MutationObserver(function(mutations) {
        if (oldHref != location.pathname && /1688|yangkeduo/.test(location.href)) {
          console.log('切换页面', location.href)
          oldHref = location.pathname
          sendMessageToBackground(
            'purchas',
            { currentSite: self.currentSite() },
            'CHECK_CURRENT_TAB_ORDER',
            data => {
              if (data && data.code == -1) {
                $.fn.message({
                  type: 'error',
                  msg: data.message
                })
              }
              if (data && data.code == 0) {
                self.purchasOrderInfo = data.result.orderInfo
                self.fillOrderInfoPanel(data.result.orderInfo)
              }

              let pageType = self.getPageType()
              console.log('页面类型；', pageType)
              switch (pageType) {
                case 'preOrder': // 如果是待提交订单页面，计算利润
                  self.calculateProfit()
                  break
                case 'toPay': // 如果是待付款页面，保存订单号
                  setTimeout(() => {
                    self.handleSubmitOrderNO()
                  }, 1500)
                  break
                default:
                  break
              }
            }
          )
        }
      })
    let config = {
      childList: true,
      subtree: true
    }
    observer.observe(bodyList, config)
    window.addEventListener('message', self.erpMessageHandler, false)
  }

  currentSite(locationHref) {
    let href = locationHref || location.href
    return this.supportSite.find(el => href.search(el) > 0)
  }

  getPageType() {
    const linkrule = getRule(location.href)
    const CONFIG = linkrule ? JSON.parse(linkrule) : null
    let isDetail = new Function('url', CONFIG.detail)(location.href)
    if (/smart_make_order|order_checkout/.test(location.href)) {
      return 'preOrder'
    }
    if (/trade_flow|exterfaceAssign/.test(location.href)) {
      return 'toPay'
    }
    if (isDetail) {
      return 'detail'
    }
    return null
  }

  //提交订单号到系统
  handleSubmitOrderNO() {
    let query = {}
    let purchaseOrderno = null
    location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (query[k] = v))
    if (this.currentSite() == '1688') {
      console.log(query.orderId, '1688订单号')
      purchaseOrderno = query.orderId
    } else {
      try {
        let alipayQuery = {}
        decodeURIComponent(query.return_url).replace(
          /([^?&=]+)=([^&]+)/g,
          (_, k, v) => (alipayQuery[k] = v)
        )
        purchaseOrderno = alipayQuery.order_sn
        console.log(alipayQuery.order_sn, 'pdd订单号')
      } catch (error) {
        $.fn.message({ type: 'error', msg: '获取拼多多订单信息失败' })
        console.error('pdd订单号获取失败')
      }
    }
    // 当前货源站点
    let siteOrigin = /trade_flow/.test(location.href)
      ? 'https://www.1688.com/'
      : 'https://mobile.yangkeduo.com/'
    if (!purchaseOrderno) {
      return false
    }
    sendMessageToBackground(
      'purchas',
      { purchaseOrderno: purchaseOrderno, siteOrigin: siteOrigin },
      'SUBMIT_PURCHAS_ORDER_NUMBER',
      data => {
        if (data) {
          $.fn.message({ type: data.code == 0 ? 'success' : 'error', msg: data.message })
        }
      }
    )
  }

  //计算利润
  calculateProfit() {
    let orderAmount = 0
    switch (this.currentSite()) {
      case '1688':
        orderAmount = $('.checkout-operate')
          .text()
          .replace(/[^0-9|.]/gi, '')
        $('.checkout-operate').before(
          `<div class="emalacca-plugin-purchas-calc-profit">
              利润 <b>¥${sub(this.purchasOrderInfo.totalAmount, orderAmount).toFixed(2)}</b>
           </div>`
        )
        break
      case 'yangkeduo':
        let payBtn = $("div:contains('立即支付')")
        try {
          orderAmount = $(payBtn[payBtn.length - 1])
            .parent()
            .text()
            .replace(/[^0-9|.]/gi, '')
        } catch (error) {
          console.error(error)
        }
        break
      default:
        break
    }
    if (orderAmount) {
      $('#emalacca-plugin-purchas-order').append(`
            <div class="purchas-calc-profit">当前订单预计毛利润 <b>¥${sub(
              this.purchasOrderInfo.totalAmount,
              orderAmount
            ).toFixed(2)}</b></div>
        `)
    }
  }

  // erp操作监听
  erpMessageHandler(e) {
    if (e.data && e.data.purchasLink) {
      let { purchasLink, orderInfo } = e.data
      if (/1688|yangkeduo/.test(purchasLink)) {
        sendMessageToBackground(
          'purchas',
          { purchasLink: purchasLink, orderInfo: orderInfo },
          'INIT_ORDER_INFO',
          data => {
            if (data && data.code == -1) {
              $.fn.message({
                type: 'error',
                msg: data.message
              })
            }
          }
        )
      } else {
        $.fn.message({
          type: 'error',
          msg: '仅支持1688和拼多多采购'
        })
      }
    }
  }

  //追加订单信息面板到平台
  fillOrderInfoPanel(orderInfo) {
    let { items } = orderInfo
    let skusNode = items.map((el, index) => {
      return `<div class="spec-item">
      <div class="main-images"><img src="${el.images || el.mainImage}"></div>
      <div class="sku-info">
        <p>
            <span class="title">规格${index + 1}</span>${el.variationSku}  
        </p>
        <p>
            <span class="title">单价</span> ¥${el.variationOriginalPrice}
        </p>
      </div>
     </div>`
    })
    let orderInfoPanelNode = $(`
        <div id="emalacca-plugin-purchas-order">
            <div class="emalacca-plugin-purchas-header">${APPNAME} ${VERSION} <small class="purchas-toggle-fold">收起</small></div>
            <div class="purchas-consignee-info">
                <h2>订单信息</h2>
                <p class="warning">重要提示：若当前商品不是你想要下单的商品，请关闭页面重新回到ERP重新保存链接进行下单，下单过程请勿打开新窗口去下单，否则无法正常关联订单。</p>
                <p class="consignee-info-item">
                    <span class="title">平台订单号</span>
                    <span class="value">${orderInfo.ordersn}</span>
                </p>
                <p class="consignee-info-item">
                    <span class="title">收件人</span>
                    <span class="value">${orderInfo.contacts}</span>
                </p>
                <p class="consignee-info-item">
                    <span class="title">电话</span>
                    <span class="value">${orderInfo.phone}</span>
                </p>
                <p class="consignee-info-item">
                    <span class="title">地址</span>
                    <span class="value">${orderInfo.fullAddress}</span>
                </p>
            </div>
            <div class="purchas-sku-info">${skusNode}</div>
            <div class="purchas-count-info">
                <li class="purchas-count-info-item">
                    <span class="title">合计 </span>
                    <span class="value">¥${orderInfo.totalAmount}</span>
                </li>
                <li class="purchas-count-info-item">
                    <span class="title">运费 </span>
                    <span class="value">¥${orderInfo.estimatedShippingFee}</span>
                </li>
                <li class="purchas-count-info-item">
                    <span class="value"><b>${orderInfo.items.length}</b></span> 件              
                </li>
            </div>
        </div>
    `)
    $('body').append(orderInfoPanelNode)
    var dnum = 1
    $('.purchas-toggle-fold').click(function() {
      dnum = dnum + 1
      let el = $('.purchas-consignee-info')
      let curHeight = el.height()
      let autoHeight = el.css('height', 'auto').height()
      if (dnum % 2 != 0) {
        $(this).text('收起')
        el.height(curHeight).animate({ height: autoHeight, opacity: 1 }, 300)
      } else {
        $(this).text('展开')
        el.height(curHeight).animate({ height: 0, opacity: 0 }, 300)
      }
    })
    dragApp('#emalacca-plugin-purchas-order', '.emalacca-plugin-purchas-header')
  }

  //为erp获取1688及pdd的登录状态
  getPurchasSiteLoginStatus() {
    sendMessageToBackground('purchas', {}, 'GET_PURCHAS_SITE_LOGIN_STATUS', data => {
      if (data && data.result && /192|emalacca/.test(location.href)) {
        let { pddLoginStatus, t1688LoginStatus } = data.result
        $('body').append(
          `<div id="emalacca-chrome-extension-purchas-auth" style="display:none" isPddLogin="${pddLoginStatus}" is1688Login="${t1688LoginStatus}"></div>`
        )
      }
    })
  }
}

const BO = new BindOrder()
BO.locationObserver()
BO.getPurchasSiteLoginStatus()
