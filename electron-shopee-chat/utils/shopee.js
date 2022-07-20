const axios = require('axios')
const tough = require('tough-cookie')
const axiosCookieJarSupport = require('axios-cookiejar-support').default
const createCaptcheKey = require('./captche').createCaptcheKey
const cryptojs = require('./cryptojs')
const parsePhone = require('phone')
const { v4: uuidv4 } = require('uuid')

const keyCookieNames = ['SPC_SC_TK', 'SPC_EC', 'SPC_SC_UD', 'SPC_U', 'SPC_CDS']

const forever = new Date()
forever.setFullYear(2040)
// 强制cookie过期时间
const expires = forever.toGMTString()

const transformPhone = (phone, country) => {
  let arr = parsePhone(phone, country)
  if (arr && arr[0]) {
    // 删除开始+
    return arr[0].replace(/^\+/, '')
  }
  return phone
}

const cookie2str = (item, host) => {
  let domain = item.domain || host.replace('seller', '')
  let arr = [`${item.name}=${item.value}`, `expires=${expires}`]
  if (item.httpOnly) {
    arr.push('httponly')
  }
  arr.push(`domain=${domain}`)
  arr.push('path=' + (item.path || '/'))
  if (item.secure) {
    arr.push('secure')
  }
  return arr.join('; ')
}
// 根据用户名返回登录类型
const getLoginType = (account) => {
  if (account && account.indexOf('@') !== -1) {
    return 'email'
  }
  if (account && account.indexOf(':') !== -1) {
    // 子母账号
    return 'subaccount'
  }
  if (account && account.match(/[a-z]/i)) {
    // 用户名
    return 'username'
  }
  // 手机
  return 'phone'
}

