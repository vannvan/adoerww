# how-to-init-project

## 建议改造步骤

1. 修改bin

在package.json加上你喜欢的/好记的命令，将`flex`换成你自己的

```json
"bin": {
    "flex": "dist/cli.js"
  },
```

2. 完善你自己常用的项目配置，见`how-to-init-project/source/config.ts`

3. 如果你不想发布到`npm`，在`build`完成之后`link`到本地就可以使用了
