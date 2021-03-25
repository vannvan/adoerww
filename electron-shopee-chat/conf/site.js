// 站点相关配置
module.exports = Site = {
  shopeeSeller: {
    MY: { host: 'seller.my.shopee.cn', lang: 'ms', siteName: '马来西亚' },
    BR: { host: 'seller.br.shopee.cn', lang: 'pt', siteName: '巴西' },
    ID: { host: 'seller.id.shopee.cn', lang: 'id', siteName: '印度尼西亚' },
    TH: { host: 'seller.th.shopee.cn', lang: 'th', siteName: '泰国' },
    SG: { host: 'seller.sg.shopee.cn', lang: 'en', siteName: '新加坡' },
    PH: { host: 'seller.ph.shopee.cn', lang: 'tl', siteName: '菲律宾' },
    VN: { host: 'seller.vn.shopee.cn', lang: 'vi', siteName: '越南' },
    TW: { host: 'seller.xiapi.shopee.cn', lang: 'zh-TW', siteName: '台湾' },
  },
  langOptions: [
    { lang: 'zh', langName: '中文' },
    { lang: 'zh-tw', langName: '中文繁体' },
    { lang: 'en', currency: 'SGD', langName: '英语' },
    { lang: 'tl', currency: 'PHP', langName: '菲律宾语' },
    { lang: 'ms', currency: 'MYR', langName: '马来语' },
    { lang: 'id', currency: 'IDR', langName: '印尼语' },
    { lang: 'th', currency: 'THB', langName: '泰语' },
    { lang: 'vi', currency: 'VND', langName: '越南语' },
    { lang: 'pt', currency: 'BRL', langName: '葡萄牙语' },
  ],
}
