const { ipcRenderer } = require('electron')
const $ = require('jquery')
const updateOnlineStatus = () => { 
    let text = navigator.onLine ? '<div class="emalacca-plugin-toast success">网络已连接</div>' : '<div class="emalacca-plugin-toast error">当前网络不可用，请检查你的网络设置</div>'
    $('.promptTxt').html(text)
    ipcRenderer.send('online-status-changed', navigator.onLine ? 'online' : 'offline') 
}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)
