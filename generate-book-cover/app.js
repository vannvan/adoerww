const express = require('express')
const app = express()
const port = 3001
const path = require('path')

const staticDir = '/images'
const fs = require('fs')
const tools = require('./tool')
const multer = require('multer')

app.use(express.urlencoded({ extended: false }))

const init = async () => {
  app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('X-Powered-By', ' 3.2.1')
    // res.header('Content-Type', 'application/json;charset=utf-8')
    next()
  })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.use('/', express.static('./public'))

  app.use(express.static(path.join(__dirname, staticDir)))

  app.get('/list', async (req, res) => {
    const list = await tools.getBooks()
    res.send({
      code: 0,
      data: list,
    })
  })

  const cpUpload = tools.multer().fields([
    { name: 'file', maxCount: 1 },
    { name: 'bookName', maxCount: 1, encoding: 'utf-8' },
  ])
  // const upload = multer({ dest: 'upload_tmp/' })

  app.post('/upload', cpUpload, (req, res) => {
    // const fileName = Buffer.from(req.files[0].originalname, 'latin1').toString('utf8')

    // const des_file = './public/uploads/' + fileName
    // fs.readFile(req.files[0].path, function (err, data) {
    //   fs.writeFile(des_file, data, function (err) {
    //     if (err) {
    //       console.log(err)
    //     } else {
    //       // res.end(JSON.stringify(response))
    //       res.send({
    //         code: 0,
    //         data: fileName + '上传成功',
    //       })
    //     }
    //   })
    // })
    res.send({
      code: 0,
      data: '上传成功',
    })
  })
  app.listen(port, () => {
    console.log(`脚本服务已启动 ${port}`)
  })
}

init()
