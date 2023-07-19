# pnpm-menorepo-explore

## 可参考的

- <https://pnpm.io/zh/installation> 文档
- <https://github.com/baosisi07/pnpm-workspace-demo>
- [rush + pnpm + ts + monorepo 脚手架开发](https://juejin.cn/post/7034111809728544799)

## 本地开发

- pnpm install 会给工作区安装,也会给`packages`内的模块安装

- 启动所有

> npm run watch

- 链接到全局

进入`cli`包

> npm link

然后就可以在全局使用`uflex`命令了

## 发布

### 参数

- --no-git-checks 不检查当前的分支是否为发布分支、分支是否干净和、是否和与远程同步。

- --report-summary 将生成发布报告文件

- --dry-run 执行流程，但不真正发布

- -r 从工作区发布包，也就是发布`packages`各模块的包，不要漏掉

### 使用

1. 执行所有发布流程，但不真正的发布到镜像源

> pnpm publish --dry-run --report-summary

2. 发布到镜像源

> pnpm publish --report-summary

<https://pnpm.io/zh/cli/publish>

## 应用示例

- [use-flex-cli-example](/use-flex-cli-example)
