import axios from 'axios'
import { readdir } from 'fs'
import inquirer from 'inquirer'
const log = console.log
import chalk from 'chalk'
import F from './file'
const JSEncrypt = require('jsencrypt-node')
import { config as CONFIG } from '../config'
import { ICookies } from './type'

export const oneDay = 86400000

/**
 * 一天之后过期
 * @returns
 */
export const afterOneDay = () => Date.now() + oneDay

/**
 * 打印日志
 */
export const Log = {
  error: (text: string) => log(chalk.red(text)),
  info: (text: string) => log(chalk.white(text)),
  success: (text: string) => log(chalk.green(text)),
  warn: (text: string) => log(chalk.yellow(text)),
}

/**
 * 获取知识库数据
 * @param token
 * @returns
 */
export const getYuqueRepos = (token: string) => {
  var config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://www.yuque.com/api/v2/repos/vannvan/tools/toc',
    headers: {
      'X-Auth-Token': token,
    },
  }

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data))
        resolve(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  })
}

export const exportDoc = (slug: string) => {
  var config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://www.yuque.com/vannvan/tools/${slug}/markdown?attachment=true&latexcode=false&anchor=false&linebreak=false`,
    headers: {
      cookie:
        'yuque_ctoken=D2EIsKDP9AkHiwfjhstu73vf; lang=zh-cn; _yuque_session=kC4Wtyjde9lU30Bjjd_G1a_6TtAJPZdeUjxTnlPOjbyLEJllL6_AQE2P-47b-cpEbCp5uDcE0z_TV9YRUSUECw==; current_theme=default; acw_tc=0bca28e216803190376956281e0166a95434b9121ba5f07b12c1e224dfc5f5',
    },
  }

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data))
        resolve(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  })
}

export const inquireAccount = (): Promise<{ userName: string; password: string }> => {
  return new Promise((resolve) => {
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'userName',
          name: 'userName',
        },
        {
          type: 'password',
          message: 'password',
          name: 'password',
        },
      ])
      .then(async (answer) => {
        const { userName, password } = answer
        if (!userName || !password) {
          log(chalk.red('无效信息'))
          process.exit(0)
        }
        resolve(answer)
      })
  })
}

/**
 * 获取本地存储的cookie
 */
export const getLocalCookies = () => {
  try {
    const cookie = F.read(CONFIG.cookieFile)
    if (cookie) {
      const _cookies = JSON.parse(cookie) as ICookies
      return _cookies
    } else {
      return undefined
    }
  } catch (error) {
    Log.error('本地cookie获取失败')
    return undefined
  }
}

/**
 * 加密
 * @param password
 * @returns
 */
export const genPassword = (password: string) => {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(CONFIG.publicKey)
  const time = Date.now()
  const symbol = time + ':' + password
  return encryptor.encrypt(symbol)
}