module.exports = {
  // 官方最新登录方式
  // shopee需要国家了
  signin({country, host, username, password_hash, ip, cookies }, agent, tunnel) {
    username = (username || '').trim()
    const accountType = getLoginType(username)
    const sellerCenterFeSessionHash = uuidv4()
    const SPC_CDS = uuidv4()
    const headers = {
      'origin': `https://${host}`,
      'referer': `https://${host}/account/signin`,
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
      'sc-fe-session': sellerCenterFeSessionHash,
      'sc-fe-ver': 9594,
      'x-forwarded-proto': 'https',
      'x-forwarded-port': '443',
      'x-forwarded-for': ip
    }
    if (tunnel) {
      headers['x-timestamp'] = tunnel
    }
    const jar = new tough.CookieJar(null, {
      ignoreError: true
    })
    // 子母账号cookie[domain=.shopee.com]
    const subaccountCookies = []
    const http = axios.create({
      timeout: 50e3,
      withCredentials: true,
      // WARNING: This value will be ignored.
      jar,
      headers
    })
    // Set directly after wrapping instance.
    axiosCookieJarSupport(http)
    http.defaults.jar = jar
    if (agent) {
      http.defaults.httpAgent = agent
      http.defaults.httpsAgent = agent
    }
    if (cookies) {
      if (accountType === 'subaccount') {
        // 子账号登录需要SPC_CDS，要不可能出错
        jar.setCookieSync(cookie2str({
          name: 'SPC_CDS',
            value: SPC_CDS,
            domain: host,
            path: '/'
          }, host), `https://${host}/`)
      }
      // 植入cookie, 保证本土店铺使用原有的
      cookies.forEach(item => {
        let domain = item.domain
        if (('.' + host).includes(domain)) {
          // 提交SPC_SC_UD 会导致登录报400错误
          // if (keyCookieNames.indexOf(item.name) === -1 && item.value) {
          if (item.name === 'SPC_F') {
            jar.setCookieSync(cookie2str(item, host), `https://${host}/`)
          }
        } else {
          // 例如.shopee.com 登录子母账号的cookie信息
          if (domain.match(/shopee\.com$/)) {
            subaccountCookies.push(item)
            jar.setCookieSync(cookie2str(item, 'seller.shopee.com'), 'https://account.seller.shopee.com/')
          }
        }
      })
    }
    const getCookie = () => {
      return new Promise((resolve, reject) => {
        jar.getCookies(`https://${host}/`, (err, cookies) => {
          if (err) {
            reject(err)
          } else {
            let names = []
            let list = []
            cookies.forEach(item => {
              if (!item.value) {
                // value不存在时，返回
                return
              }
              let domain = item.domain || host
              if (domain && domain.startsWith('shopee')) {
                domain = '.' + domain
              }
              let ret = {
                name: item.key,
                value: item.value || '',
                domain,
                path: item.path,
                secure: item.secure,
                httpOnly: item.httpOnly,
                hostOnly: item.hostOnly,
              }
              if (item.expires) {
                ret.expirationDate = (new Date(item.expires)).getTime() / 1000
              } else {
                ret.session = true
              }

              let index = names.indexOf(ret.name)
              if (index !== -1) {
                // SPC_SC_TK存在两个， seller.my.shopee.cn这个域下的值为空。
                // my.shopee.cn下的有值
                if (!list[index].value) {
                  list.splice(index, 1)
                }
              }
              names.push(ret.name)
              list.push(ret)
            })
            resolve(list.concat(subaccountCookies))
          }
        })
      })
    }

    const getFingerprint = () => {
      return new Promise((resolve, reject) => {
        if (accountType === 'subaccount') {
          http.get('https://account.seller.shopee.com/api/get_fingerprint/').then(({ data: res }) => {
            resolve(res.fingerprint)
          }, reject)
        } else {
          resolve()
        }
      })
    }
    const loginSig = (shopId) => {
      return new Promise((resolve, reject) => {
        if (accountType === 'subaccount') {
          console.log('getSIG', shopId)
          // 当前请求403应该是少一个cookie
          http.get(`https://${host}/api/selleraccount/subaccount/get_sig/`, {
            params: {
              SPC_CDS,
              SPC_CDS_VER: 2,
              target_shop_id: shopId
            }
          }).then(({ data: res }) => {
            if (res.code === 0) {
              let sigs = res.url.match(/sig=([^&]+)/)
              if (sigs) {
                // let sig = decodeURIComponent(sigs[1])
                console.log('sig', decodeURIComponent(sigs[1]))
                http.post(`https://${host}/api/v2/login/`, `sig=${sigs[1]}`, {
                  headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    referer: res.url
                  }
                }).then(({ data: res2 }) => {
                  /*
                  {
                    "username": "xin996.my",
                    "shopid": 195533672,
                    "phone": "0000432692937569",
                    "sso": null,
                    "cs_token": null,
                    "portrait": "4e816700547c6cdcffb87d41fd0f259b",
                    "id": 195536606,
                    "errcode": 0,
                    "token": "sa_baaaff47f2f3af36250a223f3b4dd87f",
                    "subaccount_id": 387498,
                    "sub_account_token": "Nx0gl0ysUK8Hzq8LNHpiBWV8bmUG/gI86so+9biXTyD2bu8eXmkregjUmVxM0DpL",
                    "email": "zuoqiang448@126.com"
                  }
                  */
                  if (res2.errcode === 0) {
                    console.log('siglogin: ok')
                    resolve(res2)
                  } else {
                    reject(new Error(`siglogin: ${res2.errcode}, ${res2.errmsg || res2.message}`))
                  }
                }, reject)
              } else {
                reject(new Error('sig获取失败'))
              }
            } else {
              reject(new Error(`sigget: ${res.code}, ${res.message}`))
            }
          }, reject)
        } else {
          resolve()
        }
      })
    }
    return new Promise((resolve, reject) => {
      getFingerprint().then(fingerprint => {
        let captcha_key = createCaptcheKey()
        // 密码先md5，再 sha256
        if (accountType !== 'subaccount') {
          // 用户名、邮箱、手机登录需要再加密
          // 子账号登录只需要md5
          password_hash = cryptojs.SHA256(password_hash).toString()
          if (accountType === 'phone') {
            username = transformPhone(username, country)
          }
        }
        let data = `captcha=&captcha_key=${captcha_key}&remember=false&password_hash=${password_hash}&${accountType}=${username}`
        if (accountType === 'subaccount') {
          data += `&fingerprint=${fingerprint}`
        }
        console.log('post', data)
        http.post(`https://${host}/api/v2/login/`, data).then(({ data: user }) => {
          /*
            子账号返回信息
            {
              username: 'ahynhhblc:suxiaoyi',
              account_type: 'sub_merchant',
              shopid: 195533672,
              phone: '+8615058100276',
              sso: 'wc+t2ht6DLsjQm7v3C9EARMQ6oIpFjj0iHofZSXgyb7D75kxYuU+hBX+SgOQt2if',
              portrait: '',
              id: 0,
              nick_name: 'sxytest',
              main_account_id: 250327,
              errcode: 0,
              token: 'bd83f479e53cc0b5d4161462580ff680',
              subaccount_id: 387498,
              email: ''
            }
           */
          if (user.errcode !== 0) {
            return reject(user.errcode)
          }
          let shop = {
            user,
            host,
            shopId: user.shopid,
            shopName: user.username,
            userId: user.id,
          }
          if (accountType === 'subaccount') {
            shop.userId = user.subaccount_id || user.main_account_id
          }
          console.log('login.okkk', user)
          loginSig(shop.shopId).then(() => {
            http.post(`https://${host}/webchat/api/v1.2/login`).then(({ data: res }) => {
              console.log(res)
              shop.uid = res.user.uid
              shop.token = res.token
              shop.socketToken = res.p_token
              shop.status = res.user.status || 'normal'
              shop.country = (res.user.country || country).toLowerCase()
              getCookie().then(cookies2 => {
                shop.cookies = cookies2
                resolve(shop)
              }, reject)
            }, reject)
          }, reject)
        }, reject)
      }, reject)
    })
  },
  // cookies [{name, value, key}]
  authorize({ host, username, password, device_id, ip, cookies }, agent) {
    const jar = new tough.CookieJar(null, {
      ignoreError: true
    })
    const http = axios.create({
      timeout: 50e3,
      withCredentials: true,
      // WARNING: This value will be ignored.
      jar,
    })
    const headers = {
      'origin': `https://${host}`,
      'referer': `https://${host}/webchat/login`,
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
      'x-forwarded-proto': 'https',
      'x-forwarded-port': '443',
      'x-forwarded-for': ip
    }

    // Set directly after wrapping instance.
    axiosCookieJarSupport(http)
    http.defaults.jar = jar
    if (agent) {
      http.defaults.httpAgent = agent
      http.defaults.httpsAgent = agent
    }
    if (cookies) {
      // 植入cookie, 保证本土店铺使用原有的
      cookies.forEach(item => {
        // 提交SPC_SC_UD 会导致登录报400错误
        if (item.name !== 'SPC_SC_UD') {
          jar.setCookieSync(cookie2str(item, host), `https://${host}/`)
        }
      })
    }
    const getCookie = () => {
      return new Promise((resolve, reject) => {
        jar.getCookies(`https://${host}/`, (err, cookies) => {
          if (err) {
            reject(err)
          } else {
            let names = []
            let list = []
            cookies.forEach(item => {
              if (!item.value) {
                // value不存在时，返回
                return
              }
              let ret = {
                name: item.key,
                value: item.value || '',
                domain: item.domain,
                path: item.path,
                secure: item.secure,
                httpOnly: item.httpOnly,
                hostOnly: item.hostOnly,
              }
              if (item.expires) {
                ret.expirationDate = (new Date(item.expires)).getTime() / 1000
              } else {
                ret.session = true
              }

              let index = names.indexOf(ret.name)
              if (index !== -1) {
                // SPC_SC_TK存在两个， seller.my.shopee.cn这个域下的值为空。
                // my.shopee.cn下的有值
                if (!list[index].value) {
                  list.splice(index, 1)
                }
              }
              names.push(ret.name)
              list.push(ret)
            })
            resolve(list)
          }
        })
      })
    }
    return new Promise((resolve, reject) => {
      // TODO 支持下邮箱登录
      http.post(`https://${host}/webchat/api/v1/sessions?_v=2.8.0`, {
        device_id,
        username,
        password
      }, {
        headers
      }).then(({ data: res }) => {
        console.log(res)
        let shop = {
          host,
          shopId: res.user.shop_id,
          shopName: res.user.username,
          userId: res.user.id,
          uid: res.user.uid,
          token: res.token,
          socketToken: res.p_token,
          status: res.status
        }
        if (res.user.country) {
          shop.country = res.user.country.toLowerCase()
        }
        headers.referer = `https://${host}/`
        // 获取网站的SPC_SC_TK, 这样可以直接访问网站了
        http.get(`https://${host}/api/v2/login/`, {
          headers
        }).then(({ data: user }) => {
          console.log('get-login')
          // 后续可能会使用，暂时不用
          shop.user = user
          if (!shop.shopId) {
            // 如果是母子账号可能上面没有shopId，这里添加上
            shop.shopId = user.shopid
          }
          shop.subaccountId = user.subaccount_id
          if (username.match(/:\w+$/)) {
            // 母子账号
            http.get(`https://${host}/api/selleraccount/subaccount/get_sig/?target_shop_id=${user.shopid}`).then(({ data: res3 }) => {
              if (res3.code === 0) {
                let sigs = res3.url.match(/sig=([^&]+)/)
                if (sigs) {
                  console.log('sig ', sigs[1])
                  headers['Content-Type'] = 'application/x-www-form-urlencoded'
                  http.post(`https://${host}/api/v2/login/`, `sig=${sigs[1]}`, {
                    headers
                  }).then(getCookie).then(cookies => {
                    console.log('post-login')
                    shop.cookies = cookies
                    resolve(shop)
                  }, reject)
                }
              } else {
                reject(new Error(res3.message))
              }
            }, reject)
          } else {
            getCookie().then(cookies => {
              shop.cookies = cookies
              resolve(shop)
            }, reject)
          }
          /*
          {
            "username": "egogoods",
            "shopid": 41848116,
            "errcode": 0,
            "phone": "88613684909622",
            "sso": "xTykgI2MSp0TSE9w9t43lkaXxbhz843SXVEA4B6Jz5roxg+gGpabtBd1vpTLId4yXJJUsvf/rnsjgjtysKlvf/4AnnD2mtWW2OzC6+JSzj4vy1LZpQxwJPTr0yuDz1UL+vBSlyAkXxcuituAN7kwKZkckQNs3eYVVR90auQGxLQ=",
            "email": "egomall03@hotmail.com",
            "token": "WQTtIaFgKw+dnSZ9asw9xT1axGXWHTVYtFnF1X7WoxyJV4uNEDMIUGIiah7+P3B/",
            "cs_token": "xTykgI2MSp0TSE9w9t43lkaXxbhz843SXVEA4B6Jz5roxg+gGpabtBd1vpTLId4yXJJUsvf/rnsjgjtysKlvf/4AnnD2mtWW2OzC6+JSzj4vy1LZpQxwJPTr0yuDz1UL+vBSlyAkXxcuituAN7kwKZkckQNs3eYVVR90auQGxLQ=",
            "portrait": "996c1bb9e48618f296dcbaf3a46eae00",
            "id": 41849502,
            "sub_account_token": null
          }
          */
        }, reject)
      }, reject)
    })
  }
}
/*
// res响应
{
  "status": "verified",
  "p_token": "cH++uh7oUF8niXSvQvaOA8Xtiw0QSXLpWymwvIgfqlg=",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbmdvYWxpLm15IiwiY3JlYXRlX3RpbWUiOjE1NzEzOTMxNjcsImlkIjoiZTczOGQzOTZmMThlMTFlOWFlODhjY2JiZmU1ZGViZjUiLCJkZXZpY2VfaWQiOiI2OGRlMDE1NS1mMTM3LTQwNjItOTQ2NC0wMWIwYzYxMjM2NDAifQ.OzagQggkrWsQxa4m1Q0ukg-ldhh1iyuI7M5YWKMbEpc",
  "user": {
    "username": "mangoali.my",
    "rating": 0,
    "uid": "0-16248284",
    "distribution_status": null,
    "shop_id": 16246947,
    "is_blocked": false,
    "id": 16248284,
    "country": "MY",
    "locale": "en",
    "status": "normal",
    "avatar": null,
    "cb_option": 1,
    "type": "seller"
  }
}
jar.getCookies('https://seller.my.shopee.cn/', (err, cookies) => {
  // cookies数组
  console.log(JSON.stringify(cookies, undefined, 2))
})
*/