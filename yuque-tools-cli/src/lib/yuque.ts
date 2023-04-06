import axios from 'axios'
import { afterOneDay, genPassword, Log } from './tool'
import { config as CONFIG } from '../config'
import { get, post } from './request'
import { IAccountInfo, IBookStack, ILoginResponse, TBookItem, TBookStackItem } from './type'
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

  const { data } = await post<ILoginResponse>(YUQUE_API.yuqueLoginApi, loginInfo, {
    Referer: CONFIG.host + YUQUE_API.yuqueReferer,
    origin: CONFIG.host,
  })

  if (data.ok) {
    const userInfoContent = JSON.stringify({ ...data.user, expired: afterOneDay() }, null, 4)
    F.touch2(CONFIG.userInfoFile, userInfoContent)
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
      }
    })
    const content = JSON.stringify({ booksInfo: _list }, null, 4)
    F.touch2(CONFIG.bookInfoFile, content)
    console.log(_list)
  }
}
