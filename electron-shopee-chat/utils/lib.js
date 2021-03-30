const SiteConfig = require('../conf/site')
// require('./message')
module.exports = Lib = {
  addCssByLink: function (url) {
    var doc = document
    var link = doc.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', url)
    var heads = doc.getElementsByTagName('head')
    if (heads.length) heads[0].appendChild(link)
    else doc.documentElement.appendChild(link)
  },

  //base64转文件对象
  dataURLtoFile: function (dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    filename = `${filename}.jpg`
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  },

  //blob转base64
  getBase64: async function (url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()
      xhr.open('get', url, true)
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (this.status === 200) {
          var blob = this.response
          var fileReader = new FileReader()
          fileReader.onloadend = function (e) {
            var result = e.target.result
            resolve(result)
          }
          fileReader.readAsDataURL(blob)
        }
      }
      xhr.onerror = function () {
        reject()
      }
      xhr.send()
    })
  },

  storageGet: function (key) {
    return sessionStorage.getItem(key)
      ? JSON.parse(sessionStorage.getItem(key))
      : null
  },
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
      const countryCodeLimit = ['MY', 'PH', 'VN', 'ID', 'SG', 'BR', 'TW', 'TH']
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
    } = error.response || {config:{url:null}}
    return {
      url: url,
      method: method,
      headers: headers,
      message: data?.message,
      code: data?.code,
    }
  },
}
