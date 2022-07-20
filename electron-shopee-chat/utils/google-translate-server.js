const request = require('request')

const _TKK = '442182.965842172' // 这玩意是从谷歌官网爬下来的
const _URL =
  'https://translate.google.cn/translate_a/single?client=webapp&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=sos&dt=ss&dt=t&otf=1&ssel=3&tsel=3&xid=45662847&kc=1'
const coding = function (a, b) {
  for (var d = 0; d < b.length - 2; d += 3) {
    var c = b.charAt(d + 2),
      c = 'a' <= c ? c.charCodeAt(0) - 87 : Number(c),
      c = '+' == b.charAt(d + 1) ? a >>> c : a << c
    a = '+' == b.charAt(d) ? (a + c) & 4294967295 : a ^ c
  }
  return a
}
const getGoogleTK = function (a, TKK = _TKK) {
  for (
    var e = TKK.split('.'), h = Number(e[0]) || 0, g = [], d = 0, f = 0;
    f < a.length;
    f++
  ) {
    var c = a.charCodeAt(f)
    128 > c
      ? (g[d++] = c)
      : (2048 > c
          ? (g[d++] = (c >> 6) | 192)
          : (55296 == (c & 64512) &&
            f + 1 < a.length &&
            56320 == (a.charCodeAt(f + 1) & 64512)
              ? ((c = 65536 + ((c & 1023) << 10) + (a.charCodeAt(++f) & 1023)),
                (g[d++] = (c >> 18) | 240),
                (g[d++] = ((c >> 12) & 63) | 128))
              : (g[d++] = (c >> 12) | 224),
            (g[d++] = ((c >> 6) & 63) | 128)),
        (g[d++] = (c & 63) | 128))
  }
  a = h
  for (d = 0; d < g.length; d++) (a += g[d]), (a = coding(a, '+-a^+6'))
  a = coding(a, '+-3^+b+-f')
  a ^= Number(e[1]) || 0
  0 > a && (a = (a & 2147483647) + 2147483648)
  a %= 1e6
  return a.toString() + '.' + (a ^ h)
}

/**
 * @param text 源文本
 * @param sourceLang 源语言
 * @param targetLang 目标语言
 *
 */

module.exports = googleTr = (text, sourceLang = 'en', targetLang = 'zh-CN') => {
  const tk = getGoogleTK(text)
  const api = `${_URL}&tk=${tk}&q=${encodeURI(
    text
  )}&tl=${targetLang}&sl=${sourceLang}`
  return new Promise((resolve, reject) => {
    request.get(api, {}, (error, response, body) => {
      const bodyObj = JSON.parse(body)
      //   resolve(bodyObj[0][0][0])
      resolve(bodyObj[0])
    })
  })
}
