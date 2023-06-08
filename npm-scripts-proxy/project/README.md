# npm-scripts-proxy

## 项目配置

### 有效名称

`nsp.config.js`、`nsp.config.ts`

### 配置方式

#### 支持TS的项目

建议采用方式:

```ts
// nsp-config.ts
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

```

#### 不支持TS的项目

```js


```
