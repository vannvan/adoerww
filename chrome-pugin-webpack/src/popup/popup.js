import Vue from 'vue'
import Popup from '../components/Popup'
import '@styles/popup.less'

export default new Vue({
  data: { test1: 'World' },
  components: {
    Popup,
  },
  mounted() {
    console.log('mounted')
  },
  render: (h) => h(Popup),
}).$mount('#app')
