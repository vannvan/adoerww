import Vue from 'vue'
import Popup from '@/components/Popup'

export default new Vue({
  components: {
    Popup
  },
  mounted() {
    console.log('mounted')
  },
  render: h => h(Popup)
}).$mount('#app')
