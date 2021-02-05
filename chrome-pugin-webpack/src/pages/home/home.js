import Vue from 'vue'
import Home from '@/components/Home'
import '@styles/home.less'
import '@fonts/iconfont.css'
import '@styles/iview/iview.css'

export default new Vue({
  components: {
    Home
  },
  mounted() {
    console.log('mounted')
  },
  render: h => h(Home)
}).$mount('#app')
