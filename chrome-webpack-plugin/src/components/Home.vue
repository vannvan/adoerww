<template>
  <div class="seller-erp-fixed-right" id="emalaccaRightApp">
    <div class="emalacca-plugin-action-wrap" draggable="false">
      <div class="emalacca-plugin-action-toggle">
        <span class="icon iconfont icon-erp-logo" @click="handleOpenDrawer()"></span>
      </div>

      <ul class="follow-quick-action-wrap" id="emalaccaRightMenu">
        <li
          v-for="item in rightMenu"
          :key="item.id"
          class="emalacca-plugin-quick-action-item"
          :class="item.fixed ? 'fixed' : ''"
          :id="item.id"
          :style="{ 'pointer-events': isExpand && !item.fixed ? 'auto' : 'none' }"
        >
          <span class="icon iconfont" :class="item.icon"></span>
          <p class="emalacca-plugin-quick-action-title">{{ item.name }}</p>
          <div class="emalacca-plugin-quick-action-content">
            <span
              class="icon iconfont icon-nail"
              @click="changeSkin(item)"
              :style="{ color: item.fixed ? '#ff720d' : '#fff' }"
            ></span>
            <span
              class="emalacca-plugin-quick-action-sub-button"
              v-for="subItem in item.children"
              :key="subItem.action"
            >
              {{ subItem.name }}
            </span>
          </div>
        </li>
        <li
          class="emalacca-plugin-quick-action-item dark help"
          :style="{ 'pointer-events': isExpand ? 'auto' : 'none' }"
        >
          <span class="icon iconfont icon-question"></span>
          <p class="emalacca-plugin-quick-action-title">帮助</p>
        </li>
      </ul>

      <div class="emalacca-plugin-fold-dark toggle-menu-action">
        <span class="icon iconfont" :class="isExpand ? 'icon-pick-up' : 'icon-pick-down'"></span>
        <p class="emalacca-plugin-quick-action-title">{{ isExpand ? '收起' : '展开' }}</p>
      </div>
    </div>
    <drawer
      :title="'马六甲卖家助手' + pluginVersion"
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

// 监听页面链接更新，加载不同的侧栏工具
var oldHref = document.location.href

window.onload = function() {
  console.warn('first load', oldHref)
  var bodyList = document.querySelector('body'),
    observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (oldHref != document.location.href) {
          oldHref = document.location.href
          console.warn('update', document.location.href)
          getPageType()
          /* Changed ! your code here */
        }
      })
    })
  var config = {
    childList: true,
    subtree: true
  }
  observer.observe(bodyList, config)
}

// 根据页面dom节点特征区分当前页面类型，决定要加载什么操作

function getPageType() {
  let shopEl = document.querySelector('.shop-page__info')
  if (shopEl) {
    console.log('店铺页')
  }
}

const RIGHT_MENU = [
  {
    name: '粉丝',
    icon: 'icon-fans',
    id: 'EmalaccaFollower',
    fixed: true,
    children: [
      {
        name: '关注店铺粉丝',
        action: 'follow-other'
      },
      {
        name: '批量取关',
        action: 'unfollow'
      }
    ]
  },
  {
    name: '采集',
    icon: 'icon-collect',
    id: 'EmalaccaCollect',
    fixed: true,
    children: [
      {
        name: '全选',
        action: 'select-all'
      },
      {
        name: '采集选中',
        action: 'collect-selected'
      },
      {
        name: '采集本页',
        action: 'collect-this-page'
      }
    ]
  },
  {
    name: '快捷',
    icon: 'icon-menu',
    id: 'EmalaccaQuick',
    fixed: true,
    children: [
      {
        name: '卖家中心',
        action: 'seller'
      },
      {
        name: '店铺前台',
        action: 'front'
      }
    ]
  }
]

export default {
  components: {
    Drawer,
    FollowDrawer
  },

  data() {
    return {
      pluginVersion: packJSON.version,
      display: false,
      drawerWidth: '400px',
      rightMenu: RIGHT_MENU,
      isExpand: true
    }
  },

  computed: {
    //店铺前台
    storeFront() {
      return type => {
        let webHost = window.location.host
        const countryList = WEBSITES.map(el => el.key)
        try {
          let currentCountryCode = countryList.find(item =>
            window.location.host.match(new RegExp(item))
          ) //当前站点标识
          let countrySite = WEBSITES.find(item => item.key == currentCountryCode)
          // 如果满足，一定是跨境店
          if (/xiapibuy.com/.test(webHost) || /shopee.cn/.test(webHost)) {
            type = 'cn' + type
          }
          return countrySite[type]
        } catch (error) {
          console.log(error)
        }
      }
    }
  },

  mounted() {
    this.initToggleAction()
  },
  methods: {
    initToggleAction() {
      let dnum = 0
      let _this = this
      $('.toggle-menu-action').click(function() {
        let fixedLen = $('.emalacca-plugin-quick-action-item.fixed').length
        dnum = dnum + 1
        if (dnum % 2 != 0) {
          $('.emalacca-plugin-quick-action-item').each(function() {
            _this.isExpand = false
            if (!$(this).hasClass('fixed')) {
              $(this).animate(
                {
                  height: 0,
                  opacity: 0,
                  margin: 0,
                  padding: 0
                },
                500
              )
            }
          })
          let targetTop = 48 * fixedLen + 8 + 'px'
          $(this).animate(
            {
              'margin-top': targetTop
            },
            500
          )
        } else {
          _this.isExpand = true
          $('.emalacca-plugin-quick-action-item').each(function() {
            $(this).animate({
              height: '40px',
              opacity: 1,
              'margin-top': '8px',
              padding: '4px'
            })
          }, 500)
          let targetTop = $('.emalacca-plugin-quick-action-item').length * 48 + 8 + 'px'
          $(this).animate(
            {
              'margin-top': targetTop
            },
            500
          )
        }
      })
    },

    changeSkin(item) {
      item.fixed = !item.fixed
      if (!item.fixed) {
        this.isExpand = false
        let fixedLen = $('.emalacca-plugin-quick-action-item.fixed').length - 1
        this.$nextTick(() => {
          $('.emalacca-plugin-quick-action-item').each(function() {
            if (!$(this).hasClass('fixed')) {
              $(this).animate(
                {
                  height: 0,
                  opacity: 0,
                  margin: 0,
                  padding: 0
                },
                500
              )
            }
          })
          let targetTop = 48 * fixedLen + 8 + 'px'
          $('.toggle-menu-action').animate(
            {
              'margin-top': targetTop
            },
            500
          )
        })
      }
    },

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
