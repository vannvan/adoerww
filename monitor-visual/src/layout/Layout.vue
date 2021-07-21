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
          <h2>埋点监控系统</h2>
        </div>
        <div class="layout-nav " style="color:#fff">
          Hello {{ emoji }}~ {{ userInfo.userName }} 现在是: {{ currentTime }}
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
            <MenuItem name="1-2" to="/page">页面维度</MenuItem>
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
}

.layout-logo {
  border-radius: 3px;
  float: left;
  position: relative;
  left: -30px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;

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

.layout-left-menu {
  height: calc(100vh - 60px);
  overflow-x: hidden;
  overflow-y: auto;
}
.ivu-layout-content {
  overflow-y: auto;
  height: calc(100vh - 90px);
}
.page-content {
  height: 100%;
  overflow-y: auto;
}
</style>
