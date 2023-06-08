/*
 * Description:
 * Created: 2023-06-08 19:49:27
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-06-08 19:52:00
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */

type TCmdOpts = {
  /**
   * 命令
   */
  cmd: string
  /**
   * 描述
   */
  desc: string
}[]

interface INts {
  init: () => void
  parseUserConfig: () => TCmdOpts
  executeCmd: () => void
}
