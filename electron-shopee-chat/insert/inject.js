console.log('this is inject.js')
// alert(JSON.stringify(document))
const { ipcRenderer } = require('electron')

const shopeeHosts = {
  my: 'seller.shopee.com.my',
  br: 'seller.shopee.com.br',
  id: 'seller.shopee.co.id',
  th: 'seller.shopee.co.th',
  sg: 'seller.shopee.sg',
  ph: 'seller.shopee.ph',
  vn: 'seller.shopee.vn',
  tw: 'seller.shopee.tw',
}
const siteOption = [
  { name: '马来西亚', key: 'my' },
  { name: '菲律宾', key: 'ph' },
  { name: '泰国', key: 'th' },
  { name: '新加坡', key: 'sg' },
  { name: '台湾', key: 'tw' },
  { name: '巴西', key: 'br' },
  { name: '印度尼西亚', key: 'id' },
]

let headerFixed = document.createElement('div')
headerFixed.className = 'emalacca-client-header-fixed'

siteOption.map((el) => {
  headerFixed.innerHTML += `<div class="nav-item" data-key="${el.key}">${el.name}</div>`
})

document.body.prepend(headerFixed)

document
  .querySelector('.emalacca-client-header-fixed')
  .addEventListener('click', (e) => {
    // console.log(e.target.getAttribute('data-key'))
    let key = e.target.getAttribute('data-key')
    ipcNotice({ type: 'LOAD_PAGE', params: shopeeHosts[key] })
  })

ipcNotice({
  type: 'SET_COOKIES',
  params: { key: 'my', cookies: document.cookie },
})

// console.log(document.cookie)

// 如果在登录页面，把自动点击取消按钮
// if (/account\/signin/.test(location.href)) {
//   console.log('在登录页面')
//   if (document.querySelector('.shopee-modal__footer-buttons')) {
//     document.querySelector('.shopee-modal__footer-buttons').children[0].click()
//   }

//   setTimeout(() => {
//     document.querySelectorAll('input')[0].value = 'aimiao.my'
//     document.querySelectorAll('input')[1].value = 'Fm123456'
//     document.querySelectorAll('.shopee-button--primary')[0].click()
//   }, 2000)
// }

// 向主线程发送消息
function ipcNotice({ type, params }) {
  ipcRenderer.send('inject-message', { type: type, params: params })
}
