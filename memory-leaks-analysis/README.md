# memory-leaks-analysis

## 描述

一个简单的内存泄漏分析案例
  
![](https://p.ipic.vip/k636h5.png)

点击左上角开始录制之后，刷新页面，会生成如下快照
![](https://p.ipic.vip/9ynzsb.png)

其中蓝色部分表示没有被回收的内存，灰色部分表示被回收的内存
![](https://p.ipic.vip/ed2nuc.png)

> 观察Studen和Person的 `浅层大小`和`保留的大小`，因为Student引用了Person，那么有 280 - 160 = 120

我们通过以下方式定位到这个有毒的方法位置

![](https://p.ipic.vip/b30j75.gif)
