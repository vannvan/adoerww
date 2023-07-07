/*
 * Description: 生成每个项目的描述列表
 * Created: 2023-06-12 15:54:15
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-07-07 20:37:16
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */
import { lstatSync, readdirSync } from 'fs'
import path from 'path'
import F from './file.js'
import { Log } from './log.js'
console.log('hello world')
;(async () => {
  const exclude = ['.git', '.vscode']
  readdirSync('./').forEach(async (item, _index) => {
    // console.log(item)
    const readmeFile = path.resolve(item + '/README.md')
    let stat = lstatSync(path.join(item))
    if (stat.isDirectory() && !exclude.includes(item)) {
      const isExit = await F.isExit(readmeFile)
      if (!isExit) {
        const content = `# ${item} \n ## 描述 \n ## 创建时间 \n ${Date}`
        F.touch2(readmeFile, content)
        Log.success(`${readmeFile}文件已创建`)
      }
    }
  })
})()
