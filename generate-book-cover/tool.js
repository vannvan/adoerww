const multer = require('multer')
const mkdirp = require('mkdirp')
const sd = require('silly-datetime')
const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec // 这里不能使用shelljs的exec

const isBookName = (file) => /\S+-\S+\.(jpg|png|jpeg)/.test(file)

const fileRootPath = 'http://127.0.0.1:3001/images/'

const sourceImages = path.resolve('./public/images')

const uploadDir = path.join('./public/uploads')

const readDirectory = (pathName, map = []) => {
  fs.readdirSync(pathName).forEach((item, index) => {
    let stat = fs.lstatSync(path.join(pathName, item))
    if (stat.isDirectory()) {
      readDirectory(path.join(pathName, item), map)
    } else if (stat.isFile() && isBookName(item)) {
      const [bookName, bookAuthor] = item.split('.')[0].split('-')
      map = map.concat([{ bookName, bookAuthor, fileName: fileRootPath + item }])
    }
  })
  return map
}

let tools = {
  multer: () => {
    const storage = multer.diskStorage({
      //配置上传的目录
      destination: async (req, file, cb) => {
        // 生成格式化日期
        // let date = sd.format(new Date(), 'YYYYMMDD-HH')
        // 获取目录路径
        let dir = uploadDir
        // 生成目录，异步改同步
        await mkdirp(dir)
        cb(null, dir)
      },
      //修改上传后的文件名
      filename: function (req, file, cb) {
        //1、获取后缀名
        let extname = path.extname(file.fieldname)
        //2、根据时间戳生成文件名
        // cb(null, Date.now() + extname)
        const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8')
        const isExit = fs.existsSync(uploadDir + fileName)
        if (isExit) {
          exec(`rm ${uploadDir + fileName}`)
        }
        // console.log('fileName', fileName)
        cb(null, fileName)
      },
    })
    const upload = multer({ storage: storage })
    return upload
  },

  getBooks: async () => {
    const names = readDirectory(sourceImages)
    return names
  },
}

module.exports = tools
