import './background/importAll'

chrome.runtime.onInstalled.addListener(function() {
  console.log('首次安装')
})
