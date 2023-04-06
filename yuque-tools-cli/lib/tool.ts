import axios from 'axios'
import { readdir } from 'fs'
import inquirer from 'inquirer'
const log = console.log
import chalk from 'chalk'

export class HandleThemes {
  public getFolderFiles(path: string): void {
    readdir(path, (errStatus, fileList) => {
      if (errStatus !== null) {
        console.log('文件读取失败, 错误原因: ', errStatus)
        return
      }
      console.log('文件读取成功', fileList)
    })
  }
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

export const inquireAccount = (): Promise<{ username: string; password: string }> => {
  return new Promise((resolve) => {
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'username',
          name: 'username',
        },
        {
          type: 'password',
          message: 'password',
          name: 'password',
        },
      ])
      .then(async (answer) => {
        const { username, password } = answer
        if (!username || !password) {
          log(chalk.red('无效信息'))
          process.exit(0)
        }
        resolve(answer)
      })
  })
}
