import _ from 'lodash' // https://www.lodashjs.com/docs/lodash.cloneDeep
const URL = /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/

//深拷贝
export function cloneDeep(value) {
  return _.cloneDeep(value)
}

//检查 value 是否是 null 或者 undefined; 如果是，返回为true，否则为false
export function isNil(value) {
  return _.isNil(value)
}

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

export function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
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

/* 判断是否为空 */
export function isEmpty(obj) {
  switch (typeof obj) {
    case 'undefined':
      return true
    case 'string':
      return obj.trim().length === 0
    case 'object':
      if (Array.isArray(obj)) {
        return obj.length === 0
      } else if (obj === undefined) {
        return true
      } else if (obj === null) {
        return true
      } else if (Object.keys(obj).length === 0) {
        return true
      } else {
        return false
      }
    case 'number':
      if (isNaN(obj)) {
        return true
      } else {
        return false
      }
  }
}

/** 除法
 * @param { number } num1
 * @param { number } num2
 */
export function division(num1, num2) {
  if (num2 == 0) {
    return 0
  }
  let t1, t2, r1, r2
  try {
    t1 = num1.toString().split('.')[1].length
  } catch (e) {
    t1 = 0
  }
  try {
    t2 = num2.toString().split('.')[1].length
  } catch (e) {
    t2 = 0
  }
  r1 = Number(num1.toString().replace('.', ''))
  r2 = Number(num2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

/** 乘法
 * @param { number } num1
 * @param { number } num2
 */
export function mcl(num1, num2) {
  let m = 0,
    s1 = num1.toString(),
    s2 = num2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}

/** 加法
 * @param { number } arg1
 * @param { number } arg2
 */
export function add(arg1, arg2) {
  let r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

/**
 * 减法
 * @param { number } arg1
 * @param { number } arg2
 */
export function sub(arg1, arg2) {
  let r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = r1 >= r2 ? r1 : r2
  return Number(((arg1 * m - arg2 * m) / m).toFixed(n))
}

/**
 *
 *
 * @export
 * @param {*} key
 * @param {*} defaultValue any 如果没有匹配值，需要返回的默认值
 * @return {*} any
 */
export function getStorage(key, defaultValue = null) {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : defaultValue
}

/**
 * 对象转字符串
 *
 * @param {*} obj
 */
export const objectToQueryString = obj =>
  Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')

/**
 *
 * 接口请求返回值
 * @param {*} type  //请求类型，唯一值
 * @param {*} callback // 回调函数
 * @return {*}
 */
export const requestResult = (type, callback) => {
  return {
    success: function(data) {
      callback({ type: type, result: data, code: 0 })
    },
    complete: function(data) {
      console.log(data.responseJSON)
      if (data.status != 200) {
        callback({ type: type, result: null, code: -1 })
      }
    }
  }
}

//图片转base64
export const getBase64 = url => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function() {
      if (this.status === 200) {
        var blob = this.response
        var fileReader = new FileReader()
        fileReader.onloadend = function(e) {
          var result = e.target.result
          resolve(result)
        }
        fileReader.readAsDataURL(blob)
      }
    }
    xhr.onerror = function() {
      reject()
    }
    xhr.send()
  })
}

//base64转file对象
export const dataURLtoFile = (dataurl, filename) => {
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
}

export const handleJudgeLink = (url, callback) => {
  const siteMap = {
    1688: '1688',
    taobao: '淘宝',
    tmall: '天猫',
    yangkeduo: '拼多多'
  }
  if (!URL.test(url)) {
    console.log('不是有效链接')
    return false
  } else {
    let match = url.match(/1688|taobao|tmall|yangkeduo/)
    return match
      ? {
          sitekey: match[0],
          siteName: siteMap[match[0]]
        }
      : 'other'
  }
}
