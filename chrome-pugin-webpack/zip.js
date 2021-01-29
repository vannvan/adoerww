#!/usr/bin/env node

process.stdin.setEncoding('utf8')
const compressing = require('compressing')
const chalk = require('chalk')
const symbols = require('log-symbols')
const fs = require('fs')
const dayjs = require('dayjs')
const { resolve } = require('path')

const env = process.argv[2]

const packJSON = require('./package.json')

const prefixName = 'emalacca-plugin' //默认压缩包前缀

const time = dayjs(new Date()).format('YY-MM-DD-HH-mm')

toZip(`${prefixName}-${env}-${packJSON.version}(${time})`)

//执行压缩
function toZip(name) {
  compressing.zip
    .compressDir(resolve(__dirname, 'dist/'), `${name}.zip`)
    .then(() => {
      console.log(symbols.success, chalk.green(`${name}.zip` + '已保存至项目目录！'))
      process.exit()
    })
    .catch(err => {
      console.error(err)
    })
}

process.on('SIGINT', function() {
  console.log('Exit now!')
  process.exit()
})
