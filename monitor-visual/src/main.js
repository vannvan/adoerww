import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'

import '@/theme/base-page.scss'

import globalMixins from '@/mixins/global'
Vue.mixin(globalMixins)

Vue.use(ViewUI)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
  router,
  store
}).$mount('#app')
