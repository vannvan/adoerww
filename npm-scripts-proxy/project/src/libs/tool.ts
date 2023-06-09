/**
 * 获取文件后缀
 * @param path
 * @returns
 */
export const getSuffix = (path: string) => {
  if (/\./.test(path)) {
    return path.split('.').at(-1)
  }
  return ''
}

/**
 * 解析命令行参数
 * @param args
 * @returns
 */
export const parseArgs = (args: string[]) => {
  const _args = args || process.argv
  if (_args.length >= 2) {
    const [, , command, ...args] = _args
    return {
      command,
      args,
    }
  }

  return {
    command: '',
    args: [],
  }
}
