export const WEBSITES = [
  {
    name: '马来西亚',
    key: 'my',
    seller: 'https://seller.shopee.com.my/',
    front: 'https://shopee.com.my/',
    mall: 'https://mall.shopee.com.my/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.my.shopee.cn/',
    cnfront: 'https://my.xiapibuy.com/'
  },
  {
    name: '印度尼西亚',
    key: 'id',
    seller: 'https://seller.shopee.co.id/',
    front: 'https://shopee.co.id/',
    mall: 'https://mall.shopee.co.id/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.id.shopee.cn/',
    cnfront: 'https://id.xiapibuy.com/'
  },
  {
    name: '泰国',
    key: 'th',
    seller: 'https://seller.shopee.co.th/',
    front: 'https://shopee.co.th/',
    mall: 'https://mall.shopee.co.th/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.th.shopee.cn/',
    cnfront: 'https://th.xiapibuy.com/'
  },
  {
    name: '菲律宾',
    key: 'ph',
    seller: 'https://seller.shopee.ph/',
    front: 'https://shopee.ph/',
    mall: 'https://mall.shopee.ph/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.ph.shopee.cn/',
    cnfront: 'https://ph.xiapibuy.com/'
  },
  {
    name: '新加坡',
    key: 'sg',
    seller: 'https://seller.shopee.sg/',
    front: 'https://shopee.sg/',
    mall: 'https://mall.shopee.sg/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.sg.shopee.cn/',
    cnfront: 'https://sg.xiapibuy.com/'
  },
  {
    name: '越南',
    key: 'vn',
    seller: 'https://banhang.shopee.vn/',
    front: 'https://shopee.vn/',
    mall: 'https://mall.shopee.vn/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.vn.shopee.cn/',
    cnfront: 'https://vn.xiapibuy.com/'
  },
  {
    name: '巴西',
    key: 'br',
    seller: 'https://seller.shopee.com.br/',
    front: 'https://shopee.com.br/',
    mall: 'https://mall.shopee.com.br/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.br.shopee.cn/',
    cnfront: 'https://br.xiapibuy.com/'
  },
  {
    name: '台湾',
    key: 'tw',
    seller: 'https://seller.shopee.tw/',
    front: 'https://shopee.tw/',
    mall: 'https://mall.shopee.tw/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.xiapi.shopee.cn/',
    cnfront: 'https://xiapi.xiapibuy.com/'
  }
]

//找到域名配置项中的当前国家的项
export const getMatchSite = origin => {
  if (/cn/.test(origin)) {
    return {}
  } else {
    return WEBSITES.find(item => {
      if (JSON.stringify(item).search(origin) > 0) {
        return item
      } else {
        return null
      }
    })
  }
}

export const ERROR = {
  syncLoginStatusFail: '【马六甲卖家助手】:登录状态同步失败，请关闭窗口重新登录',
  didNotGetToSiteInformation: '【马六甲卖家助手】:未获取到当前站点信息',
  pleaseCheckWhetherHaveAuthoriz: '【马六甲卖家助手】: 请检查当前店铺是否已登录虾皮卖家中心',
  abnormalSituation: '【马六甲卖家助手】: 请求遇到异常情况,请刷新页面后重新开始操作',
  failedToGetShopeeData: '【马六甲卖家助手】: 获取销量数据失败'
}

export const COLLECT_SITES = [
  { name: '淘宝', link: 'https://www.taobao.com/', logo: require('@/assets/icon/logo-taobao.png') },
  { name: '天猫', link: 'https://www.tmall.com/', logo: require('@/assets/icon/logo-tianmao.png') },
  { name: '1688', link: 'https://www.1688.com/', logo: require('@/assets/icon/logo-1688.png') },
  {
    name: '速卖通',
    link: 'https://aliexpress.com/',
    logo: require('@/assets/icon/logo-aliexpress.png')
  },
  {
    name: '拼多多',
    link: 'https://mobile.yangkeduo.com/',
    logo: require('@/assets/icon/logo-pinduoduo.png')
  },
  {
    name: 'Shopee',
    link: 'https://shopee.com/index.html',
    logo: require('@/assets/icon/logo-shopee.png')
  },
  {
    name: 'Lazada',
    link: 'https://www.lazada.com/en/',
    logo: require('@/assets/icon/logo-lazada.png')
  }
]
