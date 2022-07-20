### 安装

> npm i vue-skeleton-webpack-plugin

### 使用

在webpack.dev.conf.js和webpack.prod.conf.js中加入

```js
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

plugins: [
    new SkeletonWebpackPlugin({
        webpackConfig: {
            entry: {
                app: resolve('./src/entry-skeleton.js')   //骨架屏入口
            }
        }
    })
]
```

### 在src文件夹下新建ekeleton.vue组件

```vue
<template>
    <div class="skeleton-wrapper">
        <section class="skeleton-block">
            骨架内容
        </section>
    </div>
</template>

<script>
    export default {
        name: 'skeleton'
    };
</script>

<style scoped>
</style>
```

### src文件下新建entry-skeleton.js入口

```json
import Vue from 'vue'
// 创建的骨架屏 Vue 实例
import skeleton from './skeleton';
export default new Vue({
    components: {
        skeleton
    },
    template: '<skeleton />'
});
```

### 方案填坑

由于以上方案生成骨架屏vue中的css并不能生效，所以还需要进行如下配置

1.vue-loader.conf.js

```js
loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: true  // 原为isProduction
 }),
```

2、webpack.dev.conf.js中添加

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin')
  new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: true,
  }),
```

此方案属于简版骨架屏方案，可解决首屏加载白屏时间过长的情况