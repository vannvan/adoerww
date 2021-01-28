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

<style lang="less"></style>
