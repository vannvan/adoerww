import jsdom from 'jsdom'
import { afterOneDay, genPassword, Log, setJSONString } from './tool'
import { config as CONFIG } from '../config'
import { get, post } from './request'
import { IAccountInfo, ILoginResponse, TBookItem, TBookStackItem, TDocItem } from './type'
import F from './file'
import YUQUE_API from './apis'
const { JSDOM } = jsdom

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

  const { data } = await post<ILoginResponse>(YUQUE_API.yuqueLoginApi, loginInfo, {
    Referer: CONFIG.host + YUQUE_API.yuqueReferer,
    origin: CONFIG.host,
  })

  if (data.ok) {
    const userInfoContent = setJSONString({ ...data.user, expired: afterOneDay() })
    await F.touch2(CONFIG.userInfoFile, userInfoContent)
    Log.success('语雀登录成功')
    return 'ok'
  } else {
    Log.error('语雀登录失败')
    process.exit(0)
  }
}

/**
 * 获取知识库
 */
export const getBookStacks = async () => {
  const { data } = await get<TBookStackItem[]>(YUQUE_API.yuqueBooksList)
  if (data) {
    const list = data.reduce((prev: any, curr: { books: any }) => {
      return prev.books.concat(curr.books)
    }) as unknown as TBookItem[]
    const _list = list.map((item: TBookItem) => {
      return {
        slug: item.slug,
        name: item.name,
        user: item.user.name,
        id: item.id,
        docs: [],
      }
    })
    return _list
  } else {
    Log.error('获取知识库失败')
    process.exit(0)
  }
}

/**
 * 获取知识库下的文档
 * @param bookId
 * @returns 文档列表
 */
export const getDocsOfBooks = async (bookId: string) => {
  const { data } = await get<TDocItem[]>(YUQUE_API.yuqueDocsOfBook(bookId))
  if (data) {
    const list = data.map((item) => {
      return {
        slug: item.slug,
        name: item.title,
        // description: item.description,
      }
    })
    return list
  } else {
    Log.error(`获取{${bookId}}知识库文档失败`)
  }
}

/**
 * 导出md文件
 * @param repos 文档路径
 * @param linebreak 是否保留换行
 * @returns md内容
 */
export const exportMarkdown = async (repos: string, linebreak: boolean = false) => {
  const markdownContent = await get(YUQUE_API.yuqueExportMarkdown(repos, linebreak))
  if (markdownContent) {
    return markdownContent
  } else {
    Log.error(`导出{${repos}}知识库文档失败`)
  }
}

/**
 * 爬取语雀知识库页面数据
 */
export const crawlYuqueBookPage = (repos: string) => {
  return new Promise((resolve, reject) => {
    get(repos).then((res) => {
      const virtualConsole = new jsdom.VirtualConsole()
      const window = new JSDOM(`${res}`, { runScripts: 'dangerously', virtualConsole }).window
      virtualConsole.on('error', () => {
        // don't do anything
      })
      try {
        const { book } = window.appData
        resolve(book.toc)
      } catch (error) {
        Log.error(`知识库${repos}页面数据爬取失败`)
      }
    })
  })
}
