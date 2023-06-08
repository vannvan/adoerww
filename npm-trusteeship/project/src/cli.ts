#!/usr/bin/env node
import { existsSync, fstat, readFileSync } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { Log } from './libs/log.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

console.log('__dirname', __dirname)

const CONFIG_FILE_NAME = 'cmd-scripts.ts'

export interface IDefineNTSConfig {
  scripts: {
    /**
     * 脚本
     */
    cmd: string
    /**
     * 描述
     */
    desc: string
  }[]
}

/**
 * 通过方法的方式配置，能带来更好的 typescript 体验
 * @param  {ConfigType} config
 * @returns IDefineNTSConfig
 */
export const defineNTSConfig = (config: IDefineNTSConfig) => config

//
;(async () => {
  const configFile = path.resolve(CONFIG_FILE_NAME)
  const isExit = existsSync(configFile)
  if (!isExit) {
    Log.error('配置文件不存在')
  }
  // const Conf = await import(configFile)
  let content = readFileSync(configFile)
  console.log(content.toString())
  // TOTO写入一个ts文件配置再重新读取
  //
})()
