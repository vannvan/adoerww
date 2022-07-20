var curTs = Date.now
  ? function() {
      return Date.now()
    }
  : function() {
      return +new Date()
    }
var rStringChoices = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
function _rc_set(key, len, domain, expires) {
  var oldV = null
  // Note: To avoid breaking server-rendered csrf logic, we should always use the one in the cookie if possible. Otherwise server-rendered FORMs with CRSF inside them will break.
  if (oldV) return oldV
  var newV = randomString(len)
  //   $.cookie(key, newV, { path: '/', domain: domain, expires: expires })
  return newV
}
function randomString(length, chars) {
  chars = _defaultFor(chars, rStringChoices)
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))]
  return result
}

function _defaultFor(arg, val) {
  return typeof arg !== 'undefined' ? arg : val
}

function spc_f_set() {
  _rc_set('SPC_F', 32, null, new Date(curTs() + 86400 * 1000 * 365 * 20))
  // _rc_set('SPC_F', 32, window.ROOT_DOMAIN, new Date(curTs() + 86400 * 1000 * 365 * 20));
}

function getCookie(name) {
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

function csrf_set() {
  Object.defineProperty(window, 'csrf', {
    get: function() {
      return _rc_set('csrftoken', 32)
    }
  })
}

spc_f_set()
csrf_set
