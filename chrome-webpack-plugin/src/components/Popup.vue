<template>
  <div class="emalacca-popup-wrap">
    <button @click="handleLogin()">登录</button>
  </div>
</template>

<script>
import { ERP_SYSTEM } from '@/lib/env.conf'
export default {
  data() {
    return {
      userInfo: null
    }
  },
  mounted() {
    console.log(window.localStorage.getItem('pt-plug-access-user'))
  },
  methods: {
    handleLogin() {
      window.open(ERP_SYSTEM[process.env.NODE_ENV] + '?sync_plugin')
    }
  }
}
</script>

<style lang="less">
.emalacca-popup-wrap {
  width: 360px;
  height: 360px;
  background: #fff;
}
</style>
