import Vue from 'vue'
import Button from '../components/button'
import '@styles/popup.less'

export default new Vue({
  data: { test1: 'World' },
  components: {
    Button,
  },
  mounted() {
    console.log('mounted')
  },
  render: (h) => h(Button),
}).$mount('#app')
