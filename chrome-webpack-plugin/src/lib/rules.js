import $ from 'jquery'

//支持采集的平台
const ruleInfo = {
  'aliexpress.com': {
    detect: (url) => {
      if ((/\/item\/?(.+)?\/[\d_]+\.html/).test(url) || (/\/store\/product\/.+?\/[\d_]+\.html/).test(url)) {
        return 'detail'
      }
      if ((/\/category\/\d+/).test(url)) {
        return 'category'
      }
      if ((/store\/?(.+)?\/[\d_]+\.html/).test(url) || (/store\/\d+\/search/).test(url) || url.indexOf('wholesale') !== -1 || url.indexOf('aliexpress.com/af/') !== -1) {
        return 'sortlist'
      }
    },
    detail: (url) => {
      if(url.indexOf('aliexpress.com/item/') !== -1 ||  url.indexOf('store/product') !== -1 || url.indexOf('aliexpress.com?spm') !== -1){
        return true
      }
    }
  },
  '1688.com': {
    detect: (url) => {
      if (/1688\.com\/offer\/\d+\.html/.test(url)) {
        return 'detail'
      }
      if (/\/page\/offerlist/.test(url)) {
        return 'category'
      }
      if (url.indexOf('selloffer/offer_search') !== -1) {
        return 'sortlist'
      }
    },
    detail: (url) => {
      if(url.indexOf('1688.com/offer') !== -1 || url.indexOf('1688.com/ci_bb') !== -1 || url.indexOf('1688.com/ci_king') !== -1 ){
        return true
      }
    }
  },
  'taobao.com': {
    detect: (url) => {
      if (url.indexOf('item.taobao.com/item.htm') !== -1) {
        return 'detail'
      }
      if (url.indexOf('taobao.com/category') !== -1 || url.indexOf('taobao.com/search.htm?spm') !== -1) {
        return 'category'
      }
      if (url.indexOf('taobao.com/list') !== -1 || url.indexOf('//s.taobao.com/search') !== -1) {
        return 'sortlist'
      }
    },
    detail: (url) => {
      if(/\.com\/item\.htm/.test(url) || /click\.(.+)?simba\.taobao\.com\/\w+/.test(url)){
        return true
      }
    }
  },
  // 天猫（包括天猫国际tmall.hk）
  'tmall.com': {
    detect: (url) => {
      if (url.indexOf('item.htm') !== -1 || /tmall\.hk(\/hk)?\/item/.test(url)) {
        return 'detail'
      }
      if (url.indexOf('tmall.com/category') !== -1 || url.indexOf('tmall.com/search.htm') !== -1) {
        return 'category'
      }
      if (/tmall\.(com|hk)?\/search_product/.test(url)) {
        return 'sortlist'
      }
    },
    detail: (url) => {
      if(/tmall\.hk(\/hk)?\/item/.test(url) || /\.com\/item\.htm/.test(url) || /[a-z]{3}\.simba\.taobao\.com\/\w+/.test(url)){
        return true
      }
    }
  },
  'shopee.': {
    detect: (url) => {
      if (url.indexOf('-i.') !== -1 || url.indexOf('/product/') !== -1) {
        return 'detail'
      }
      if (url.indexOf('/shop/') !== -1 && url.indexOf('followers?other=true') === -1 && url.indexOf('/following?_') === -1) {
        return 'category'
      }
      if (url.indexOf('/search?keyword') !== -1 || url.indexOf('-cat.') !== -1) {
        return 'sortlist'
      }
    },
    detail: (url) => {
      if(url.indexOf('-i.') !== -1){
        return true
      }
    }
  },
  'tw.shopeesz.com': {
    detect: (url) => {
      if (url.indexOf('-i.') !== -1 || url.indexOf('/product/') !== -1) {
        return 'detail'
      }
      if (url.indexOf('/search/?') !== -1 || url.indexOf('-cat.') !== -1 || url.indexOf('-col.') !== -1) {
        return 'sortlist'
      }
    },
    detail: (url) => {
      if(url.indexOf('-i.') !== -1){
        return true
      }
    }
  },
  'xiapibuy.com': {
    detect: (url) => {
      if (url.indexOf('-i.') !== -1 || url.indexOf('/product/') !== -1) {
        return 'detail'
      }
      if (url.indexOf('/shop/') !== -1 && url.indexOf('/followers?other=true') === -1 && url.indexOf('/following?_') === -1) {
        return 'category'
      }
      if (url.indexOf('/search?') !== -1 || url.indexOf('-cat.') !== -1) {
        return 'sortlist'
      }
    },
    detail: (url) => {
      if(url.indexOf('-i.') !== -1){
        return true
      }
    }
  },
  'lazada.': {
    detect: (url) => {
      if (url.indexOf('/products/') !== -1) {
        return 'detail'
      }
      if (url.indexOf('All-Products') !== -1) {
        return 'category'
      }
      if (url.indexOf('/catalog/?') !== -1 || url.indexOf('.cate_') !== -1) {
        return 'sortlist'
      }
    },
    detail: (url) => {
      if(url.indexOf('/products')!==-1){
        return true
      }
    }
  },
  'mobile.yangkeduo.com': {
    detect: (url) => {
      if (/\/goods(\d+)?\.html?/.test(url)) {
        return 'detail'
      }
    },
    detail: (url) => {
      if(url.indexOf('yangkeduo.com')!==-1){
        return true
      }
    }
  },
  // 拼多多批发，需要cookies目前只支持商品详情采集
  'pifa.pinduoduo.com': {
    detect: (url) => {
      if (url.indexOf('pinduoduo.com/goods/detail/?gid') !== -1) {
        return 'detail'
      }
    },
    detail: (url) => {
      if(url.indexOf('goods/detail/?gid') !== -1){
        return false
      }
    }
  },
  'dhgate.com': {
    detect: (url) => {
      if (url.indexOf('dhgate.com/product') !== -1) {
        return 'detail'
      }
      if (url.indexOf('dhgate.com/wholesale') !== -1 || url.indexOf('dhgate.com/w/') !== -1) {
        return 'sortlist'
      }
    },
    detail: (url) => {
      if(url.indexOf('/product/') !== -1){
        return true
      }
    }
  },
}

export const getRule = url => {
  if (!url) {
    return 'Invalid url...'
  }
  //天猫国际处理(https://babyglobal.tmall.hk/shop/view_shop.htm?spm=a230r.1.14.17.6b4447931UYV5Z&user_number_id=2200657724932)
  if (url.indexOf('tmall.hk') !== -1) {
    url = url.replace('tmall.hk', 'tmall.com')
  }
  var rule = ''
  $.each(ruleInfo, function(key, value) {
    if (url.indexOf(key) != -1) {
      rule = value
      return
    }
  })

  if (!rule) {
    return false
  }
  return rule
}
