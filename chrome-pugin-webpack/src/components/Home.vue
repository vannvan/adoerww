<template>
  <div class="seller-erp-fixed-right" id="emalaccaRightApp">
    <div class="emalacca-plugin-action-wrap" draggable="false">
      <span class="icon iconfont icon-shopee icon-toggle" @click="handleOpenDrawer()"></span>
      <ul class="follow-quick-action-wrap">
        <li @click="openPage(storeFront('front'))" v-if="storeFront('front')">
          店铺前台
        </li>
        <li @click="openPage(storeFront('seller'))" v-if="storeFront('seller')">
          店铺后台
        </li>
        <!-- <li>店铺清粉</li> -->
      </ul>
    </div>
    <drawer
      :title="'马六甲粉丝关注插件' + pluginVersion"
      :display.sync="display"
      :inner="true"
      :width="drawerWidth"
      :mask="false"
    >
      <FollowDrawer :display.sync="display"></FollowDrawer>
    </drawer>
  </div>
</template>

<script>
import $ from 'jquery'
import { WEBSITES } from '../lib/conf'
const packJSON = require('../../package.json')
import FollowDrawer from './FollowDrawer'
import Drawer from './Drawer'
export default {
  components: {
    Drawer,
    FollowDrawer
  },

  data() {
    return {
      pluginVersion: packJSON.version,
      display: false,
      drawerWidth: '400px'
    }
  },
  computed: {
    //店铺前台
    storeFront() {
      return type => {
        let host = window.location.host.split('.')
        let country = host[host.length - 1]
        let countryWebSite = WEBSITES.find(el => el.key == country) //获取到对应的取关地址
        return countryWebSite ? countryWebSite[type] : undefined
      }
    }
  },

  directives: {},

  mounted() {
    //
  },
  methods: {
    handleOpenDrawer() {
      if ($('.emalacca-plugin-action-wrap').css('cursor') == 'default') {
        this.display = true
      }
    },
    openPage(path) {
      if (/http/.test(path)) {
        window.open(path)
      }
    }
  }
}
</script>

<style lang="less">
input[type='number'] {
  -moz-appearance: textfield !important;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none !important;
  margin: 0 !important;
}
input {
  background-color: transparent;
}
input,
textarea {
  outline: none;
}

#emalaccaRightApp {
  position: fixed !important;
  top: 40%;
  right: 20px;
  z-index: 9999999999;
  font-size: 14px !important;
  cursor: default;
  .emalacca-plugin-action-wrap {
    width: 60px;
    position: fixed;
    top: 40%;
    right: 20px;
    cursor: default;
    .icon-toggle {
      width: 40px;
      height: 40px;
      cursor: pointer;
      z-index: 8;
      font-size: 48px;
      color: #ee4d2d;
      position: inherit;
      margin-top: -50px;
    }
    .follow-quick-action-wrap {
      position: inherit;
      padding: 0 4px !important;
      li {
        list-style: none;
        height: 40px !important;
        width: 40px !important;
        box-sizing: border-box;
        background: #ee4d2d;
        border-bottom: 1px solid #fff;
        padding: 5px;
        display: flex !important;
        align-items: center !important;
        text-align: center !important;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
      }
    }
  }
}
</style>
