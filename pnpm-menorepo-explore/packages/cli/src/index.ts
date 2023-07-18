#!/usr/bin/env node

import { add, sayHello } from '@flex/shared'

sayHello('Bob')

const sum = add(1, 2)
console.log('求和', sum)
