#!/usr/bin/env node
const dayjs = require('dayjs')

const { exec: exec2, spawn } = require('child_process')
const ora = require('ora')

const diffCommand = 'git diff --name-only'

const chalk = require('chalk')

const log = console.log

// 生成文件列表
exec2('npx ts-node-esm -T scripts/gen-list.ts', (err, sto) => {
  console.log(err, sto)
})

const spinner = ora('start task').start()

/**
 * 打印日志
 */
const Log = {
  error: (text) => log(chalk.red(text)),
  info: (text) => log(chalk.white(text)),
  success: (text) => log(chalk.green(text)),
  warn: (text) => log(chalk.yellow(text)),
}

const commitMessage = dayjs().format('YYYY-MM-DD HH:mm:ss')

const cmd = ['git add .', `git commit -m "${commitMessage}"`, 'git push']

exec2('git pull -p', (err, stdout, stderr) => {
  if (err) {
    Log.error(err)
  } else {
    Log.success('【sync origin success】')
    spinner.color = 'yellow'
    const task = cmd.map((item, index) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          exec2(item, function (err, sto) {
            if (err) {
              Log.error(err)
              reject(err)
            } else {
              resolve(`【${item}】 success`)
            }
          })
        }, index * 500)
      })
    })

    Promise.all(task).then((results) => {
      results.map((item) => {
        // Log.success(item)
        if (/push/.test(item)) {
          spinner.text = 'task executed successfully!'
          spinner.color = 'green'
          process.exit(1)
        }
      })
    })
  }
})
