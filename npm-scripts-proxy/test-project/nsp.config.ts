import { defineNSPConfig, presets } from 'npm-scripts-proxy'

export default defineNSPConfig({
  scripts: [
    {
      cmd: 'npm run start',
      script: '',
      desc: '启动程序',
    },
  ],
  extends: presets.vite,
})
