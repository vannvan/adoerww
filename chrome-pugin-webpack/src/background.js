import { contextMenu } from './lib/chrome'

contextMenu({
  title: '请使用度娘搜索',
  showSelect: true,
  onclick: function () {
    console.log('heiheihei')
  },
})

console.log('背景脚本')
