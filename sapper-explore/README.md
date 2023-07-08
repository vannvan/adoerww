# sapper-explore

## 使用步骤

```bash
px degit "sveltejs/sapper-template#rollup" my-app

# or: npx degit "sveltejs/sapper-template#webpack" my-app

cd my-app
npm install
npm run dev
```

## 工程结构

```bash
├ package.json
├ src
│ ├ routes
│ │ ├ # 路由文件放这里
│ │ ├ _error.svelte
│ │ └ index.svelte
│ ├ client.js
│ ├ server.js
│ ├ service-worker.js
│ └ template.html
├ static
│ ├ # 静态文件放这里
└ rollup.config.js / webpack.config.js

```

首次运行 Sapper 时，他将生成一个额外的名为 __sapper__ 的目录，用于存放生成的文件。

## 简要了解

1. 入口位置`sapper-explore/src/client.js`.
2. 文件命名规则

- 名为的文件 `src/routes/about.svelte` 对应于 `/about` 路由。名为的文件 `src/routes/blog/[slug].svelte` 对应于 `/blog/:slug` 路由，在这种情况下 `params.slug` ，可用于 `preload`

- 文件 `src/routes/index.svelte` 对应于应用的根目录。`src/routes/about/index.svelte` 的处理方式与`src/routes/about.svelte`相同  。

- 带有前导下划线的文件和目录不会创建路由。这允许你将`helper`模块和组件与依赖于它们的路由放在同一位置-例如，你可以有一个名为的文件 `src/routes/_helpers/datetime.js` ，但它不会创建 `/_helpers/datetime` 路由

## 启动

![](https://p.ipic.vip/y0imyz.png)

![](https://p.ipic.vip/uvnm08.png)

朴实无华！

## 构建部署

> npx sapper export

> npx serve __sapper__/export

![](https://p.ipic.vip/z23yax.png)

## 文档

<https://www.sapperjs.com/docs>
