import Vue from 'vue'
import Popup from '@/components/Popup'
// import '@styles/home.less'
// import '@fonts/iconfont.css'
// import '@styles/iview/iview.css'

export default new Vue({
  components: {
    Popup
  },
  mounted() {
    console.log('mounted')
  },
  render: h => h(Popup)
}).$mount('#app')

chrome.extension.getBackgroundPage().test('ahahah') //传出

// export const PopupScript = {
//   getUserInfo: function(param) {
//     new Promise(resolve => {
//       sendMessageToBackground(
//         'auth',
//         { origin: document.location.origin, authInfo: authInfo },
//         'SYNC_ERP_AUTH_INFO',
//         data => {
//           resolve(data)
//         }
//       )
//     })
//   }
// }
