/**
 * 框架平台
 */
export type TPlatform = 'vue' | 'react'

/**
 * 构建工具
 */
export type TBuildTool = 'vite' | 'webpack' | 'umi'

export type TCmdOpt = {
  /**
   * 指令
   */
  cmd: string
  /**
   * 要执行的脚本
   */
  script: string

  /**
   * 描述
   */
  desc: string
}

export type TDefineOpts = {
  /**
   * 脚本配置
   */
  scripts: TCmdOpt[]
  /**
   * 构建工具
   */
  buildTool?: TBuildTool
  /**
   * 扩展
   */
  extends?: TCmdOpt[]
}

export interface INsp {
  init: () => void
  merge: (config: TDefineOpts) => Promise<TCmdOpt[]>
  parseUserConfig: () => Promise<TDefineOpts | undefined>
  executeScript: (script: string) => void
}
