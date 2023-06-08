/*
 * Description:
 * Created: 2023-06-08 23:03:33
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-06-08 23:07:04
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */
/*
 * Description:
 * Created: 2023-06-08 19:49:27
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-06-08 22:32:05
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */

/**
 * 框架平台
 */
export type TPlatform = 'vue' | 'react'

/**
 * 构建工具
 */
export type TBuildTool = 'vite' | 'webpack'

export type TCmdOpts = {
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
}[]

export type TDefineOpts = {
  /**
   * 脚本配置
   */
  scripts: TCmdOpts
  /**
   * 框架平台
   */
  platform?: TPlatform
  /**
   * 构建工具
   */
  buildTool?: TBuildTool
  extends?: TCmdOpts
}

export interface INsp {
  init: () => void
  parseUserConfig: () => Promise<TCmdOpts>
  executeCmd: () => void
}
