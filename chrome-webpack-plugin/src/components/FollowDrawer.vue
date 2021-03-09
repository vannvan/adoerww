<template>
  <!-- 关注 -->
  <div class="emalacca-follow-panel">
    <div class="tab-wrap">
      <span class="tab-item" :class="{ active: currentTab == 1 }" @click="handleToggleTabs(1)"
        >粉丝关注</span
      >
      <span class="tab-item" :class="{ active: currentTab == 2 }" @click="handleToggleTabs(2)"
        >自动取关</span
      >
    </div>
    <template v-if="currentTab == 1">
      <div style="padding:20px">
        <p>
          <a class="hand" @click="followHelpVisible = !followHelpVisible">粉丝关注步骤说明 </a>
          <span
            class="icon em-iconfont em-icon-right arrow-right"
            :class="followHelpVisible ? 'arrow-rotate' : 'arrow-rotate-back'"
          ></span>
          <a @click="handleGotoDemo()" class="hand">演示动画</a>
        </p>
        <template v-if="followHelpVisible">
          <p>
            第一步:打开对应站点的卖家中心，弹出shopee“温馨提示”弹框时，点击“取消”再进行登录操作，如点击“确认”会跳转到中国后台链接，则无法使用。此步操作特别关键！
          </p>
          <p>
            第二步:完成第一步登录成功后，进入对应站点的前台页面，检查右上方账号是否已同步成功，同步成功即可开始使用插件，如显示未登陆状态，请重新操作第一步。
          </p>
          <p>
            第三步:开始使用粉丝关注，鼠标悬浮在商品图片上显示“获取粉丝”点击进入该商品的卖家粉丝列表，根据需求可输入前置条件进行关注。
          </p>
          <p style="margin:10px auto">
            <span style="color:#f00">注:</span
            >如遇到首次进入页面操作就提示异常且失败的情况,请在页面上手动取关一项后刷新页面即可正常使用
          </p>
          <li v-for="(item, index) in shoppeSites" :key="index + 'a'">
            <a :href="item.seller" target="black">{{ item.name }}卖家中心</a>
            <a :href="item.front" target="black">{{ item.name }}前台</a>
          </li>
        </template>
      </div>
    </template>
    <template v-if="currentTab == 2">
      <div style="padding:20px">
        <p>
          <a class="hand" @click="unFollowHelpVisible = !unFollowHelpVisible">取关粉丝步骤说明 </a>
          <span
            class="icon em-iconfont em-icon-right arrow-right"
            :class="unFollowHelpVisible ? 'arrow-rotate' : 'arrow-rotate-back'"
          ></span>
          <a @click="handleGotoDemo()" class="hand">演示动画</a>
        </p>
        <template v-if="unFollowHelpVisible">
          <p>第一步:确认"粉丝关注"步骤1,2已完成</p>
          <p>第二步:点击"自动取关"后进入已关注页面列表进行操作</p>
          <p style="margin:10px auto">
            <span style="color:#f00">注:</span
            >如遇到首次进入页面操作就提示异常且失败的情况,请在页面上手动取关一项后刷新页面即可正常使用
          </p>
        </template>
      </div>
    </template>
    <!-- 关注 -->
    <template v-if="currentTab == 1 && storeInfo.account.username">
      <div class="follow-info-wrap">
        <div class="base-info info-item">
          <p class="title">店铺信息</p>
          <li><b>店铺名称：</b>{{ storeInfo.account.username }}</li>
          <li>
            <span class="sub-item">
              <b>商品数：</b>
              {{ storeInfo.item_count }}
            </span>

            <span class="sub-item">
              <b>聊聊回复率：</b>
              {{ storeInfo.response_rate }}%
            </span>
          </li>
          <li>
            <span class="sub-item"><b>评价：</b>{{ calcRate }}个评价</span>
            <span class="sub-item"><b>取消率：</b>8%</span>
          </li>
          <li>
            <span class="sub-item"><b>粉丝数：</b>{{ storeInfo.follower_count }}</span>
            <span class="sub-item"><b>关注中：</b>{{ storeInfo.account.following_count }}</span>
          </li>
        </div>
        <div class="filter-wrap">
          <p class="title">关注粉丝</p>
          <div class="filter-wrap-item">
            <li>
              <span class="title">
                自动关注数量
              </span>
              <span class="value">
                <input
                  type="number"
                  v-model="filterParams.limitFollowNumber"
                  v-enterNumberMin="0"
                />个
              </span>
            </li>
          </div>
          <!-- 折叠 -->
          <div class="holdon-action" @click="followActionMoreVisible = !followActionMoreVisible">
            {{ followActionMoreVisible ? '收起' : '更多' }}
          </div>
          <!-- 更多筛选 -->
          <div class="filter-wrap-item" v-if="followActionMoreVisible">
            <li>
              <span class="title">
                开始关注位置
              </span>
              <span class="value">
                从第<input type="number" v-model="filterParams.startIndex" v-enterNumberMin="0" />位
              </span>
            </li>
            <li>
              <span class="title">
                最近活跃时间
              </span>
              <span class="value">
                <input
                  type="number"
                  v-model="filterParams.lastLoginTime"
                  v-enterNumberMin="-1"
                />天以内
              </span>
            </li>
            <li>
              <span class="title">
                用户关注数量
              </span>
              <span class="value">
                大于<input
                  type="number"
                  v-model="filterParams.followsTimes"
                  v-enterNumberMin="-1"
                />个
              </span>
            </li>
            <li>
              <span class="title">
                是否跳过卖家
              </span>
              <span class="value">
                <input type="checkbox" class="check-box" v-model="filterParams.isFilterSeller" />
                {{ filterParams.isFilterSeller ? '全部跳过' : '部分跳过' }}
              </span>
            </li>
            <li v-if="!filterParams.isFilterSeller">
              <span class="title">卖家商品数</span>
              <span class="value"> 大于<input type="number" />个 </span>
            </li>
          </div>
        </div>
      </div>
      <!-- 操作 -->
      <div class="footer-action-wrap">
        <button
          @click="handleStart('follow')"
          :style="{ background: isRequest ? '#f5222d' : '#ee4d2d', color: '' }"
        >
          {{ buttonText }}
        </button>
      </div>
    </template>
    <!-- 取消关注 -->
    <template v-if="currentTab == 2">
      <div class="follow-info-wrap">
        <div class="base-info info-item">
          <p class="title">店铺信息</p>
          <li><b>店铺名称：</b>{{ storeInfo.account.username }}</li>
          <li>
            <span class="sub-item">
              <b>商品数：</b>
              {{ storeInfo.item_count }}
            </span>

            <span class="sub-item">
              <b>聊聊回复率：</b>
              {{ storeInfo.response_rate }}%
            </span>
          </li>
          <li>
            <span class="sub-item"><b>评价：</b>{{ calcRate }}个评价</span>
            <span class="sub-item"><b>取消率：</b>8%</span>
          </li>
          <li>
            <span class="sub-item"><b>粉丝数：</b>{{ storeInfo.follower_count }}</span>
            <span class="sub-item"><b>关注中：</b>{{ storeInfo.account.following_count }}</span>
          </li>
        </div>
        <div class="filter-wrap">
          <div class="filter-wrap-item">
            <p class="title">取关粉丝</p>
            <li>
              <span class="title">
                取消关注的数量
              </span>
              <span class="value">
                <input
                  type="number"
                  v-enterNumberMin="0"
                  v-enterNumberMax="countFollowers"
                  v-model="unfollowMaxNumber"
                />
              </span>
            </li>
          </div>
        </div>

        <div class="footer-action-wrap">
          <button
            @click="handleCancelFollow()"
            :style="{ background: isRequest ? '#747d8c' : '#ee4d2d' }"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </template>
    <p style="color:#f00" class="text-center" v-if="isRequest">
      请勿关闭本页面，如果任务异常终止，点击取消后重新开始即可
    </p>
    <div class="show-result-count" v-if="actionedUserList.length != 0">
      <div class="count-item success">
        <p>成功</p>
        <p>{{ resultCount.success }}</p>
      </div>
      <div class="count-item fail">
        <p>失败</p>
        <p>{{ resultCount.fail }}</p>
      </div>
      <div class="count-item skip" v-if="currentTab == 1">
        <p>跳过</p>
        <p>{{ resultCount.skip }}</p>
      </div>
    </div>
    <div
      <div
      class="show-result-list overflow-y"
      id="ResultContent"
      v-if="actionedUserList.length != 0"
    ></div>

    <p class="count-info" v-if="countFollowers">当前页面可操作用户数：{{ countFollowers }}</p>
  </div>
