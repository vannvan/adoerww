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

import { Log } from './log.js'
import path from 'path'
import { mkdirSync, writeFileSync } from 'fs'

const projectName = process.argv[2]

if (!projectName) {
  Log.error('无效的名称')
  process.exit(0)
} else {
  const readmeContent = `# ${projectName} \n ## 目的 \n --\n ## 描述 \n--
  `
  mkdirSync(path.resolve(`./${projectName}`))
  writeFileSync(path.resolve(`./${projectName}/README.md`), readmeContent)
  Log.success('项目目录已生成')
}
