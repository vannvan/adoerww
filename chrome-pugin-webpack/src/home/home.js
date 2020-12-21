import Vue from 'vue'
import Home from '../components/Home'
import '@styles/home.less'

export default new Vue({
  components: {
    Home,
  },
  mounted() {
    console.log('mounted')
  },
  render: (h) => h(Home),
}).$mount('#app')
