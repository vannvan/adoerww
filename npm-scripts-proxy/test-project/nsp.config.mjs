import { defineNSPConfig, presets } from 'npm-scripts-proxy'
export default defineNSPConfig({
  scripts: [
    {
      cmd: 'start:dev',
      script: 'cross-env REACT_APP_ENV=dev max dev',
      desc: '启动本地开发环境，代理开发环境API',
    },
    {
      cmd: 'start:test',
      script: 'cross-env REACT_APP_ENV=test max test',
      desc: '启动本地开发环境，代理测试环境API',
    },
    {
      cmd: 'start:prod',
      script: 'cross-env UMI_ENV=prod max dev',
      desc: '启动本地开发环境，代理生产环境API',
    },
    {
      cmd: 'build:test',
      script: 'cross-env UMI_ENV=test max build',
      desc: '打包测试环境',
    },
    {
      cmd: 'build:lcic',
      script: 'cross-env UMI_ENV=lcic max build',
      desc: '打包本地化部署环境',
    },
    {
      cmd: 'build:prod',
      script: 'cross-env UMI_ENV=prod max build',
      desc: '打包生产部署环境',
    },
    {
      cmd: 'postinstall',
      script: 'max setup',
      desc: '重置umi数据',
    },
    {
      cmd: 'prettier',
      script: "prettier --write '**/*.{js,jsx,tsx,ts,less,md,json}'",
      desc: '全局代码格式化',
    },
    {
      cmd: 'test',
      script: 'max-test',
      desc: '测试',
    },

    {
      cmd: 'tree',
      script: 'node scripts/tree.js >> tree.txt',
      desc: '生成目录树',
    },
    {
      cmd: 'comp',
      script: 'node scripts/init-form-component.js',
      desc: '生成通用组件',
    },
    {
      cmd: 'docs',
      script: 'npx typedoc --skipErrorChecking',
      desc: '生成utils工具集文档',
    },
  ],
})
