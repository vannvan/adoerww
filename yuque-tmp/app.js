const JSEncrypt = require('jsencrypt-node')
const inquirer = require('inquirer')
const F = require('./file')
const request = require('request')

// 全局数据
const GLOBAL = {
  cookies: null,
  books: [],
}

const userInfo = {}

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfwyOyncSrUTmkaUPsXT6UUdXx
TQ6a0wgPShvebfwq8XeNj575bUlXxVa/ExIn4nOUwx6iR7vJ2fvz5Ls750D051S7
q70sevcmc8SsBNoaMQtyF/gETPBSsyWv3ccBJFrzZ5hxFdlVUfg6tXARtEI8rbIH
su6TBkVjk+n1Pw/ihQIDAQAB
-----END PUBLIC KEY-----`

const encryptor = new JSEncrypt()
encryptor.setPublicKey(publicKey)

/**
 * 加密
 * @param {*} password
 * @returns
 */
const genPassword = (password) => {
  const time = Date.now()
  const _password = time + ':' + password
  return encryptor.encrypt(_password)
}

/**
 * 获取cookies
 * @returns
 */
const getYuqueCookies = (accountInfo) => {
  const { username, password } = accountInfo
  if (!username || !password) {
    console.log('账号信息有误')
    process.exit(0)
  }
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'https://www.yuque.com/api/accounts/login',
      headers: {
        'content-type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        Referer: 'https://www.yuque.com/login?goto=https%3A%2F%2Fwww.yuque.com%2Fdashboard',
        origin: 'https://www.yuque.com',
      },
      body: JSON.stringify({
        login: username,
        password: genPassword(password),
        loginType: 'password',
      }),
    }
    request(options, function (error, response) {
      if (error) {
        console.log('登录失败')
        process.exit(0)
      }
      const cookies = response.headers['set-cookie'].join(';')
      console.log('登录成功', cookies)
      GLOBAL.cookies = cookies
      F.touch(
        './',
        'cookies.txt',
        JSON.stringify({
          time: Date.now(),
          cookies: cookies,
        })
      )
      // console.log(response.body.data)
      resolve(cookies)
    })
  })
}

/**
 * 获取知识库
 * @returns
 */
const getBookStacks = () => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: 'https://www.yuque.com/api/mine/book_stacks',
      headers: {
        cookie: GLOBAL.cookies,
      },
    }
    request(options, function (error, response) {
      if (error) {
        console.log('数据获取失败')
        reject(0)
        throw new Error(error)
      }
      const { data } = JSON.parse(response.body)
      const list = data.reduce((prev, curr) => {
        return prev.books.concat(curr.books)
      })
      const _list = list.map((item) => {
        return {
          slug: item.slug,
          name: item.name,
          user: item.user.name,
          id: item.id,
        }
      })
      // console.log(list)
      resolve(_list)
      // resolve(response.body)
    })
  })
}

const getYuqueExportContent = (repos) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: `https://www.yuque.com/${repos}/markdown?attachment=true&latexcode=false&anchor=false&linebreak=false`,
      headers: {
        cookie: GLOBAL.cookies,
      },
    }

    request(options, function (error, response) {
      if (error) {
        console.log('数据获取失败')
        reject(0)
        throw new Error(error)
      }
      resolve(response.body)
    })
  })
}

const inquireHandler = () => {
  return new Promise((resolve) => {
    inquirer
      .prompt([
        {
          type: 'input',
          message: '请输入帐号',
          name: 'username',
          default: process.argv[2],
        },
        {
          type: 'password',
          message: '请输入帐号',
          name: 'password',
          default: process.argv[2],
        },
      ])
      .then(async (answer) => {
        resolve(answer)
      })
  })
}

/**
 * 生成多选
 * @param {*} options
 * @returns
 */
const genDialogue = (key, desc, options) => {
  return new Promise((resolve) => {
    inquirer
      .prompt([
        {
          type: 'checkbox',
          message: desc,
          name: key,
          choices: options,
        },
      ])
      .then(async (answer) => {
        resolve(answer)
      })
  })
}

/**
 * 获取知识库下的文档
 * @param {*} bookId
 */
const getDocs = (bookId) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: `https://www.yuque.com/api/docs?book_id=${bookId}`,
      headers: {
        cookie: GLOBAL.cookies,
      },
    }
    request(options, function (error, response) {
      if (error) {
        console.log('知识库数据获取失败')
        reject(0)
        throw new Error(error)
      }

      const { data } = JSON.parse(response.body)
      const list = data.map((item) => {
        return {
          slug: item.slug,
          name: item.title,
        }
      })
      resolve(list)
    })
  })
}

const task = (bookInfo, docs) => {
  let index = 0
  const MAX = 3

  let timer = setInterval(async () => {
    if (index === MAX) {
      console.log('任务完成')
      clearInterval(timer)
      process.exit(0)
    }
    const { user, bookSlug } = bookInfo
    const docSlug = docs[index].slug
    const symbol = `${user}/${bookSlug}/${docSlug}`
    console.log('symbol', symbol)
    const content = await getYuqueExportContent(symbol)
    index++
    console.log('content', content)
  }, 1000)
}

;(async () => {
  const [username, password] = [process.argv[2], process.argv[3]]
  let accountInfo = {}

  console.log(username, password)
  if (username && password) {
    accountInfo.username = username
    accountInfo.password = password
  } else {
    accountInfo = await inquireHandler()
  }

  const storeCookies = (await F.isExit('./cookies.txt')) ? F.read('./cookies.txt') : ''

  const { time, cookies } = storeCookies ? JSON.parse(storeCookies) : {}

  if (!time || !cookies) {
    GLOBAL.cookies = await await getYuqueCookies(accountInfo)
  } else {
    GLOBAL.cookies = cookies
  }

  if (cookies) {
    const books = await getBookStacks()
    if (books) {
      const bookOptions = books.map((item) => {
        const symbol = [item.user, item.slug, item.id].join('-')
        return {
          name: item.name,
          value: symbol,
        }
      })
      const answer = await genDialogue('books', '请选择知识库(数字键选择)', bookOptions)
      console.log('answer', answer)
      const [user, slug, bookId] = answer.books[0].split('-')
      const docs = await getDocs(bookId)
      const bookInfo = {
        user,
        bookSlug: slug,
      }
      task(bookInfo, docs)
    }
  }
})()
