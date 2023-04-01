import { exportDoc, getYuqueRepos } from './lib/tool'
import ora from 'ora'
const log = console.log

import F from './lib/file'
import path from 'path'
import chalk from 'chalk'

log(chalk.green('hello world'))

interface IListItem {
  slug: string
  title: string
}

;(async () => {
  const argv = process.argv
  const token = argv[2]
  if (!token) {
    log(chalk.red('请传入token'))
    process.exit(0)
  }
  const repos: any = await getYuqueRepos(token)

  const task = (list: IListItem[]) => {
    let index = 0
    const MAX = list.length
    const DURATION = 1000
    // const  MAX = 3
    const spinner = ora('Loading unicorns').start()

    const timer = setInterval(async () => {
      if (index === MAX - 1) {
        spinner.color = 'green'
        spinner.succeed('任务完成')
        clearInterval(timer)
      }
      const { title, slug } = list[index]
      // console.log(`当前目标文件${title}--${slug}`)
      spinner.color = 'yellow'
      spinner.text = `当前目标文件【${title}(${slug})]`
      const content: any = await exportDoc(slug)
      const contentTitle = `# ${title} \n`
      F.touch('doc', title + '.md', contentTitle + content)
      index++
    }, DURATION)
  }

  if (repos.data) {
    F.isExit(path.resolve('doc')) && F.rmdir(path.resolve('doc'))
    const excludePid = ['nHLKhf9Gg2_R8M4A']
    const list: IListItem[] = repos.data
      .filter((item: any) => item.slug != '#' && !excludePid.includes(item.parent_uuid))
      .map((item: any) => {
        return {
          slug: item.slug,
          title: item.title,
        }
      })
    task(list)
  }
})()
