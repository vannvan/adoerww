import Vue from 'vue'
import Home from '@/components/Home.vue'
import WUI from '@/components/index'
import dragApp from './drag'
import Follow from './shopee'
import '@/wui-theme/src/index.scss'
import '@styles/home.less'
import '@fonts/iconfont.css'

let rightFixed = document.createElement('div')
rightFixed.id = 'EmalaccaPluginApp'
document.body.appendChild(rightFixed)

const APP = {
  init: function() {
    if (/shopee|xiapibuy/.test(window.location.host)) {
      Follow.sendCsrfToken()
      Follow.preload()
    }
    dragApp('.emalacca-plugin-action-wrap', '.emalacca-plugin-action-toggle')
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
  // 此节点用来让网页判断是否已安装插件及判断插件版本
  $('body').append(
    $(
      `<div id="emalacca-chrome-extension-installed" style="display:none" version="${VERSION}"></div>`
    )
  )
}, 500)
