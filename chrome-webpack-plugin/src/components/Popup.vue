<template>
  <div class="emalacca-popup-wrap">
    <div class="emalacca-popup-header">
      <img class="emalacca-pupup-header-logo" src="@/assets/icon/logo-radius.png" alt="" />
      <b class="emalacca-plugin-name">{{ pluginName }}</b>
      <img
        class="emalacca-pupup-header-exit"
        src="@/assets/icon/exit.png"
        @click="handleExit()"
        v-if="userInfo"
      />
    </div>
    <div class="emalacca-popup-content">
      <template v-if="userInfo">
        <div class="user-info-item">
          <span class="user-info-title">账号：</span>
          <span class="user-info-value">{{ userInfo.maAccount }}</span>
        </div>
        <div class="user-info-item">
          <span class="user-info-title">会员ID：</span>
          <span class="user-info-value">{{ userInfo.memberNO }}</span>
        </div>
        <div class="user-info-item border-top">
          <span class="user-info-title">正在采集数量：{{ collecting }}</span>
          <span class="user-info-value link" @click="handleOpenPage('goods/collect', 'erp')"
            >采集箱</span
          >
        </div>
      </template>
      <template v-else>
        <p>插件功能</p>
        <div class="tool-list">
          <div class="tool-item">
            <img src="@/assets/icon/collect.png" alt="" />
            <p>采集</p>
          </div>
          <div class="tool-item">
            <img src="@/assets/icon/follower.png" alt="" />
            <p>粉丝</p>
          </div>
          <div class="tool-item">
            <img src="@/assets/icon/data.png" alt="" />
            <p>数据</p>
          </div>
        </div>
        <p class="bottom-link">
          <span>一分钟注册，永久免费</span>
          <a class="link" href="https://www.emalacca.com/" target="_blank">了解更多功能请查看</a>
        </p>
      </template>
      <span class="emalacca-popup-login-button" @click="handleOpenPage('', 'erp')">{{
        userInfo ? '马六甲ERP' : '注册/登录'
      }}</span>
      <!-- 登录后显示 -->
      <div class="emalacca-popup-site-list-wrap" v-if="userInfo">
        <p>采集站点</p>
        <div class="emalacca-popup-site-list-content">
          <li v-for="item in collectSites" :key="item.link">
            <img
              :src="item.logo"
              :alt="item.name"
              :title="item.name"
              class="emalacca-popup-site-logo"
              @click="handleOpenPage(item.link)"
            />
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ERP_SYSTEM } from '@/lib/env.conf'
import { COLLECT_SITES } from '@/lib/conf'
import { getStorage } from '@/lib/utils'
import { getTabUrl, getAllTabs, gotoErp, setStorageLocal } from '@/lib/chrome'
import { CONFIGINFO } from '../background/config'
import $ from 'jquery'

