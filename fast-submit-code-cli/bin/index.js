#!/usr/bin/env node

const inquirer = require('inquirer')
const shell = require('shelljs')
const LIMIT = require('../util/commit-message')
const exec = shell.exec
let log = require('../util/log.js')
class FastSubmit {
    constructor() {
        this.commitMessage = null
    }
    start() {
        this.firstAsk()
    }

    firstAsk() {
        inquirer
            .prompt([{
                type: 'confirm',
                name: 'hasPull',
                message: '是否已拉取最新代码?',
                default: true
            }])
            .then((answers) => {
                let { hasPull } = answers
                if (!hasPull) {
                    exec('git pull')
                    process.exit(1)
                } else {
                    this.secondAsk()
                }
            })
    }

    secondAsk() {
        inquirer
            .prompt([{
                type: 'list',
                name: 'commitType',
                message: '选择你的提交类型:',
                default: 'fix',
                choices: Object.keys(LIMIT).map((key) => {
                    return { value: key, name: `${key}:表示${LIMIT[key]}` }
                })
            }])
            .then((answers) => {
                let { commitType } = answers
                if (process.argv[2]) {
                    this.commitMessage = commitType + ':' + process.argv[2]
                    this.pushTask()
                } else {
                    this.thirdAsk(commitType)
                }
            })
    }

    thirdAsk(commitType) {
        inquirer
            .prompt([{
                type: 'input',
                name: 'commitMessage',
                message: '请输出提交信息:'
            }])
            .then((answers) => {
                let { commitMessage } = answers
                if (commitMessage) {
                    this.commitMessage = commitType + ':' + commitMessage
                    this.pushTask()
                } else {
                    log('Error: 提交信息不能为空 ', { font: 'red' })
                    process.exit(1)
                }
            })
    }

    pushTask() {
        let commitMessage = this.commitMessage
        log(`Info: Commit Message【${commitMessage}】`, { font: 'green' })
        if (exec('git add .').code !== 0) {
            log('Error: Git add failed', { font: 'red' })
            process.exit(1)
        }

        if (exec(`git commit -am "${commitMessage}"`).code !== 0) {
            log('Error: Git commit failed', { font: 'red' })
            process.exit(1)
        }
        if (exec('git push').code !== 0) {
            log('Error: Git push failed', { font: 'red' })
            process.exit(1)
        }
        log('Success: Code Submitted Successful！！！', { font: 'green' })
    }
}

const p = new FastSubmit()
p.start()
