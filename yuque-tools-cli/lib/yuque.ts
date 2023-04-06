import axios from 'axios'

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

export const loginYuque = () => {}
