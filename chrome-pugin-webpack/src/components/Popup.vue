<template>
  <div class="no-login-warning">
    <p><b>粉丝关注使用步骤：</b></p>
    <p>
      第一步:打开对应站点的卖家中心，弹出shopee“温馨提示”弹框时，点击“取消”再进行登录操作，如点击“确认”会跳转到中国后台链接，则无法使用。此步操作特别关键！
    </p>
    <p>
      第二步:完成第一步登录成功后，进入对应站点的前台页面，检查右上方账号是否已同步成功，同步成功即可开始使用插件，如显示未登陆状态，请重新操作第一步。
    </p>
    <p>
      第三步:开始使用粉丝关注，鼠标悬浮在商品图片上显示“获取粉丝”点击进入该商品的卖家粉丝列表，根据需求可输入前置条件进行关注。
    </p>
    <li v-for="(item, index) in shoppeSites" :key="index + 'a'">
      <a :href="item.seller" target="black">{{ item.name }}卖家中心</a>
      <a :href="item.front" target="black">{{ item.name }}前台</a>
    </li>
    <p><b>取关粉丝使用步骤：</b></p>
    <p>第一步:确认"粉丝关注"步骤1,2已完成</p>
    <p>第二步:点击"自动取关"后进入已关注页面列表进行操作</p>
    <p>
      <span style="color:#f00">注:</span
      >如遇到首次进入页面操作就提示异常且失败的情况,请在页面上手动取关一项后刷新页面即可正常使用
    </p>
    <li v-for="(item, index) in shoppeSites" :key="index + 'b'">
      <a :href="item.mall" target="black">{{ item.name }}取关页面</a>
    </li>
  </div>
</template>

<script>
import { WEBSITES } from '../lib/conf'

export default {
  data() {
    return {
      shoppeSites: WEBSITES,
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
