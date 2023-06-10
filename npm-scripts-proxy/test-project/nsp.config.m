import { defineNSPConfig, presets } from 'npm-scripts-proxy'

export default defineNSPConfig({
  scripts: [
    {
      cmd: 'test',
      script: 'echo "Error: no test specified"',
      desc: '测试程序',
    },
    {
      cmd: 'build:test',
      script: 'node build.js',
      desc: '打包测试环境',
    }
  ],
  extends: presets.vite,
})
