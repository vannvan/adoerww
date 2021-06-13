<template>
  <div class="emalacca-popup-wrap">
    <div class="emalacca-popup-header">
      <img class="emalacca-pupup-header-logo" src="@/assets/icon/logo-radius.png" alt="" />
      <b class="emalacca-plugin-name">
        {{ pluginName }}
        <!-- <template v-if="isVersionNewest">
          {{ nowVersion }}
        </template>
        <a
          class="update-version"
          :href="newVersionData.plugDownloadUrl"
          v-if="!isVersionNewest"
          target="_blank"
          :title="'下载' + newVersionData.plugName + newVersionData.versionDisplayName"
        >
          {{ nowVersion }}
          <i class="update-red"></i>
        </a> -->
      </b>

      <img
        class="emalacca-pupup-header-exit"
        src="@/assets/icon/exit.png"
        @click="handleExit()"
        v-if="userInfo"
      />
      <div :class="!isHideMessage ? 'malacca-pupup-hint-box' : 'malacca-pupup-header-switches-box'">
        <switches
          class="malacca-pupup-header-switches"
          v-model="isStartPlug"
          text-enabled="启用"
          text-disabled="停用"
          @input="switchesChange"
        ></switches>
        <div class="malacca-pupup-mask-layer"></div>
        <div class="malacca-pupup-message-box">
          <div class="malacca-pupup-message-content">插件已停用，点击启用插件</div>
          <div class="malacca-pupup-message-bottom" @click="isHideMessage = true">我知道了</div>
        </div>
      </div>
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
import { getStorage, isNil } from '@/lib/utils'
import { setStorageSync, getStorageSync, sendMessageToContentScript } from '@/lib/chrome'
import { CONFIGINFO } from '../background/config'
import Switches from './Switches'
import $ from 'jquery'

export default {
  components: {
    Switches
  },
  data() {
    return {
      userInfo: null,
      pluginName: APPNAME,
      nowVersion: 'V' + VERSION,
      collectSites: COLLECT_SITES,
      collecting: 0,
      collectingTime: null,
      isStartPlug: true, // 是否启用插件
      isHideMessage: true, // 是否隐藏提示窗
      isVersionNewest: true, // 版本是否最新的
      newVersionData: {} // 最新版本的信息
    }
  },
  mounted() {
    this.userInfo = getStorage('pt-plug-access-user')
      ? getStorage('pt-plug-access-user').userInfo
      : null
    if (this.userInfo) {
      this.getCollecting()
    }
    // 获取需更新版本信息
    // this.getQueryUpdatePlug()

    // 从缓存中获取是否禁用插件
    getStorageSync('isDisabledPlug').then(data => {
      this.isStartPlug = !isNil(data['isDisabledPlug']) ? !data['isDisabledPlug'] : true
      chrome.browserAction.setBadgeText({ text: this.isStartPlug ? '' : 'off' })
      chrome.browserAction.setBadgeBackgroundColor({ color: this.isStartPlug ? '#fff' : 'red' })
      // 停用插件时，显示提示窗
      if (!this.isStartPlug) {
        this.isHideMessage = false
      }
    })
  },
  methods: {
    handleExit() {
      sendMessageToContentScript({ type: 'ERP_LOGOUT' }, function(response) {
        console.log(response, 'ERP_LOGOUT')
      })

      // 不管erp系统是否完成退出，插件都要退出
      localStorage.setItem('pt-plug-access-user', null)
      // setStorageLocal({'isLogin': false})  // ERP登出或者插件登出，保存false
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
        success: res => {
          if (res.code == 0) {
            this.collecting = res.data.doingCount
            if (this.collecting > 0) {
              this.collectingTime = setInterval(() => {
                this.getCollecting()
              }, 500)
            } else {
              clearInterval(this.collectingTime)
            }
          }
        }
      })
    },
    // 开关
    switchesChange(value) {
      this.isStartPlug = value
      this.isHideMessage = true
      chrome.browserAction.setBadgeText({ text: value ? '' : 'off' })
      chrome.browserAction.setBadgeBackgroundColor({ color: value ? '#fff' : 'red' })
      setStorageSync({ isDisabledPlug: !value }).then(() => {
        // 刷新当前页面
        chrome.tabs.reload()
      })
    },

    // 获取需更新版本信息
    getQueryUpdatePlug() {
      $.ajax({
        url: CONFIGINFO.url.getQueryUpdatePlug(),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        success: res => {
          if (res.code == 0) {
            let { versionDisplayName } = res.data
            if (versionDisplayName.search(VERSION) < 0) {
              this.isVersionNewest = false
              this.newVersionData = res.data
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
      margin-left: 5px;
      margin-top: 4px;
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
  .malacca-pupup-header-switches-box {
    float: right;
    margin-right: 10px;
    .malacca-pupup-mask-layer {
      display: none;
    }
    .malacca-pupup-message-box {
      display: none;
    }
  }

  .malacca-pupup-hint-box {
    position: relative;
    float: right;
    display: block;
    margin-right: 0;
    .malacca-pupup-header-switches {
      position: absolute;
      left: -88px;
      top: -8px;
      width: 88px;
      height: 40px;
      z-index: 7;
      border-radius: 5px;
      padding: 8px 10px;
      background: #fff;
    }
    .malacca-pupup-mask-layer {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 5;
      background: rgb(100, 96, 96);
      opacity: 0.4;
      display: block;
    }
    .malacca-pupup-message-box {
      position: absolute;
      right: 0;
      top: 48px;
      min-width: 120px;
      min-height: 60px;
      z-index: 7;
      display: block;
      border-radius: 5px;
      background: #fff;
      .malacca-pupup-message-content {
        text-align: center;
        padding: 10px 24px;
        white-space: nowrap;
        box-sizing: border-box;
      }
      .malacca-pupup-message-bottom {
        color: #ff720d;
        text-align: center;
        border-top: 1px solid #ccc;
        cursor: pointer;
        padding: 7px 0;
      }
    }
  }
  .update-version {
    position: relative;
    .update-red {
      position: absolute;
      right: -7px;
      top: -3px;
      width: 6px;
      height: 6px;
      background: red;
      border-radius: 50%;
    }
  }
}
</style>
