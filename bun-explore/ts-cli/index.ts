console.log('Hello via Bun!')

import F from './file'

F.touch(`${+new Date()}.txt`, 'hello world')
