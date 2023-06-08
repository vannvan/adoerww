/*
 * Description: 提供一套不同平台适配的预制脚本
 * Created: 2023-06-08 19:44:36
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-06-08 23:06:51
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */

import { TBuildTool, TCmdOpts } from './typing'

const presets: {
  [key in TBuildTool]: TCmdOpts
} = {
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
}

export default presets
