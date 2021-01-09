<template>
  <div class="no-login-warning">
    <p><b>粉丝关注使用步骤：</b></p>
    <p>1.进入站点指定卖家中心完成登录,"温馨提示"点击取消</p>
    <p>2.进入站点前台确认右上角账号信息已同步</p>
    <p>
      3.在前台底部推荐商品列表点击"获取粉丝"按钮，打开粉丝列表页面进行操作
    </p>
    <li v-for="(item, index) in shoppeSites" :key="index + 'a'">
      <a :href="item.seller" target="black">{{ item.name }}卖家中心</a>
      <a :href="item.front" target="black">{{ item.name }}前台</a>
    </li>
    <p><b>取关粉丝使用步骤：</b></p>
    <p>1.确认"粉丝关注"步骤1,2已完成</p>
    <p>点击"自动取关"后进入已关注页面列表进行操作</p>
    <li v-for="(item, index) in shoppeSites" :key="index + 'b'">
      <a :href="item.mall" target="black">{{ item.name }}取关页面</a>
    </li>
  </div>
</template>

<script>
import { websites } from './conf'
export default {
  data() {
    return {
      shoppeSites: websites,
    }
  },
}
</script>

<style lang="less">
.no-login-warning {
  width: 100%;
  li {
    list-style: none;
    padding-left: 20px;
    a {
      width: 40%;
      line-height: 25px;
      color: #ee4d2d;
      margin-right: 50px;
    }
  }
}
</style>
