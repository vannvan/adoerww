import { ERP_LOGIN_URL } from '@/lib/env.conf'
export const WEBSITES = [
  {
    name: '马来西亚',
    key: 'my',
    seller: 'https://seller.shopee.com.my/',
    front: 'https://shopee.com.my/',
    mall: 'https://mall.shopee.com.my/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.my.shopee.cn/',
<<<<<<< HEAD
    cnfront: 'https://my.xiapibuy.com/',
    cnmall: 'https://mall.my.xiapibuy.com/shop/ID/following?__classic__=1'
=======
    cnfront: 'https://my.xiapibuy.com/'
>>>>>>> a15dd05e7b36518510e1d4604177f9e1e733be56
  },
  {
    name: '印度尼西亚',
    key: 'id',
    seller: 'https://seller.shopee.co.id/',
    front: 'https://shopee.co.id/',
    mall: 'https://mall.shopee.co.id/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.id.shopee.cn/',
<<<<<<< HEAD
    cnfront: 'https://id.xiapibuy.com/',
    cnmall: 'https://mall.id.xiapibuy.com/shop/ID/following?__classic__=1'
=======
    cnfront: 'https://id.xiapibuy.com/'
>>>>>>> a15dd05e7b36518510e1d4604177f9e1e733be56
  },
  {
    name: '泰国',
    key: 'th',
    seller: 'https://seller.shopee.co.th/',
    front: 'https://shopee.co.th/',
    mall: 'https://mall.shopee.co.th/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.th.shopee.cn/',
<<<<<<< HEAD
    cnfront: 'https://th.xiapibuy.com/',
    cnmall: 'https://mall.th.xiapibuy.com/shop/ID/following?__classic__=1'
=======
    cnfront: 'https://th.xiapibuy.com/'
>>>>>>> a15dd05e7b36518510e1d4604177f9e1e733be56
  },
  {
    name: '菲律宾',
    key: 'ph',
    seller: 'https://seller.shopee.ph/',
    front: 'https://shopee.ph/',
    mall: 'https://mall.shopee.ph/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.ph.shopee.cn/',
<<<<<<< HEAD
    cnfront: 'https://ph.xiapibuy.com/',
    cnmall: 'https://mall.ph.xiapibuy.com/shop/ID/following?__classic__=1'
=======
    cnfront: 'https://ph.xiapibuy.com/'
>>>>>>> a15dd05e7b36518510e1d4604177f9e1e733be56
  },
  {
    name: '新加坡',
    key: 'sg',
    seller: 'https://seller.shopee.sg/',
    front: 'https://shopee.sg/',
    mall: 'https://mall.shopee.sg/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.sg.shopee.cn/',
<<<<<<< HEAD
    cnfront: 'https://sg.xiapibuy.com/',
    cnmall: 'https://mall.sg.xiapibuy.com/shop/ID/following?__classic__=1'
=======
    cnfront: 'https://sg.xiapibuy.com/'
>>>>>>> a15dd05e7b36518510e1d4604177f9e1e733be56
  },
  {
    name: '越南',
    key: 'vn',
    seller: 'https://banhang.shopee.vn/',
    front: 'https://shopee.vn/',
    mall: 'https://mall.shopee.vn/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.vn.shopee.cn/',
<<<<<<< HEAD
    cnfront: 'https://vn.xiapibuy.com/',
    cnmall: 'https://mall.vn.xiapibuy.com/shop/ID/following?__classic__='
=======
    cnfront: 'https://vn.xiapibuy.com/'
>>>>>>> a15dd05e7b36518510e1d4604177f9e1e733be56
  },
  {
    name: '巴西',
    key: 'br',
    seller: 'https://seller.shopee.com.br/',
    front: 'https://shopee.com.br/',
    mall: 'https://mall.shopee.com.br/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.br.shopee.cn/',
<<<<<<< HEAD
    cnfront: 'https://br.xiapibuy.com/',
    cnmall: 'https://mall.br.xiapibuy.com/shop/ID/following?__classic__=1'
=======
    cnfront: 'https://br.xiapibuy.com/'
>>>>>>> a15dd05e7b36518510e1d4604177f9e1e733be56
  },
  {
    name: '台湾',
    key: 'tw',
    seller: 'https://seller.shopee.tw/',
    front: 'https://shopee.tw/',
    mall: 'https://mall.shopee.tw/shop/ID/following?__classic__=1',
    cnseller: 'https://seller.xiapi.shopee.cn/',
<<<<<<< HEAD
    cnfront: 'https://xiapi.xiapibuy.com/',
    cnmall: 'https://mall.xiapi.xiapibuy.com/shop/ID/following?__classic__=1'
=======
    cnfront: 'https://xiapi.xiapibuy.com/'
>>>>>>> a15dd05e7b36518510e1d4604177f9e1e733be56
  }
]

