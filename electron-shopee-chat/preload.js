// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  //   initTopDrag()
})

// 在顶部插入一个可以移动的dom
function initTopDrag() {
  const topDiv = document.createElement('div') // 创建节点
  topDiv.style.position = 'fixed' // 一直在顶部
  topDiv.style.top = '0'
  topDiv.style.left = '0'
  topDiv.style.height = '20px' // 顶部20px才可拖动
  topDiv.style.width = '100%' // 宽度100%
  topDiv.style.zIndex = '9999' // 悬浮于最外层
  topDiv.style.pointerEvents = 'none' // 用于点击穿透
  // @ts-ignore
  topDiv.style['-webkit-user-select'] = 'none' // 禁止选择文字
  // @ts-ignore
  topDiv.style['-webkit-app-region'] = 'drag' // 拖动
  document.body.appendChild(topDiv) // 添加节点
}
