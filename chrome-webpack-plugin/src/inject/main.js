import Vue from 'vue'
import Home from '@/components/Home.vue'
import WUI from '@/components/index'
import dragApp from './drag'
import Follow from './shopee'
import '@/wui-theme/src/index.scss'
import { getCookie } from '@/lib/utils'

let rightFixed = document.createElement('div')
rightFixed.id = 'EmalaccaPluginApp'
document.body.appendChild(rightFixed)

var rStringChoices = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function _rc_set(key, len, domain, expires) {
  var oldV = getCookie(key)
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

// function spc_f_set() {
//   _rc_set('SPC_F', 32, null, new Date(curTs() + 86400 * 1000 * 365 * 20))
//   // _rc_set('SPC_F', 32, window.ROOT_DOMAIN, new Date(curTs() + 86400 * 1000 * 365 * 20));
// }

const APP = {
  init: function() {
    if (/shopee|xiapibuy/.test(window.location.host)) {
      //   Follow.init()
      Follow.sendCsrfToken()
      Follow.preload()
    }
    dragApp()
  }
}

setTimeout(() => {
  Vue.use(WUI)
  new Vue({
    el: '#EmalaccaPluginApp',
    render: createElement => {
      return createElement(Home)
    }
  })
  APP.init()
}, 500)
