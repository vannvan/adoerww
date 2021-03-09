<template>
  <div class="seller-erp-fixed-right" id="emalaccaRightApp">
    <div class="emalacca-plugin-action-wrap" draggable="false">
      <!-- 可以拖动的节点 -->
      <div class="emalacca-plugin-action-toggle">
        <span class="icon em-iconfont em-icon-erp-logo"></span>
      </div>

      <ul class="follow-quick-action-wrap" id="emalaccaRightMenu">
        <li
          v-for="item in rightMenu"
          :key="item.id"
          class="emalacca-plugin-quick-action-item"
          :class="item.fixed ? 'fixed' : ''"
          :id="item.id"
          :style="{ 'pointer-events': !isShrink || (isShrink && item.fixed) ? 'auto' : 'none' }"
        >
          <span class="icon em-iconfont" :class="item.icon"></span>
          <p class="emalacca-plugin-quick-action-title">{{ item.name }}</p>
          <div class="emalacca-plugin-quick-action-content">
            <span
              class="icon em-iconfont em-icon-nail"
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
          :style="{ 'pointer-events': !isShrink ? 'auto' : 'none' }"
          @click="helpClick"
        >
          <span class="icon em-iconfont em-icon-question"></span>
          <p class="emalacca-plugin-quick-action-title">帮助</p>
        </li>
      </ul>

      <div
        class="emalacca-plugin-fold-dark toggle-menu-action"
        :style="{ marginTop: initHoldUpMarginTop }"
      >
        <span
          class="icon em-iconfont"
          :class="!isShrink ? 'em-icon-pick-up' : 'em-icon-pick-down'"
        ></span>
        <p class="emalacca-plugin-quick-action-title">{{ !isShrink ? '收起' : '展开' }}</p>
      </div>
    </div>
    <template v-if="isShopee">
      <drawer
        :title="drawerTitle"
        :display.sync="display"
        :inner="true"
        :width="drawerWidth"
        :mask="false"
      >
        <FollowDrawer :display.sync="display"></FollowDrawer>
      </drawer>
    </template>
  </div>
</template>