function sendMessageToContentScript(message, callback) {
  getTabUrl(url => {
    // 找到与当前环境匹配的erp系统是否被打开，如果被打开，通过tabId继续发送退出请求
    getAllTabs(urls => {
      urls.map(el => {
        if (el.url.search(ERP_SYSTEM[process.env.NODE_ENV]) > -1) {
          chrome.tabs.sendMessage(el.id, message, function(response) {
            if (callback) {
              callback(response)
              //关闭标签
              chrome.tabs.remove(el.id, function(e) {
                console.log(e)
              })
            }
          })
        }
      })
    })
  })
}
export default {
  data() {
    return {
      userInfo: null,
      pluginName: APPNAME + ' V' + VERSION,
      collectSites: COLLECT_SITES,
      collecting: 0,
      collectingTime: null
    }
  },
  mounted() {
    this.userInfo = getStorage('pt-plug-access-user')
      ? getStorage('pt-plug-access-user').userInfo
      : null
    if (this.userInfo) {
      this.getCollecting()
    }
    
  },
  methods: {
    handleExit() {
      sendMessageToContentScript({ cmd: 'erp-logout', type: 'ERP_LOGOUT' }, function(response) {
        console.log(response)
      })
      
      // 不管erp系统是否完成退出，插件都要退出
      localStorage.setItem('pt-plug-access-user', null)
      setStorageLocal({'isLogin': false})  // ERP登出或者插件登出，保存false
      setTimeout(() => {
        window.close() //关闭popup
      }, 500)
    },

    // erp 或者外链
    handleOpenPage(link, type = 'site') {
      if (type == 'erp') {
        window.open(ERP_SYSTEM[process.env.NODE_ENV] + link)
      } else {
        window.open(link)
      }
    },

    //获取正在采集数量
    getCollecting() {
      clearInterval(this.collectingTime)
      $.ajax({
        url: CONFIGINFO.url.getCrawlCount(),
        type: 'POST',
        headers: {
          Authorization: 'Bearer ' + getStorage('pt-plug-access-user').token
        },
        dataType: 'json',
        success: (res) => {
          if (res.code == 0) {
            this.collecting = res.data.doingCount
            if (this.collecting > 0) {
              this.collectingTime = 
              this.collectingTime = setInterval(() => {
                this.getCollecting()
              }, 500)
            } else {
              clearInterval(this.collectingTime)
            }
          }
        }
      })
    }
  },
  beforeDestroy() {
    //清除定时器
    clearInterval(this.collectingTime)
  }
}
</script>

<style lang="less">
@import '../assets/styles/var.less';
body {
  padding: 0;
  margin: 0;
}
.emalacca-popup-wrap {
  width: 360px;
  min-height: 200px;
  background: #fff;
  font-family: 'Arial', 'Microsoft YaHei', '黑体', '宋体', sans-serif;
  padding-bottom: 16px;
  .emalacca-popup-header {
    // background: @primaryColor;
    padding: 12px 20px;
    box-sizing: border-box;
    color: #303031;
    font-size: 14px;
    user-select: none;
    border-bottom: 1px #e7e7e7 solid;

    .emalacca-pupup-header-logo {
      height: 16px;
      width: 16px;
      vertical-align: middle;
      margin-right: 5px;
    }

    .emalacca-pupup-header-exit {
      float: right;
      height: 16px;
      width: 16px;
      cursor: pointer;
      vertical-align: middle;
    }

    .emalacca-plugin-name {
      vertical-align: middle;
    }
  }
  .emalacca-popup-content {
    padding: 12px 20px 0;
    .user-info-item {
      display: flex;
      justify-content: space-between;
      line-height: 30px;
      &.border-top {
        border-top: 1px #e7e7e7 solid;
        font-weight: 600;
        padding: 14px 20px;
        width: calc(100% + 40px);
        margin-left: -20px;
        box-sizing: border-box;
        margin-top: 10px;
      }
      .user-info-title {
        color: #303031;
        font-size: 14px;
        font-weight: 400;
      }
      .user-info-value {
        &.link {
          color: @popupPrimaryColor;
          cursor: pointer;
        }
      }
    }
    .tool-list {
      display: flex;
      justify-content: space-between;
      .tool-item {
        width: 80px;
        text-align: center;
        img {
          width: 80px;
          height: 80px;
        }
      }
    }
    .bottom-link {
      display: flex;
      justify-content: space-between;
      margin: 8px auto;
      .link {
        color: @popupPrimaryColor;
      }
    }
    .emalacca-popup-login-button {
      display: inline-block;
      cursor: pointer;
      width: 320px;
      height: 40px;
      background: @popupPrimaryColor;
      margin: 0 auto;
      font-size: 14px;
      text-align: center;
      line-height: 40px;
      color: #fff;
      border-radius: 4px;
    }
  }
  .emalacca-popup-site-list-wrap {
    padding-top: 12px;
    margin: auto;
    .emalacca-popup-site-list-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        width: 30px;
        height: 40px;
        line-height: 30px;
        list-style: none;
        .emalacca-popup-site-logo {
          width: 26px;
          height: 26px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
