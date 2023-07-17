const { Command } = require('commander')
const program = new Command()
program
  .option('-d, --debug', 'debug布尔值')
  .option('-s, --small', 'small布尔值')
  .option('-p, --pizza-type <type>', 'flavour of pizza')

program.parse(process.argv)

const options = program.opts()
if (options.debug) console.log(options)
console.log('pizza details:')
if (options.small) console.log('- small pizza size')
if (options.pizzaType) console.log(`- ${options.pizzaType}`)
