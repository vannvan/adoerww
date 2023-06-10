/*
 * Description: 生成一个项目模板
 * Created: 2023-06-10 15:38:01
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-06-10 15:38:01
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */

const fs = require('fs')
const path = require('path')

const Log = require('./log')

const name = process.argv[2]

if (!name) {
  Log.error('无效的名称')
  process.exit(0)
} else {
  const readmeContent = `# ${name} \n ## 目的 \n --\n ## 描述 \n--
  `
  fs.mkdirSync(path.resolve(`./${name}`))
  fs.writeFileSync(path.resolve(`./${name}/README.md`), readmeContent)
}
