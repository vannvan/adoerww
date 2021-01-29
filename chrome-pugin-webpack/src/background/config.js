import { API_CONFIG, API_CONFIG_COLLECT } from '@/lib/env'
const SITEAPI = API_CONFIG[process.env.NODE_ENV]
const COLLECT = API_CONFIG_COLLECT[process.env.NODE_ENV]
console.log(process.env.NODE_ENV)
export const CONFIGINFO = {
  url: {
    //采集服务
    crawlUrl: function() {
      return 'http://118.25.184.199:9999'
    },
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
    //请求后台
    getCrawlHtml: function() {
      return this.crawlUrl + '/crawl'
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
    }
  }
}
