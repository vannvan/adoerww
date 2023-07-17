const { Command } = require('commander')
const program = new Command()

program.version('0.1.0')

program
  .command('pull')
  .option('-u, -username [username]', '账户')
  .option('-p, -password [password]', '密码')
  .action((_name, options, command) => {
    console.log('options', options.opts())
  })

program.parse(process.argv)

// node demo4.js pull -h

// 会得到如下信息：

// Usage: demo4 pull [options]

// Options:
//   -n, -username [username]  账户
//   -p, -password [password]  密码
//   -h, --help                display help for command

// node demo4.js pull -u xxx -p yyy

// 会得到如下信息：
// options { Username: 'xxx', Password: 'yyy' }
