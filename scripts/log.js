const log = console.log
const chalk = require('chalk')

/**
 * 打印日志
 */
const Log = {
  help: (text) => log(chalk.cyan(text)),
  error: (text) => log(chalk.red('【~😭】', text)),
  info: (text) => log(chalk.white('【~🧐】', text)),
  success: (text) => log(chalk.green('【~😉】', text)),
  warn: (text) => log(chalk.yellow('【~😲】', text)),
}

module.exports = Log
