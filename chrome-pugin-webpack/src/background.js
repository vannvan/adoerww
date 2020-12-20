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
