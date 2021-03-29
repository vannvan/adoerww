const SiteConfig = require('../conf/site')
module.exports = Lib = {
  guid: function () {
    // 形如 57cc6dc7-e1d6-41a0-8be4-b9f4a33cd0be
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
  },
  /**粗略的比较两个对象是否相等，
    主要用于比较旧消息队列和新消息队列是否相同，减少通知提醒的频率
 **/
  compare: function (oldObj, newObj) {
    if (typeof oldObj == 'object' && typeof newObj == 'object') {
      return JSON.stringify(oldObj) == JSON.stringify(newObj)
    }
    return false
  },

  //店铺菜单分组
  groupStore: function (source) {
    if (source.length == 0) {
      return null
    }
    let groups = []
    source.forEach(o => {
      let index = groups.findIndex(item => item && item.key == o.countryCode)
      if (index < 0) {
        groups.push({
          key: o.countryCode,
          siteName: SiteConfig.shopeeSeller[o.countryCode].siteName,
          storeList: [o],
        })
      } else {
        groups[index].storeList.push(o)
      }
    })
    return groups
  },

  //数组平铺
  flat: function (arr) {
    let flatArr = [].concat(...arr)
    return flatArr.some(item => Array.isArray(item)) ? flat(flatArr) : flatArr
  },

  //解构接口错误信息
  getError: function (error) {
    let {
      config: { url, method, headers },
      data,
    } = error.response
    return {
      url: url,
      method: method,
      headers: headers,
      message: data.message,
    }
  },
}
