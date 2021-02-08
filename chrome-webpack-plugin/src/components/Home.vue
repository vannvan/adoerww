<template>
  <div class="seller-erp-fixed-right" id="emalaccaRightApp">
    <div class="emalacca-plugin-action-wrap" draggable="false">
      <!-- 可以拖动的节点 -->
      <div class="emalacca-plugin-action-toggle">
        <span class="icon iconfont icon-erp-logo"></span>
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
              v-for="subItem in filterMatchAction(item.children)"
              :key="subItem.action"
              @click="quickActionHandler(item.id, subItem.action)"
              :data-action-type="subItem.action"
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

      <div
        class="emalacca-plugin-fold-dark toggle-menu-action"
        :style="{ marginTop: initHoldUpMarginTop }"
      >
        <span class="icon iconfont" :class="isExpand ? 'icon-pick-up' : 'icon-pick-down'"></span>
        <p class="emalacca-plugin-quick-action-title">{{ isExpand ? '收起' : '展开' }}</p>
      </div>
    </div>
    <drawer
      :title="drawerTitle"
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
import { COMMON_COLLECT, RIGHT_MENU, getSiteLink, MESSAGE } from '@/lib/conf'
import { getRule } from '@/lib/rules'
import BatchCollect from '@/inject/batch-collect'
import FollowDrawer from './FollowDrawer'
import Drawer from './Drawer'
import Follow from '@/inject/shopee'

export default {
  components: {
    Drawer,
    FollowDrawer
  },

  data() {
    return {
      drawerTitle: APPNAME + ' V' + VERSION,
      display: false,
      drawerWidth: '400px',
      rightMenu: [],
      isExpand: true,
      isStorePage: false, //是否在店铺页面
      initHoldUpMarginTop: 0, //收起按钮初始marginTop
      isCheckAll: false //采集全选
    }
  },

  computed: {
    filterMatchAction() {
      return actions => {
        if (!this.isStorePage) {
          return actions.map(el => el.action).includes('follow-other')
            ? actions.filter(item => item.action != 'follow-other')
            : actions
        } else {
          return actions
        }
      }
    }
  },

  /**
   * 1. 如果是虾皮网站，对于当前页面链接首次加载如果匹配到 -i.表示在某一店铺，则需要用isStorePage标记用以开启“关注店铺粉丝”操作
   *    同时，需要检测是否是列表页或搜索页，如果匹配则显示批量采集操作
   * 2. 如果不是虾皮网站，则只需对是否显示批量采集操作进行判断，如果匹配则显示
   *
   * 3. observer 的作用是监听页面切换，主要用于虾皮网站，因为虾皮网站页面切换并不会重新初始化主程序
   */
  mounted() {
    this.loadMenuAction()

    // 监听页面链接更新，加载不同的侧栏工具
    let oldHref = location.href
    let _this = this
    let bodyList = document.querySelector('body'),
      observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (oldHref != location.href) {
            oldHref = location.href
            let linkRule = getRule(location.href)
            let siteConfig = JSON.parse(linkRule)
            _this.isStorePage = new Function('url', siteConfig.detail)(location.href) //如果是某店铺的页面
            _this.loadMenuAction()
          }
        })
      })
    let config = {
      childList: true,
      subtree: true
    }
    observer.observe(bodyList, config)
    this.initToggleAction()
  },
  methods: {
    initToggleAction() {
      let _this = this
      $('.toggle-menu-action').click(function() {
        _this.isExpand = !_this.isExpand
        let fixedLen = $('.emalacca-plugin-quick-action-item.fixed').length //此时的length和下面的不一样
        if (!_this.isExpand) {
          _this.handleHoldUp($('.emalacca-plugin-quick-action-item'), fixedLen)
        } else {
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

    //收起
    handleHoldUp(ele, fixedLen) {
      this.$nextTick(() => {
        ele.each(function() {
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
    },

    //只有取消固定才会触发
    changeSkin(item) {
      item.fixed = !item.fixed
      if (!item.fixed) {
        this.isExpand = false
        let fixedLen = $('.emalacca-plugin-quick-action-item.fixed').length - 1
        this.handleHoldUp($('.emalacca-plugin-quick-action-item'), fixedLen)
      }
    },

    //快捷操作功能分发
    // mainActionId 主体方法id action  操作类型
    quickActionHandler(mainActionId, action) {
      switch (mainActionId) {
        //   快捷操作
        case 'EmalaccaQuick':
          this.openPage(getSiteLink(action))
          break
        //   粉丝操作
        case 'EmalaccaFollower':
          Follow.syncShoppeBaseInfo().then(res => {
            if (res && res.code == -1) {
              $.fn.message({ type: 'warning', msg: MESSAGE.error.pleaseCheckWhetherHaveAuthoriz })
            } else {
              let currentPageLink = location.href
              let selfStoreId = res.result.storeId //用户自己的店铺ID
              //   取关
              if (selfStoreId && action == 'unfollow') {
                window.open(getSiteLink('mall').replace('ID', selfStoreId))
              } else if (this.isStorePage && 'follow') {
                try {
                  let storeId = currentPageLink.split('-i.')[1].split('.')[0]
                  window.open(`/shop/${storeId}/followers?other=true`)
                } catch (error) {
                  $.fn.message({ type: 'warning', msg: MESSAGE.error.notSupport })
                  console.log(error)
                }
              }
            }
          })
          break
        case 'EmalaccaCollect':
          this.isCheckAll = !this.isCheckAll
          const actionOption = {
            'select-all': 'handleSelectAll',
            'collect-selected': 'handleCollectSelected',
            'collect-current-page': 'handleCollectCurrPage'
          }
          BatchCollect[actionOption[action]]({ isCheck: this.isCheckAll })
        default:
          break
      }
    },

    // 去取关页面
    handleGotoUnfollow() {
      Follow.syncShoppeBaseInfo().then(res => {
        console.log(res)
      })
    },

    //匹配各个站点的列表页，以判断是否显示采集
    isListOrCate() {
      let siteConfig = JSON.parse(getRule(location.href))
      let pageType = new Function('url', siteConfig.detect)(location.href)
      let showPageArr = ['category', 'sortlist']
      if (showPageArr.includes(pageType)) {
        console.log('是列表页')
        return true
      }
      return false
    },

    //加载程序菜单
    loadMenuAction() {
      if (/shopee|xiapibuy/.test(location.host)) {
        this.isStorePage = location.href.search('-i.') >= 0
        if (this.isListOrCate()) {
          this.rightMenu = [...RIGHT_MENU, ...COMMON_COLLECT]
        } else {
          this.rightMenu = RIGHT_MENU
        }
      } else if (this.isListOrCate()) {
        this.rightMenu = COMMON_COLLECT
      } else {
        this.rightMenu = []
      }
      this.$nextTick(() => {
        let fixedLen = $('.emalacca-plugin-quick-action-item.fixed').length
        this.initHoldUpMarginTop = fixedLen * 48 + 56 + 'px'
      })
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
