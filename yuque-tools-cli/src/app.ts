import { exportDoc, getLocalCookies, getYuqueRepos, inquireAccount, Log } from './lib/tool'
import { config as CONFIG } from './config'
import F from './lib/file'
import path from 'path'
import { loginYuque } from './lib/yuque'
import { IAccountInfo } from './lib/type'
;(async () => {
  Log.info('开始登录语雀')
  const [userName, password] = [process.argv[2], process.argv[3]]
  let accountInfo: IAccountInfo = {
    userName: '',
    password: '',
  }

  // exit docs dir?
  const docExit = await F.isExit(path.resolve(CONFIG.outputDir))

  // is need login yuque?
  let needLogin = true

  if (!docExit) {
    F.mkdir(path.resolve(CONFIG.outputDir))
    F.mkdir(path.resolve(CONFIG.metaDir))
  } else {
    const cookie = getLocalCookies()
    // is expired
    if (cookie && cookie?.expired > Date.now()) {
      needLogin = true
    }
  }

  const start = async () => {
    if (userName && password) {
      accountInfo.userName = userName
      accountInfo.password = password
    } else {
      accountInfo = await inquireAccount()
    }

    const login = await loginYuque({ password, userName })
    if (login === 'ok') {
      //
    }
  }

  needLogin && start()
})()
