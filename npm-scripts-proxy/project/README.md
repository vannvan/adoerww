# npm-scripts-proxy

## 项目配置

### 有效名称

`nsp.config.mjs`

### 配置方式

```ts
// nsp-config.mjs
import { defineNSPConfig, presets } from 'npm-scripts-proxy'

export default defineNSPConfig({
  scripts: [
    {
      cmd: 'npm run start',
      desc: '启动程序',
    },
  ],
  extends: presets,
})
