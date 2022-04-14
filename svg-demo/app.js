const http = require('http')

const express = require('express')

const app = express()

const server = http.createServer(app)

const path = require('path')

const root = path.join(__dirname, './public')

const fs = require('fs')

const url = require('url')

const io = require('socket.io')(server)

app.use(function (req, res, next) {
  const file = url.parse(req.url).pathname

  const mode = 'reload'

  createWatcher(file, mode)

  next()
})

app.use(express.static(root))

const watchers = {}

function createWatcher(file, event) {
  const absolute = path.join(root, file)

  console.log(event)

  console.log(watchers)

  if (watchers[absolute]) {
    return
  } else {
    fs.watchFile(absolute, function (curr, prev) {
      if (curr.mtime !== prev.mtime) {
        console.log(`文件被修改`)

        io.sockets.emit(event, file)
      }
    })

    watchers[absolute] = true
  }
}

server.listen(3000, function () {
  console.log(`The server is running on port 3000.`)
})
