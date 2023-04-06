import {
  delayedDownloadDoc,
  delayedGetDocCommands,
  getLocalCookies,
  inquireAccount,
  inquireBooks,
  Log,
  setJSONString,
} from './lib/tool'
import { config as CONFIG } from './config'
import F from './lib/file'
import path from 'path'
import { exportMarkdown, getBookStacks, getDocsOfBooks, loginYuque } from './lib/yuque'
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

  const ask = async () => {
    try {
      const localBook = F.read(CONFIG.bookInfoFile)
      const { expired, booksInfo: bookList } = JSON.parse(localBook)
      if (!expired || expired < Date.now()) {
        await getBook()
      } else {
        const books = (await inquireBooks()) as string[]
        if (books.length === 0) {
          Log.error('请选择知识库')
          process.exit(0)
        } else {
          const filterBookList = books.includes('all')
            ? bookList
            : bookList.filter((item: any) => books.includes(item.slug))

          delayedDownloadDoc(filterBookList, 1000, (item) => {
            //
          })
        }
      }
    } catch (error) {
      console.log(error)
      getBook()
    }
  }

  const getBook = async () => {
    setTimeout(async () => {
      const bookList = await getBookStacks()
      delayedGetDocCommands(bookList, CONFIG.duration, async (_bookList) => {
        const content = setJSONString({ booksInfo: bookList, expired: Date.now() + 3600000 })
        F.touch2(CONFIG.bookInfoFile, content)
        setTimeout(() => {
          ask()
        }, 200)
      })
    }, 300)
  }

  const start = async () => {
    if (userName && password) {
      accountInfo.userName = userName
      accountInfo.password = password
    } else {
      accountInfo = await inquireAccount()
    }

    const login = await loginYuque(accountInfo)
    if (login === 'ok') {
      ask()
    } else {
      Log.error('语雀登录失败')
    }
  }

  needLogin && start()
})()
