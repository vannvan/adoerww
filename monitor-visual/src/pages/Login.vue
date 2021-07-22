<template>
  <div class="login-wrap">
    <div class="form-wrap">
      <p class="title">登录</p>
      <div class="form-item">
        <input
          type="text"
          placeholder="用户名"
          v-model="form.name"
          @keyup.enter="handleLogin()"
        />
      </div>
      <div class="form-item">
        <input
          type="password"
          placeholder="密码"
          v-model="form.password"
          @keyup.enter="handleLogin()"
        />
      </div>
      <div class="form-item" @click="handleLogin()">
        <button>登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import Monitor from '@/api/monitor.js'
import { createTree } from '@/utils'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      form: {
        name: 'bob',
        password: '123456'
      }
    }
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      erpMenuList: (state) => state.user.menuList
    })
  },

  mounted() {
    //
  },

  methods: {
    handleLogin() {
      let params = this.form
      Monitor.handleLogin(params).then((res) => {
        if (res.status) {
          this.$Message.info('登录成功')
          let { userInfo, menuList } = res.data
          this.$store.commit('setUserInfo', userInfo)
          let tree = createTree(menuList)
          this.$store.commit('setMenuList', tree)
          this.$router.push('/home')
        } else {
          this.$Message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-wrap {
  width: 100vw;
  height: 100vh;
  background: #232323;
  .form-wrap {
    width: 520px;
    height: 400px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    margin-left: -260px;
    left: 50%;
    margin-top: -200px;
    top: 50%;
    border-radius: 8px;
    padding: 20px;
    box-sizing: border-box;
    .title {
      font-weight: bold;
      text-align: center;
      font-size: 28px;
      margin: 20px;
    }
    .form-item {
      height: 50px;
      width: 80%;
      margin: 12px auto;

      input,
      button {
        height: 100%;
        width: 100%;
        outline: none;
        border: none;
        border-bottom: 1px solid #999;
        font-size: 20px;
      }
      input {
        padding: 12px;
        background: none;
        input:-ms-input-placeholder {
          font-size: 12px;
        }
      }
      button {
        width: 100;
        margin-top: 20px;
        border: none;
        cursor: pointer;
        background: rgba(#232323, 0.8);
        color: #ededed;
      }
    }
  }
}
</style>
