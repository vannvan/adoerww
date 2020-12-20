// console.log(' ====>>> ', $)
import { getURL } from '@/lib/chrome-client.js'

// console.log('注入页面inject')
// var iframe = document.createElement('iframe')
// iframe.width = 400
// iframe.height = 800
// iframe.src = getURL('home.html')
// iframe.style.cssText = 'position: fixed;right: 0;top: 0;'
let rightFixed = document.createElement('div')
rightFixed.style.cssText =
  'width:400px;height:100vh;position:fixed;top:0;right:0;background:#fff;z-index:999'

document.body.appendChild(rightFixed)
