// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// // console.log(document)
const { ipcRenderer } = require('electron')

// const ipcRenderer = require('electron').ipcRenderer
function getData() {
  console.log('渲染进程')
  ipcRenderer.send('inject-message', { type: 'IS_LOGIN' })
}

document.querySelector('#btnEd').addEventListener('click', () => {
  getData()
})
