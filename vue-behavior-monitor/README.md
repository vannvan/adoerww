# Vue.js项目用户行为埋点方案插件

## Use

```js
// 在router管理模块进行使用

import Monitor from 'vue-behavior-monitor'

const monitor = new Monitor()
monitor.init({
	router
})
```

## Functions

**初始化**

初始化时需要携带`vue-router`对象,`vpt`表示阈值，默认阈值为`10`,数据队列到达阈值后会自动清除，所以要设定合适的阈值并在相应的时机进行数据上传，避免数据丢失，`extentData`可选，用于将与业务相关的数据合并至最终的数据模型

```js
monitor.init({
  router,
  config: {
    vpt: 20
  },
  extentData: {
    userInfo: {
      userName: 'zhangsan',
      mobile:'13666666666'
    }
  }
})
```

**阈值拦截，数据提交**

数据获取有两种方式可以使用:

方法1,使用钩子函数,此方法获取到的数据不包含当前所在页面

```js
monitor.init({
  router,
  config: {
    vpt: 20
  },
  extentData: {
    userInfo: {
      userName: 'zhangsan',
      mobile:'13666666666'
    }
  }
  // 使用此钩子函数
  vptHanlder: (val) => {
    // val = monitor.get()
  }
})
```

方法2,在外部路由拦截中手动获取，此方法获取到的数据可包含当前所在页面

```js
router.afterEach((to, from, next) => {
  console.log((monitor.get()))
})
```

以上两种方法返回值或手动获取到的值均为如下形式

```js
{
  value:[{...}] // 数据队列
  length:2 // 队列数据长度
}
```

**扩展方法**

清除数据队列

> monitor.clear()

销毁监听事件

> monitor.destroy()


## changelogs
[changelog]()

