const search = require('libnpmsearch')
;(async () => {
  const list = await search('@opentiny')
  // console.log(list)

  console.log('包列表')

  console.log(
    list.map((item) => {
      return {
        name: item.name,
        desc: item.description,
      }
    })
  )
})()
