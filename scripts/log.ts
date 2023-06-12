import chalk from 'chalk'
const log = console.log

/**
 * 打印日志
 */
export const Log = {
  help: (text: string) => log(chalk.cyan(text)),
  error: (text: string) => log(chalk.red('【~😭】', text)),
  info: (text: string) => log(chalk.white('【~🧐】', text)),
  success: (text: string) => log(chalk.green('【~😉】', text)),
  warn: (text: string) => log(chalk.yellow('【~😲】', text)),
}
