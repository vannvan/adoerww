const { Command } = require('commander')
const program = new Command()

program.version('0.1.0')

program
  .command('pull')
  .description('获取知识库')
  .argument('[username]', '账户')
  .argument('[password]', '密码')
  .action((username, password) => {
    console.log('username:', username)
    console.log('password:', password)
  })

program.parse(process.argv)

// node demo3.js pull username=ss password=dd
// node demo3.js pull password=dd username=ss
// 以上均会得到如下解析
// username: password=dd
// password: username=ss