//找到域名配置项中的当前国家的项
export const getMatchSite = host => {
  let webHost = window.location.host || host
  const countryList = WEBSITES.map(el => el.key)
  let currentCountryCode = countryList.find(item => webHost.match(new RegExp(item))) || 'tw' //当前站点标识，如果没有匹配到绝对踏马是台湾
  return WEBSITES.find(item => item.key == currentCountryCode)
}

// 获取卖家前台/卖家中心/取关页面地址
export const getSiteLink = (type, host) => {
  let webHost = host || window.location.host
  const countryList = WEBSITES.map(el => el.key)
  try {
    let currentCountryCode = countryList.find(item => webHost.match(new RegExp(item))) || 'tw' //当前站点标识，如果没有匹配到绝对踏马是台湾
    let countrySite = WEBSITES.find(item => item.key == currentCountryCode)
    // 如果满足，一定是跨境店
    if (/xiapibuy.com/.test(webHost) || /shopee.cn/.test(webHost)) {
      type = 'cn' + type
    }
    return countrySite[type]
  } catch (error) {
    console.log(error)
  }
}

export const MESSAGE = {
  error: {
    syncLoginStatusFail: '虾皮登录状态同步失败，请关闭窗口重新登录',
    didNotGetToSiteInformation: '未获取到当前站点信息',
    pleaseCheckWhetherHaveAuthoriz: '请检查当前店铺是否已登录虾皮卖家中心',
    abnormalSituation: '请求遇到异常情况,请刷新页面后重新开始操作',
    failedToGetShopeeData: '获取销量数据失败',
    requestTimeout: '请求超时，请稍后重试',
    notSupport: '当前页面不支持该操作',
    checkIsAuthedERP: `您还未登录，请<a href="${ERP_LOGIN_URL}" target="_blank">登录</a>采集插件`,
    pleaseLogin1688: '请先登录1688后再采集',
    pleaseLoginTmall: '请先登录天猫再采集',
    pleaseLoginTaobao: '请先登录淘宝再采集',
    pleaseLoginAliexpress: '请先登录速卖通后再采集',
    pleaseSelectSomeGoods: '请选择需要采集的商品',
    beyondMaximumLimit: '批量采集不能超过50条',
    faildGetGoodsInfo: '未获取到商品信息',
    collectExceptionEncounter: '采集遇到异常，请稍后重试'
  },
  success: {
    collectSuccess: '采集成功',
    savehaveBeenAdd: '已添加至采集任务，请到采集箱查看采集结果'
  }
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
<<<<<<< HEAD

// 公共采集侧栏工具
export const COMMON_COLLECT = [
  {
    name: '采集',
    icon: 'icon-collect',
    id: 'EmalaccaCollect',
    fixed: true,
    children: [
      {
        name: '全选',
        action: 'select-all'
      },
      {
        name: '采集选中',
        action: 'collect-selected'
      },
      {
        name: '采集本页',
        action: 'collect-this-page'
      }
    ]
  }
]

// 虾皮网站专用侧栏工具
export const RIGHT_MENU = [
  {
    name: '粉丝',
    icon: 'icon-fans',
    id: 'EmalaccaFollower',
    fixed: true,
    children: [
      {
        name: '关注店铺粉丝',
        action: 'follow-other'
      },
      {
        name: '批量取关',
        action: 'unfollow'
      }
    ]
  },
  {
    name: '快捷',
    icon: 'icon-menu',
    id: 'EmalaccaQuick',
    fixed: true,
    children: [
      {
        name: '卖家中心',
        action: 'seller'
      },
      {
        name: '店铺前台',
        action: 'front'
      }
    ]
  }
]
=======
>>>>>>> a15dd05e7b36518510e1d4604177f9e1e733be56
