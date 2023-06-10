/*
 * Description: 提供一套不同平台适配的预制脚本
 * Created: 2023-06-08 19:44:36
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-06-09 11:45:41
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */

import { TBuildTool, TCmdOpt } from './typing'

export type TPresets = {
  [key in TBuildTool]: TCmdOpt[]
}

const presets: TPresets = {
  vite: [
    {
      cmd: 'start',
      script: 'vite',
      desc: '启动本地服务',
    },
  ],
  webpack: [
    {
      cmd: 'start',
      script: 'webpack-dev-server --mode development',
      desc: '启动本地服务',
    },
  ],
  umi: [
    {
      cmd: 'start',
      script: 'cross-env UMI_ENV=dev umi dev',
      desc: '启动本地服务',
    },
  ],
}

export default presets
