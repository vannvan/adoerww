/*
 * Description: 生成项目文件列表
 * Created: 2023-06-19 19:34:27
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-06-19 20:24:05
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
  let content = `const list = [ \n`
  let count = 0
  readdirSync('./').forEach(async (item, _index) => {
    const stat = lstatSync(path.join(item))
    if (stat.isDirectory() && !exclude.includes(item)) {
      content += `'${item}',\n`
      count++
    }
  })
  content += ']'
  F.touch2('./scripts/filelist.js', content)
  Log.success(`列表文件已生成，当前共${count}个项目，找时间优化哦！`)
})()
