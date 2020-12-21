import Vue from 'vue'
import './css/new-tab.less'
import App from './client/App.vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