<script>
import $ from 'jquery'
import { COMMON_COLLECT, RIGHT_MENU, getSiteLink, MESSAGE, COMMON_COLLECT_DETAIL } from '@/lib/conf'
import { setStorageSync, getStorageSync } from '@/lib/chrome'
import { isEmpty, getCookie } from '@/lib/utils'
import { getRule } from '@/lib/rules'
import BatchCollect from '@/inject/batch-collect'
import FollowDrawer from './FollowDrawer'
import Drawer from './Drawer'
import { ERP_LOGIN_URL } from '@/lib/env.conf'
import Follow from '@/inject/shopee'
const ItemHeight = 48 //每个菜单项的高度
// 判断是否匹配某店铺首页但不是自己的店铺
const isShopMainPageAndNotSelfStore = () => {
  let isStorePage = /shop(.*?)/.test(location.pathname)
  if (isStorePage) {
    return (
      location.pathname.match(/shop(.*?)/).input.replace(/[^0-9]/gi, '') !=
      String(getCookie('SPC_U'))
    )
  } else {
    return false
  }
}
// ES6 async await兼容
const regeneratorRuntime = require('@/assets/js/runtime.js')
export default {
  components: {
    Drawer,
    FollowDrawer
  },

  data() {
    return {
      drawerTitle: APPNAME + ' V' + VERSION,
      display: false,
      drawerWidth: '480px',
      rightMenu: [],
      isShrink: false,
      isStorePage: false, //是否在店铺页面
      initHoldUpMarginTop: '56px', //收起按钮初始marginTop
      isCheckAll: false, //采集全选
      isShopee: false, //是否虾皮网站
      pageType: '' // 当前网站类型 'category', 'sortlist', 'detail'
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
   * 1. 如果是虾皮网站，对于当前页面链接首次加载如果匹配到 -i.表示在某一店铺，/shop(.*?)/.test(location.pathname) 表示在某一店铺，则需要用isStorePage标记用以开启“关注店铺粉丝”操作
   *    同时，需要检测是否是列表页或搜索页，如果匹配则显示批量采集操作
   * 2. 如果不是虾皮网站，则只需对是否显示批量采集操作进行判断，如果匹配则显示
   *
   * 3. observer 的作用是监听页面切换，主要用于虾皮网站，因为虾皮网站页面切换并不会重新初始化主程序
   */
  mounted() {
    // 初始化页面
    this.initPageData()
  },
  methods: {
    // 初始化页面和数据
    async initPageData() {
      let oldHref = location.href
      let isHide = false
      await getStorageSync('isDisabledPlug').then(response => {
        if (response['isDisabledPlug']) {
          isHide = response['isDisabledPlug']
        }
      })
      // 内部平台不显示
      if (oldHref.indexOf('emalacca.com') > -1 || oldHref.indexOf('192.168.') > -1 || isHide) {
        $('#emalaccaRightApp').css({ display: 'none' })
        return
      } else {
        $('#emalaccaRightApp').css({ display: 'block' })
      }
      await this.initData()
    },
    initData() {
      this.getPageType()
      this.loadMenuAction()
      // 监听页面链接更新，加载不同的侧栏工具
      let oldHref = location.href
      let _this = this
      let bodyList = document.querySelector('body'),
        observer = new MutationObserver(function(mutations) {
          if (oldHref != location.href) {
            _this.initPage()
            oldHref = location.href
            let linkRule = getRule(location.href)
            let siteConfig = JSON.parse(linkRule)
            _this.isStorePage =
              new Function('url', siteConfig.detail)(location.href) ||
              isShopMainPageAndNotSelfStore() //如果是某店铺的页面
            _this.pageType = new Function('url', siteConfig.detect)(location.href) //当前页面类型
            _this.loadMenuAction()
          }
        })
      let config = {
        childList: true,
        subtree: true
      }
      observer.observe(bodyList, config)
      this.initToggleAction()
    },
    initToggleAction() {
      let _this = this
      $('.toggle-menu-action').click(function() {
        _this.isShrink = !_this.isShrink
        // 保存用户操作，固定当前按钮
        setStorageSync({ emalacca_isShrink: _this.isShrink })
        let fixedLen = $('.emalacca-plugin-quick-action-item.fixed').length //此时的length和下面的不一样
        if (_this.isShrink) {
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
          let targetTop = $('.emalacca-plugin-quick-action-item').length * ItemHeight + 8 + 'px'
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
        let targetTop = ItemHeight * fixedLen + 8 + 'px'
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
      // 保存用户操作，固定当前按钮
      let obj = {}
      obj[item.id + '_isfixed'] = item.fixed
      setStorageSync(obj)
      // 判断是否收起状态，如果是，则隐藏
      if (!item.fixed && this.isShrink) {
        let fixedLen = $('.emalacca-plugin-quick-action-item.fixed').length - 1
        this.handleHoldUp($('.emalacca-plugin-quick-action-item'), fixedLen)
      }
    },

    //快捷操作功能分发
    // mainActionId 主体方法id action  操作类型
    quickActionHandler(mainActionId, action) {
      console.log(mainActionId, 'mainActionId')
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
                  let storeId =
                    currentPageLink.search('-i.') >= 0
                      ? currentPageLink.split('-i.')[1].split('.')[0]
                      : null
                  if (isShopMainPageAndNotSelfStore()) {
                    storeId = location.pathname.match(/shop(.*?)/).input.replace(/[^0-9]/gi, '')
                  }
                  window.open(`/shop/${storeId}/followers?other=true`)
                } catch (error) {
                  $.fn.message({ type: 'warning', msg: MESSAGE.error.notSupport })
                  console.log(error)
                }
              }
            }
          })
          break
        // 采集操作: 'category', 'sortlist'
        case 'EmalaccaCollect':
          const actionOption = {
            'select-all': 'handleSelectAll',
            'collect-selected': 'handleCollectSelected',
            'collect-current-page': 'handleCollectCurrPage'
          }
          if (action == 'select-all') {
            this.isCheckAll = !this.isCheckAll
          }
          BatchCollect[actionOption[action]]({ isCheck: this.isCheckAll })
          break
        // 采集操作: 'detail'
        case 'EmalaccaCollectDetail':
          BatchCollect.handleCollectCurrPageDetail()
          break
        default:
          break
      }
    },

    //匹配各个站点的列表页，以判断是否显示采集
    getPageType() {
      let siteConfig = JSON.parse(getRule(location.href))
      this.pageType = new Function('url', siteConfig.detect)(location.href)
    },

    //加载程序菜单
    loadMenuAction() {
      let showPageArr = ['category', 'sortlist'] // 列表&分类页面

      if (/shopee|xiapibuy/.test(location.host)) {
        this.isShopee = true
        this.isStorePage = location.href.search('-i.') >= 0 || isShopMainPageAndNotSelfStore()
        if (showPageArr.includes(this.pageType)) {
          this.rightMenu = [...RIGHT_MENU, ...COMMON_COLLECT]
        } else if (this.pageType === 'detail') {
          this.rightMenu = [...RIGHT_MENU, ...COMMON_COLLECT_DETAIL]
        } else {
          this.rightMenu = RIGHT_MENU
        }
      } else if (showPageArr.includes(this.pageType)) {
        this.rightMenu = COMMON_COLLECT
      } else if (this.pageType === 'detail') {
        this.rightMenu = COMMON_COLLECT_DETAIL
      } else {
        this.rightMenu = []
      }
      // 从缓存中获取用户操作习惯, _isfixed是否为固定
      // 当前操作按钮是否已经固定
      let arrKey = ['emalacca_isShrink'] // 记录侧栏工具id && 展开状态
      if (this.rightMenu.length > 0) {
        this.rightMenu.forEach(item => {
          let key = item.id + '_isfixed'
          arrKey.push(key)
        })
        // 获取缓存：用户操作习惯信息
        getStorageSync(arrKey).then(data => {
          if (!isEmpty(data)) {
            this.rightMenu.forEach(item => {
              let key = item.id + '_isfixed'
              if (data[key]) {
                item.fixed = data[key]
              }
            })
          }
          // 页面dom加载完执行
          // 侧栏工具状态和位置更新
          this.$nextTick(() => {
            let fixedLen = 0
            if (!data['emalacca_isShrink']) {
              fixedLen = $('.emalacca-plugin-quick-action-item').length
              this.isShrink = false
            } else {
              this.isShrink = true
              fixedLen = $('.emalacca-plugin-quick-action-item.fixed').length
              this.handleHoldUp($('.emalacca-plugin-quick-action-item'), fixedLen)
            }
            let distNum = !this.isShrink ? 8 : 56
            this.initHoldUpMarginTop = fixedLen * 48 + distNum + 'px'
          })
        })
      }
    },
    // 初始化页面
    initPage() {
      // 清除之前角标
      if ($('.emalacca-plugin-goods-acquisition-spidered').length > 0) {
        $('.emalacca-plugin-goods-acquisition-spidered').css({ display: 'none' })
      }
    },
    openPage(path) {
      if (/http/.test(path)) {
        window.open(path)
      }
    },
    helpClick() {
      window.open(ERP_LOGIN_URL + 'welcome')
    }
  }
}
</script>

<style lang="less"></style>
