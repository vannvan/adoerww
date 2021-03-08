console.log('child inject is loaded')
// const axios = require('axios')

import Vue from 'vue'
import Home from '../components/Home.vue'

let rightFixed = document.createElement('div')
rightFixed.id = 'EmalaccaPluginApp'
document.body.appendChild(rightFixed)

// setTimeout(() => {
//   new Vue({
//     el: '#EmalaccaPluginApp',
//     render: (createElement) => {
//       return createElement(Home)
//     },
//   })
// }, 500)
