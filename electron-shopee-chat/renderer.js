// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// // console.log(document)
// const ipcRenderer = require('electron').ipcRenderer
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
function getData() {
  console.log('渲染进程')
  ipcRenderer.send('master-close', 'render-index')
}

document.querySelector('#btnEd').addEventListener('click', () => {
  getData()
})

//在渲染器进程 (网页) 中。
const { ipcRenderer } = require('electron')
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
// ipcRenderer.send('asynchronous-message', 'ping')
