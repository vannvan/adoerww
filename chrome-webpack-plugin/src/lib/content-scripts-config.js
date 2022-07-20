//支持采集的平台
const matchesInfo = {
  matches: [
    /http(s)?:\/\/(.*\.)?aliexpress\.com/,
    /http(s)?:\/\/.*\.?1688\.com/,
    /http(s)?:\/\/.*\.?taobao\.com/,
    /http(s)?:\/\/.*\.?tmall\.[(com | hk)]/,
    /http(s)?:\/\/mobile\.yangkeduo\.com/,
    /http(s)?:\/\/(.*\.)?shopee\./,
    /http(s)?:\/\/(.*\.)?xiapibuy\./,
    /http(s)?:\/\/.*\.?lazada\./,
    /http(s)?:\/\/pifa\.pinduoduo\.com/,
    /http(s)?:\/\/(.*\.)?dhgate\.com/,
    /http(s)?:\/\/.*\.?emalacca\.com/,
    /http(s)?:\/\/(mclient\.)?alipay\./,
    /http(s)?:\/\/192\.168\./
  ],
  excludeMatches: [
    /http(s)?:\/\/shopee\.com\/index\.html/,
    /http(s)?:\/\/shopee\.cn/,
    /http(s)?:\/\/www\.lazada\.com\/[a-z]+/,
    /http(s)?:\/\/(.*\.)?tmall\.com\/shop\/view_shop\.htm/,
    /http(s)?:\/\/izhongchou\.taobao\.com\//
  ]
}

export const isMatches = url => {
  let isExclude = false
  isExclude = matchesInfo.matches.some(item => item.test(url))
  if (isExclude) {
    isExclude = matchesInfo.excludeMatches.every(item => !item.test(url))
  }
  return isExclude
}
