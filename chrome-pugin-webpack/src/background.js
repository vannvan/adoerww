import { contextMenu, getCurrent } from './lib/chrome'

contextMenu({
  title: '请使用度娘搜索',
  showSelect: true,
  onclick: function() {
    console.log('heiheihei')
  },
})

console.log('背景脚本')

function dump(tabId) {
  console.log('tabId', tabId)
}
getCurrent(dump)

function bgtest() {
  alert('background的bgtest函数！')
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('request', request)
  console.log('sender', sender)
  setTimeout(() => {
    sendResponse({ a: 1, name: '来自background的数据' })
  }, 2000)
  return true //return true可以避免The message port closed before a response was received报错
})
