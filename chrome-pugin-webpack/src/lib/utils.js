//节流
export function throttle(fn, wait) {
  var timer = null
  return function() {
    var context = this
    var args = arguments
    if (!timer) {
      timer = setTimeout(function() {
        fn.apply(context, args)
        timer = null
      }, wait)
    }
  }
}

export function getCookie(name) {
  var strcookie = document.cookie //获取cookie字符串
  var arrcookie = strcookie.split('; ') //分割
  //遍历匹配
  for (var i = 0; i < arrcookie.length; i++) {
    var arr = arrcookie[i].split('=')
    if (arr[0] == name) {
      return arr[1]
    }
  }
  return ''
}

export const isEmpty = (obj) => {
  return typeof obj === 'undefined' || obj === null || obj === ''
}
