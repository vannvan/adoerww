const { ipcRenderer } = require('electron')
const $ = require('jquery')

$('.add-store').click(function () {
  ipcRenderer.send('inject-message', { type: 'ADD_STORE' })
})

$('.emalacca-logout').click(function () {
  ipcRenderer.send('inject-message', { type: 'ERP_LOGOUT' })
})

//点击头像
$('.emalacca-head-img').click(function () {
  $('.emalacca-logout').toggle()
})
