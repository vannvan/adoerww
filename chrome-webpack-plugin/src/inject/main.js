import Vue from 'vue'
import Home from '@/components/Home.vue'
import WUI from '@/components/index'
import dragApp from './drag'
import Follow from './shopee'
import '@/wui-theme/src/index.scss'

let rightFixed = document.createElement('div')
rightFixed.id = 'EmalaccaPluginApp'
document.body.appendChild(rightFixed)

const APP = {
  init: function() {
    if (/shopee|xiapibuy/.test(window.location.host)) {
      Follow.init()
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

console.log(VERSION)
