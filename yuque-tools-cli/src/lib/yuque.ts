import axios from 'axios'
import { afterOneDay, genPassword, Log } from './tool'
import { config as CONFIG } from '../config'
import { post } from './request'
import { IAccountInfo, ILoginResponse } from './type'
import F from './file'
import YUQUE_API from './apis'

/**
 * 登录语雀
 * @param accountInfo
 */
export const loginYuque = async (accountInfo: IAccountInfo) => {
  const { userName, password } = accountInfo
  if (!userName || !password) {
    Log.error('账号信息有误')
    process.exit(0)
  }

  const loginInfo = {
    login: userName,
    password: genPassword(password),
    loginType: 'password',
  }

  const { data } = await post<ILoginResponse>(CONFIG.host + YUQUE_API.yuqueLoginApi, loginInfo, {
    Referer: CONFIG.host + YUQUE_API.yuqueReferer,
    origin: CONFIG.host,
  })

  if (data.ok) {
    const userInfoContent = JSON.stringify({ ...data.user, expired: afterOneDay() })
    F.touch2(CONFIG.userInfoFile, userInfoContent)
    Log.success('语雀登录成功')
    return 'ok'
  } else {
    Log.error('语雀登录失败')
    process.exit(0)
  }
}

/**
 * 获取知识库数据
 * @param token
 * @returns
 */
export const getYuqueRepos = (token: string) => {
  const config = {
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
        resolve(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  })
}
