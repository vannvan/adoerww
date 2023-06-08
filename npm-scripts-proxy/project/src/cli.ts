#!/usr/bin/env node
import { existsSync, readFileSync } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { Log } from './libs/log.js'
import presets from './preset.js'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import babel from '@babel/core'
import generate from '@babel/generator'
import vm from 'vm'

import { codeFrameColumns } from '@babel/code-frame'
import { INsp, TDefineOpts } from './typing.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// console.log('__dirname', __dirname)

const CONFIG_FILE_NAMES = ['nsp.config.js', 'nsp.config.ts']

/**
 * 通过提供的方法配置，能带来更好的配置体验
 * @param  {TDefineOpts} config
 * @returns TDefineOpts
 */
export const defineNSPConfig = (config: TDefineOpts) => config

class Nsp implements INsp {
  constructor() {
    //
  }

  async init() {
    // const code = 'class Example {}'
    const configFile = path.resolve('nsp.config.ts')

    const content = readFileSync(configFile, 'utf-8')

    babel.transformFileAsync(configFile, {}).then((result) => {
      console.log(result)
    })

    // this.parseUserConfig()
  }

  async parseUserConfig() {
    let targetConfig = {}
    try {
      for (const fileName of CONFIG_FILE_NAMES) {
        const configFile = path.resolve(fileName)
        let isExit = existsSync(configFile)
        if (isExit && /js/.test(configFile)) {
          // 是js配置
          const Conf = await import(configFile)
          console.log(Conf.default)
          return []
        } else if (isExit && /ts/.test(configFile)) {
          // 是ts配置
          console.log('是ts配置', configFile)
          const content = readFileSync(configFile, 'utf-8')
          const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['typescript'],
          })
          console.log(ast)
          // // const Conf = await import(configFile)
          // const { code } = babel.transform(content, null, {
          //   // presets: ['@babel/preset-env'],
          //   plugins: ['@babel/plugin-transform-typescript'],
          // })
          // console.log(code)

          // console.log(babel.transform(content))
          return []
        }
      }
    } catch (error) {
      Log.error(error)
    }

    return []
  }

  executeCmd() {
    //
  }
}

const ins = new Nsp()
ins.init()

export { presets }
