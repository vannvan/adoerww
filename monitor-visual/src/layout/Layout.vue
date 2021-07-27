<template>
  <div class="layout">
    <Header>
      <Menu
        mode="horizontal"
        theme="dark"
        active-name="1"
        style="display:flex;width:100%"
      >
        <div class="layout-logo">
          <img src="@/assets/github.png" alt="" />
          <h2>The Monitor</h2>
        </div>
        <div class="layout-nav " style="color:#fff">
          Hello哇 {{ emoji }}~ 现在是: {{ currentTime }}
          <Dropdown trigger="click">
            <span style="user-select: none;cursor: pointer;">
              {{ userInfo.userName }}
            </span>
            <Icon type="ios-arrow-down"></Icon>
            <DropdownMenu slot="list">
              <DropdownItem @click="logout()">退出</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Menu>
    </Header>
    <Layout>
      <Sider
        hide-trigger
        :style="{ background: '#fff' }"
        class="layout-left-menu"
      >
        <Menu active-name="1-0" theme="light" width="auto" :open-names="['1']">
          <MenuItem name="1-0" to="/overview"
            ><Icon type="ios-analytics" />数据总览</MenuItem
          >
          <Submenu name="1">
            <template slot="title">
              <Icon type="md-desktop" />
              埋点数据
            </template>
            <MenuItem name="1-1" to="/synthesis">综合查询</MenuItem>
            <MenuItem name="1-2" to="/module">功能模块</MenuItem>
            <MenuItem name="1-3" to="/page">访问页面</MenuItem>
            <MenuItem name="1-4" to="/behavior-track">用户行为追踪</MenuItem>
            <MenuItem name="1-5" to="/js-error">JS错误</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout :style="{ padding: '10px ' }">
        <Content
          :style="{ padding: '24px', minHeight: '280px', background: '#fff' }"
        >
          <router-view />
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      currentTime: null,
      emoji: null
    }
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      erpMenuList: (state) => state.user.menuList
    })
  },

  mounted() {
    const emoji = ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋']
    this.emoji = emoji[Math.floor(Math.random() * emoji.length)]
    setInterval(() => {
      let timestamp = new Date()
      this.currentTime = timestamp
        .toJSON()
        .replace('T', ' ')
        .substring(0, 19)
    }, 1000)
  },

  methods: {
    logout() {
      this.$store.commit('setUserInfo', null)
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
.layout {
  width: 100vw;
  height: 100vh;
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  .ivu-layout-header {
    padding: 0 30px;
    .layout-logo {
      border-radius: 3px;
      float: left;
      position: relative;
      left: -10px;
      line-height: 30px;
      text-align: center;
      color: #fff;
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      user-select: none;

      img {
        width: 38px;
        height: 38px;
        margin-right: 10px;
        animation: turn 3s linear infinite;
      }

      @keyframes turn {
        0% {
          -webkit-transform: rotate(0deg);
        }

        100% {
          -webkit-transform: rotate(360deg);
        }
      }
    }
    .layout-nav {
      margin: 0 auto;
      margin-right: 0px;
    }
  }
  .layout-left-menu {
    height: calc(100vh - 60px);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .ivu-layout-content {
    overflow-y: auto;
    height: calc(100vh - 90px);
    .page-content {
      height: 100%;
      overflow-y: auto;
    }
  }
}
</style>
