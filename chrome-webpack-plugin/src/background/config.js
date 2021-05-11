import { ERP_SYSTEM } from '@/lib/env.conf'
const SITEAPI = ERP_SYSTEM[process.env.NODE_ENV] + '/'
const COLLECT = ERP_SYSTEM[process.env.NODE_ENV] + '/goods/collect'
console.log(process.env.NODE_ENV)
export const CONFIGINFO = {
  url: {
    //查看已采集数据
    showAlreadyCrawl: function() {
      return COLLECT
    },
    //API接口
    ApiUrl: SITEAPI,
    //用户登录验证
    checkUserAccount: function() {
      return this.ApiUrl + 'member/account/login'
    },

    // 品牌词
    BrandAPI: function() {
      return this.ApiUrl + 'product/crawl/getCrwlFilter'
    },
    //请求后台
    postCrawlHtml: function() {
      return this.ApiUrl + 'product/crawl/postCrawl-body'
    },
    // 认证1688采集账号
    check1688Verify: function() {
      return this.ApiUrl + 'crawl/authorizationAlibaba'
    },
    // 查询后台店铺生成的单号
    queryList: function() {
      return this.ApiUrl + 'orderPurchase/queryList'
    },
    // 新增采购订单号
    addOrderPur: function() {
      return this.ApiUrl + 'orderPurchase/addOrderPur'
    },
    // 修改采购订单号
    updateOrderPur: function() {
      return this.ApiUrl + 'orderPurchase/updateOrderPur'
    },
    // 采购订单已退款
    refundOrderPur: function() {
      return this.ApiUrl + 'orderPurchase/refundOrderPur'
    },

    // 获取采集统计数据
    getCrawlCount: function() {
      return this.ApiUrl + 'product/crawl/count'
    },
    // 获取商品是否已采集
    postHasCrawl: function() {
      return this.ApiUrl + 'product/crawl/has-crawl'
    },
    // 上传地址
    handleUploadImages: function() {
      return this.ApiUrl + 'basic/config/platform/uploadImage'
    },
    // 获取需更新版本信息
    getQueryUpdatePlug: function() {
      return this.ApiUrl + 'product/crawl/member/query-last-version/'
    },
    // 到erp获取虾皮用户的粉丝列表，
    getShopeeFollowerList: function() {
      return this.ApiUrl + 'product/crawl/shopee-fans/get'
    },

    // 提交采购订单cookies
    submitPurchasOrderNO: function() {
      return this.ApiUrl + 'order-purchase/sync/expressTrackingNumber'
    },

    //修改采购订单状态
    updatePurchasStatus: function() {
      return this.ApiUrl + 'order-purchase/updateOrderPurchaseStatus'
    }
  }
}