</template>

<script>
import Drawer from './Drawer'
import Follow from '@/inject/shopee'
import $ from 'jquery'
import { WEBSITES, MESSAGE } from '@/lib/conf'
import { isEmpty } from '@/lib/utils'
import dayjs from 'dayjs'

function getTime() {
  return new Date().toTimeString().substring(0, 8)
}

export default {
  component: {
    Drawer
  },
  data() {
    return {
      currentTab: 1,
      //   筛选参数
      filterParams: {
        startIndex: 1, //自动开始位置
        limitFollowNumber: '', //自动关注数量
        lastLoginTime: '', //上次登录时间
        followsTimes: '', //关注数
        isFilterSeller: false, //是否过滤卖家
        sellerGoodsCount: null //卖家商品数
      },
      buttonText: '开启',
      countFollowers: null, //当前页面粉丝数
      storeInfo: {
        account: {}
      }, //店铺信息
      resultCount: {
        success: 0,
        fail: 0,
        skip: 0
      }, //结果统计
      isRequest: false,
      globalTimer: null, //定时器
      usernameQueue: [], //用户队列
      currentUserName: null, //当前操作用用
      cookieSyncStatus: true, //cookies同步状态
      actionedUserList: [], //操作过的用户
      unfollowMaxNumber: 10, //取消关注最大数量
      isOther: false, //用于标识是关注别人的还是取关自己的
      lastOffsetHeight: null, //用于标识上次垂直高度和当前垂直高度，屏幕是否滚到底部
      shoppeSites: WEBSITES,
      countryCode: null, //当前国家
      currentStoreId: null, //当前用户自己的店铺id
      followHelpVisible: false,
      unFollowHelpVisible: false,
      followActionMoreVisible: false, //关注操作更多是否可见
      scrollTimer: null //自动滚动定时器
    }
  },
  props: {
    display: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    calcRate() {
      let { rating_bad, rating_good, rating_normal } = this.storeInfo
      return rating_bad + rating_good + rating_normal
    }
  },

  watch: {
    display: {
      handler(newVal) {
        let { pathname } = location
        if (!/followers|following/.test(pathname) && newVal) {
          //   this.handleToggleTabs(2)
          this.currentTab = 1
        } else {
          if (/following/.test(location.href)) {
            this.currentTab = 2
          } else if (/followers/.test(location.href)) {
            this.currentTab = 1
          }
        }
        if (newVal && !this.cookieSyncStatus) {
          this.$Notice.error({
            content: MESSAGE.error.syncLoginStatusFail
          })
        }
      }
    }
  },

  directives: {
    //   限制可输入最大值
    enterNumberMax: {
      inserted: function(el, binding) {
        // binding.value
        let trigger = (el, type) => {
          const e = document.createEvent('HTMLEvents')
          e.initEvent(type, true, true)
          el.dispatchEvent(e)
        }

        el.addEventListener('keyup', function(e) {
          let input = e.target
          let value = input.value
          if (parseFloat(value) > parseFloat(binding.value)) {
            input.value = binding.value
          }
          trigger(input, 'input')
        })
      }
    },
    //限制可输入最小值
    enterNumberMin: {
      inserted: function(el, binding) {
        // binding.value
        let trigger = (el, type) => {
          const e = document.createEvent('HTMLEvents')
          e.initEvent(type, true, true)
          el.dispatchEvent(e)
        }

        el.addEventListener('keyup', function(e) {
          let input = e.target
          let value = input.value
          if (parseFloat(value) <= parseFloat(binding.value)) {
            input.value = parseFloat(binding.value) + 1
          }
          trigger(input, 'input')
        })
      }
    }
  },
  mounted() {
    //   把页面整体左移，避免小分辨率右侧操作栏遮挡主体
    $('.middle-centered-div').css('transform', 'translateX(-50%)')
    this.isOther = /followers/.test(location.pathname)
    this.currentTab = this.isOther ? 1 : 2
    this.buttonText = this.isOther ? '开启关注' : '开启取关'
    let { pathname } = location
    if (/followers|following/.test(pathname)) {
      this.$emit('update:display', true)
      let storeId = pathname.replace(/[^0-9]/gi, '')
      Follow.getStoreInfoById(storeId).then(res => {
        if (res.code == 0) {
          this.storeInfo = res.result.data
        }
      })
    } else {
      //获取虾皮的店铺ID,除了以上两个页面
      this.getCurrentStoreId()
    }

    window.addEventListener('scroll', this.handleScroll)
    this.$nextTick(() => {
      Follow.sendCsrfToken()
        .then(() => {
          console.log('cookies同步成功')
          this.cookieSyncStatus = true
        })
        .catch(() => {
          this.$Notice.error({
            content: MESSAGE.error.syncLoginStatusFail
          })
        })
    })
  },
  methods: {
    //打开演示动画
    handleGotoDemo() {
      Follow.handleGotoDemo()
    },

    handleToggleTabs(index) {
      Follow.sendCsrfToken() //每次切换都把当前页面的token更新到background
      this.currentTab = index
      Follow.syncShoppeBaseInfo().then(res => {
        if (res.code == 0 && res.result) {
          this.currentStoreId = res.result.storeId
          this.countryCode = res.result.country
          if (!this.countryCode) {
            this.$Notice.error({
              content: MESSAGE.error.didNotGetToSiteInformation
            })
            this.$emit('update:display', false)
            return
          }
          let reg = new RegExp(this.countryCode.toLowerCase())
          let countryWebSite = WEBSITES.find(el => reg.test(JSON.stringify(el))) //获取到对应的取关地址
          this.$emit('update:display', false)
          if (this.currentTab == 2) {
            location.replace(countryWebSite.mall.replace('ID', this.currentStoreId))
          } else if (countryWebSite.front != location.href) {
            this.$Notice.info({
              content: '将带你去首页寻找合适的店铺获取粉丝哦！！！'
            })
            setTimeout(() => {
              location.replace(countryWebSite.front)
            }, 3000)
          }
        } else {
          this.$Notice.error({
            content: MESSAGE.error.syncLoginStatusFail
          })
        }
      })
    },

    handleScroll() {
      $('.middle-centered-div').css('transform', 'translateX(-50%)')
      this.countFollowers = $('.clickable_area.middle-centered-div').length
    },

    scrollTo() {
      this.scrollTimer = setInterval(() => {
        if (this.lastOffsetHeight >= document.body.offsetHeight) {
          clearTimeout(this.scrollTimer)
        } else {
          window.scrollTo(0, document.body.offsetHeight)
          this.lastOffsetHeight = document.body.offsetHeight
        }
      }, 5000)
    },

    //更新可操作用户列表，1. 每次向下滚动就向usernameQueue追加数据，2.排除已操作过的数据
    updateUserList() {
      let userListDOM = document.querySelectorAll('a')
      let userNameList = [...userListDOM].map(el => el.getAttribute('username')).filter(Boolean)
      this.usernameQueue = [
        ...new Set(userNameList.filter(item => !this.actionedUserList.includes(item)))
      ]
    },

    //获取当前登录店铺的id
    getCurrentStoreId() {
      // 先走登录接口获取到用户名,再用用户名获取店铺id和当前站点信息
      Follow.syncShoppeBaseInfo().then(res => {
        if (res.code == 0) {
          let { username, country, storeId } = res.result
          if (username) {
            this.currentStoreId = storeId
            this.countryCode = country
          } else {
            this.$Notice.error({
              content: MESSAGE.error.pleaseCheckWhetherHaveAuthoriz
            })
          }
        }
      })
    },

    //开始关注
    handleStart(actionType) {
      if (this.isRequest) {
        this.handleCancel()
        return
      }
      this.scrollTo() //开始滚
      //如果没有填,并且把更多展开了，给一波默认值
      this.filterParams.limitFollowNumber = this.filterParams.limitFollowNumber || 100
      if (this.followActionMoreVisible) {
        this.filterParams.lastLoginTime = this.filterParams.lastLoginTime || 30
        this.filterParams.followsTimes = this.filterParams.followsTimes || 1
      }

      if (!this.validate()) return
      let htmlStr = `<li>[${getTime()}] 任务开始...</li>`
      $('#ResultContent').prepend(htmlStr)
      this.getStoreFollowers(actionType)
    },

    //取消关注
    handleCancelFollow() {
      if (this.isRequest) {
        this.handleCancel()
        return
      }
      clearInterval(this.scrollTimer) //停止滚
      if (!this.validate()) return
      let htmlStr = `<li>[${getTime()}] 取关任务开始...</li>`
      $('#ResultContent').prepend(htmlStr)
      this.getStoreFollowers('unfollow')
    },

    //关注或取关操作
    getStoreFollowers(actionType) {
      this.globalTimer = setInterval(() => {
        this.updateUserList()
        console.log(
          'usernameQueue length:',
          this.usernameQueue.length,
          'actionedUserList length:',
          this.actionedUserList.length
        )
        this.currentUserName = this.usernameQueue.splice(0, 1)[0]
        if (!isEmpty(this.currentUserName)) {
          this.isRequest = true
          this.buttonText = '正在运行中，点击可取消'
          this.actionedUserList.push(this.currentUserName)
          if (!this.handleSkipJudge(actionType)) return
          Follow.getStoreFollowers(this.currentUserName).then(res => {
            if (res.code == 0) {
              let { shopid } = res.result.data
              if (actionType == 'follow' && this.filterMatch(res.result.data).match) {
                this.handleNotifyToBack(actionType, shopid, this.currentUserName)
              } else if (actionType == 'unfollow') {
                this.handleNotifyToBack(actionType, shopid, this.currentUserName)
              } else {
                let reasonText = this.filterMatch(res.result.data).reason
                  ? this.filterMatch(res.result.data).reason.reason
                  : ''
                this.resultCount.skip += 1
                let htmlStr = `<li>[${getTime()}] ${
                  this.currentUserName
                }跳过,原因：<small>${reasonText}</small></li>`
                $('#ResultContent').prepend(htmlStr)
              }
            }
          })
        } else {
          let infoText = actionType == 'follow' ? '关注' : '取关'
          let htmlStr = `<li>[${getTime()}] ${infoText} 任务完成！</li>`
          $('#ResultContent').prepend(htmlStr)
          this.handleCancel()
        }
      }, 1000)
    },

    //判断跳过条件
    handleSkipJudge(actionType) {
      let limitOpts = {
        1:
          this.resultCount.success >= this.filterParams.limitFollowNumber ||
          this.actionedUserList >= this.countFollowers,
        2:
          this.resultCount.success >= this.unfollowMaxNumber ||
          this.actionedUserList >= this.countFollowers
      }
      if (limitOpts[this.currentTab]) {
        clearInterval(this.globalTimer)
        this.$nextTick(() => {
          let infoText = actionType == 'follow' ? '关注' : '取关'
          let htmlStr = `<li style="color:#2ecc71">[${getTime()}] ${infoText} 任务完成...</li>`
          this.buttonText = this.isOther ? '开启关注' : '开启取关'
          this.isRequest = false
          $('#ResultContent').prepend(htmlStr)
        })
        return false
      }
      return true
    },

    //关注或取关，传送给后台
    handleNotifyToBack(actionType, shopid, name) {
      //   console.log('操作过的用户', this.actionedUserList)
      Follow.notifyBackFollowOrUnFollow(actionType, shopid)
        .then(res => {
          let infoText = actionType == 'follow' ? '关注' : '取关'
          if (res.code == 0 && res.result.success) {
            let htmlStr = `<li style="color:#2ecc71">[${getTime()}] ${name}${infoText}成功</li>`
            $('#ResultContent').prepend(htmlStr)
            this.resultCount.success += 1
          } else if (res.result && res.result.error == 'error_not_login') {
            clearInterval(this.globalTimer)
            let htmlStr = `<li style="color:#f00">[${getTime()}] 请同步登录状态后重新操作</li>`
            $('#ResultContent').prepend(htmlStr)
            this.resultCount.fail += 1
            this.isRequest = false
            this.buttonText = this.isOther ? '开启关注' : '开启取关'
          } else if (res.code == -1) {
            let htmlStr = `<li style="color:#f00">[${getTime()}] ${name}${infoText}失败</li>`
            $('#ResultContent').prepend(htmlStr)
            this.resultCount.fail += 1
            this.$Notice.error({
              content: MESSAGE.error.abnormalSituation
            })
            this.handleCancel()
          } else {
            let htmlStr = `<li style="color:#f00">[${getTime()}] ${name}${infoText}失败</li>`
            $('#ResultContent').prepend(htmlStr)
            this.resultCount.fail += 1
            this.handleCancel()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },

    //过滤匹配
    filterMatch(source) {
      // item_count是商品数
      let {
        account: { is_seller },
        last_active_time,
        item_count,
        follower_count,
        rating_bad,
        rating_good,
        rating_normal,
        name
      } = source
      let rateCount = rating_bad + rating_good + rating_normal //评价次数
      console.log(
        `上次登录: ${dayjs(last_active_time * 1000).format(
          'YYYY-MM-DD'
        )},商品数: ${item_count},关注数: ${follower_count},评价数: ${rateCount},是否卖家：${is_seller},用户姓名：${name},获取时间：${getTime()}`
      )
      let {
        lastLoginTime, //上次登录时间
        followsTimes, //关注数
        isFilterSeller, //是否过滤卖家
        sellerGoodsCount //卖家商品数
      } = this.filterParams
      let timestamp = Math.round(new Date().getTime() / 1000).toString()
      let matchStep1 = follower_count >= followsTimes //和关注数
      let matchStep2 = parseInt((timestamp - last_active_time) / 86400) <= lastLoginTime //限制上次登录
      let matchStep3 = item_count >= sellerGoodsCount //限制商品数
      let matchStep5 = is_seller == false //是否是卖家
      //  不过滤卖家时， 如果当前用户是卖家且限制了商品数，就需要同时满足，如果只是买家，就不用限制商品数
      const reasonOpt = [
        { key: 'matchStep1', match: matchStep1, reason: `用户关注数量不匹配,${follower_count}个` },
        {
          key: 'matchStep2',
          match: matchStep2,
          reason: `最近活跃时间不匹配,${dayjs(last_active_time * 1000).format('YYYY-MM-DD')}`
        },
        { key: 'matchStep3', match: matchStep3, reason: `卖家商品数量不匹配,${item_count}个` },
        { key: 'matchStep5', match: matchStep5, reason: '当前用户是卖家' }
      ]
      let faildReason = reasonOpt.find(el => !el.match)
      console.log(faildReason)
      if (!this.followActionMoreVisible) {
        //如果没有展开更多，就全通过
        return { match: true }
      }
      if (!isFilterSeller) {
        if (is_seller) {
          let isMatch = matchStep1 && matchStep2 && matchStep3
          return { match: isMatch, result: isMatch ? '' : faildReason }
        } else {
          let isMatch = matchStep1 && matchStep2
          return { match: isMatch, reason: isMatch ? '' : faildReason }
        }
      } else {
        let isMatch = matchStep1 && matchStep2 && matchStep3 && matchStep5
        return { match: isMatch, reason: isMatch ? '' : faildReason }
      }
    },

    validate() {
      let validQueue = []
      Object.keys(this.filterParams).forEach(key => {
        if (!this.filterParams[key] && this.$refs[key]) {
          this.$refs[key].style.display = 'block'
          validQueue.push(false)
        } else if (this.$refs[key]) {
          this.$refs[key].style.display = 'none'
        }
      })
      return validQueue.length == 0
    },

    //取消请求
    handleCancel() {
      this.isRequest = false
      this.buttonText = '重新开始'
      clearInterval(this.globalTimer)
      clearInterval(this.scrollTimer)
    }
  }
}
</script>

<style lang="less">
.emalacca-follow-panel {
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  .hand {
    cursor: pointer;
    color: #ee4d2d;
  }
  .arrow-right {
    height: 22px;
    vertical-align: middle;
    margin-top: -3px;
    font-size: 12px;
    color: #ee4d2d;
    margin-right: 90px;
  }
  .arrow-rotate-back {
    transition: all 0.5s;
  }

  .arrow-rotate {
    transform: rotate(90deg);
    transition: all 0.5s;
  }
  .text-center {
    text-align: center;
  }
  li {
    list-style: none;
    display: flex;
    a {
      width: 50%;
      line-height: 25px;
      color: #ee4d2d;
      text-align: left;
      display: inline-block;
    }
  }
  .tab-wrap {
    height: 40px;
    width: 220px;
    margin: 12px auto;
    display: flex;
    justify-content: space-between;
    .tab-item {
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      &.active {
        border-bottom: 2px solid #3498db;
      }
    }
  }
  .follow-info-wrap {
    width: 90%;
    margin: 0 auto;
    .filter-wrap {
      margin-bottom: 25px;
      p {
        font-weight: bold;
        font-size: 16px;
        &.title {
          margin: 5px 0;
        }
      }
      .filter-wrap-item {
        li {
          display: flex;
          list-style: none;
          height: 38px;
          line-height: 38px;
          .title {
            margin-right: 15px;
          }
          input[type='number'] {
            border: none;
            border: 1px solid #666;
            outline: none;
            width: 80px;
            padding-left: 8px;
            margin-right: 8px;
          }
        }
      }

      .holdon-action {
        text-align: right;
        position: relative;
        width: 100%;
        display: inline-block;
        color: #e74c3c;
        margin-top: 10px;
        cursor: pointer;
        &::before {
          content: '';
          display: block;
          height: 1px;
          width: calc(100% - 50px);
          background: #e74c3c;
          position: absolute;
          left: 0;
          top: 8px;
        }
      }
    }
    .info-item {
      p {
        font-weight: bold;
        font-size: 16px;
      }

      li {
        height: 38px;
        line-height: 38px;
        display: flex;
        justify-content: flex-start;
        .sub-item {
          display: block;
          width: 50%;
          position: relative;

          b {
            color: #ee4d2d;
          }
        }
      }
    }
  }
  .footer-action-wrap {
    text-align: center;
    button {
      border: none;
      outline: none;
      height: 36px;
      padding: 5px 16px;
      background: #ee4d2d;
      text-align: center;
      border-radius: 3px;
      cursor: pointer;
      color: #fff;
    }
  }
  .show-result-count {
    width: 90%;
    margin: 12px auto;
    display: flex;
    justify-content: space-around;
    .count-item {
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 22px;
      padding: 8px;
      border: 1px solid #ccc;
      &.success {
        color: #2ecc71;
      }
      &.fail {
        color: #e74c3c;
      }
      &.skip {
        color: #95a5a6;
      }
    }
  }
  .show-result-list {
    height: 520px;
    width: 100%;
    margin-top: 12px;
    overflow-y: auto;
    li {
      line-height: 30px;
      text-align: left;
      padding-left: 20px;
      white-space: nowrap;
    }
  }
  .count-info {
    position: fixed;
    bottom: 0;
    color: #ee4d2d;
  }
}
</style>
