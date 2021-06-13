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

// 加载远程脚本代码方式
// let script = document.createElement('script');
// let link = document.createElement('link');
// script.type = 'text/javascript'
// script.async = true
// let scriptUrl = 'https://sw-erp.oss-accelerate.aliyuncs.com/crawl-plugin/popup.js' + '?time=' + new Date().getTime()
// script.src = scriptUrl
// link.setAttribute("rel", "stylesheet")
// link.setAttribute("type", "text/css")
// let cssUrl = 'https://sw-erp.oss-accelerate.aliyuncs.com/crawl-plugin/popup.css' + '?time=' + new Date().getTime()
// link.setAttribute("href", cssUrl)
// let heads = document.getElementsByTagName("head");
// if (heads.length) {
//   heads[0].appendChild(script);
//   heads[0].appendChild(link);
// } else {
//   document.documentElement.appendChild(script);
//   document.documentElement.appendChild(link);
// }
