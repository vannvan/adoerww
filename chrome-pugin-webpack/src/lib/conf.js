export const WEBSITES = [
  {
    name: '马来西亚',
    key: 'my',
    seller: 'https://seller.shopee.com.my/',
    front: 'https://shopee.com.my/',
    mall: 'https://mall.shopee.com.my/shop/ID/following?__classic__=1',
    cnSeller: 'https://seller.my.shopee.cn/',
    cnFront: 'https://my.xiapibuy.com/'
  },
  {
    name: '印度尼西亚',
    key: 'id',
    seller: 'https://seller.shopee.co.id/',
    front: 'https://shopee.co.id/',
    mall: 'https://mall.shopee.co.id/shop/ID/following?__classic__=1',
    cnSeller: 'https://seller.id.shopee.cn/',
    cnFront: 'https://id.xiapibuy.com/'
  },
  {
    name: '泰国',
    key: 'th',
    seller: 'https://seller.shopee.co.th/',
    front: 'https://shopee.co.th/',
    mall: 'https://mall.shopee.co.th/shop/ID/following?__classic__=1',
    cnSeller: 'https://seller.th.shopee.cn/',
    cnFront: 'https://th.xiapibuy.com/'
  },
  {
    name: '菲律宾',
    key: 'ph',
    seller: 'https://seller.shopee.ph/',
    front: 'https://shopee.ph/',
    mall: 'https://mall.shopee.ph/shop/ID/following?__classic__=1',
    cnSeller: 'https://seller.ph.shopee.cn/',
    cnFront: 'https://ph.xiapibuy.com/'
  },
  {
    name: '新加坡',
    key: 'sg',
    seller: 'https://seller.shopee.sg/',
    front: 'https://shopee.sg/',
    mall: 'https://mall.shopee.sg/shop/ID/following?__classic__=1',
    cnSeller: 'https://seller.sg.shopee.cn/',
    cnFront: 'https://sg.xiapibuy.com/'
  },
  {
    name: '越南',
    key: 'vn',
    seller: 'https://banhang.shopee.vn/',
    front: 'https://shopee.vn/',
    mall: 'https://mall.shopee.vn/shop/ID/following?__classic__=1',
    cnSeller: 'https://seller.vn.shopee.cn/',
    cnFront: 'https://vn.xiapibuy.com/'
  }
  //   {
  //     name: '巴西',
  //     key: 'br',
  //     seller: 'https://seller.shopee.com.br/',
  //     front: 'https://shopee.com.br/',
  //     mall: 'https://mall.shopee.com.br/shop/ID/following?__classic__=1',
  //     cnSeller:"https://seller.br.shopee.cn/"
  //     cnFront:'https://br.xiapibuy.com/'
  //   },
  //   {
  //     name: '台湾',
  //     key: 'tw',
  //     seller: 'https://seller.shopee.tw/',
  //     front: 'https://shopee.tw/',
  //     mall: 'https://mall.shopee.com.br/shop/ID/following?__classic__=1',
  //     cnSeller:'https://seller.xiapi.shopee.cn/',
  //     cnFront:'https://xiapi.xiapibuy.com/'
  //   },
]

export const ERROR = {
  syncLoginStatusFail: '【虾皮粉丝插件】:登录状态同步失败，请关闭窗口重新登录',
  didNotGetToSiteInformation: '【虾皮粉丝插件】:未获取到当前站点信息',
  pleaseCheckWhetherHaveAuthoriz: '【虾皮粉丝插件】: 请检查当前店铺是否已授权或是否已登录虾皮账户',
  abnormalSituation: '【虾皮粉丝插件】: 请求遇到异常情况,请刷新页面后重新开始操作',
  failedToGetShopeeData: '【虾皮粉丝插件】: 获取销量数据失败'
}

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
