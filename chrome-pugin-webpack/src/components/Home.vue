<template>
  <div class="seller-erp-fixed-right">
    <img
      class="icon-toggle"
      src="../assets/icon/logo-toggle.png"
      @click="display = true"
    />
    <div class="drawer-wrap">
      <drawer
        :title="'马六甲ERP插件' + pluginVersion"
        :display.sync="display"
        :inner="true"
        :width="drawerWidth"
        :mask="false"
      >
        <!-- 关注 -->
        <div class="follow-panel">
          <div class="tab-wrap">
            <span
              class="tab-item"
              :class="{ active: currentTab == 1 }"
              @click="handleToggleTabs(1)"
              >粉丝关注</span
            >
            <span
              class="tab-item"
              :class="{ active: currentTab == 2 }"
              @click="handleToggleTabs(2)"
              >自动取关</span
            >
          </div>
          <template v-if="currentTab == 1">
            <div style="padding:20px">
              <p><b>粉丝关注使用步骤：</b></p>
              <p>1.进入站点指定卖家中心完成登录,"温馨提示"点击取消</p>
              <p>2.进入站点前台确认右上角账号信息已同步</p>
              <p>
                3.在前台底部推荐商品列表点击"获取粉丝"按钮，打开粉丝列表页面进行操作
              </p>
              <li v-for="(item, index) in shoppeSites" :key="index + 'a'">
                <a :href="item.seller" target="black"
                  >{{ item.name }}卖家中心</a
                >
                <a :href="item.front" target="black">{{ item.name }}前台</a>
              </li>
            </div>
          </template>
          <template v-if="currentTab == 2">
            <div style="padding:20px">
              <p><b>取关粉丝使用步骤：</b></p>
              <p>1.确认"粉丝关注"步骤1,2已完成</p>
              <p>点击"自动取关"后进入已关注页面列表进行操作</p>
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
                  <span class="sub-item"
                    ><b>评价：</b>{{ calcRate }}个评价</span
                  >
                  <span class="sub-item"><b>取消率：</b>8%</span>
                </li>
                <li>
                  <span class="sub-item"
                    ><b>粉丝数：</b>{{ storeInfo.follower_count }}</span
                  >
                  <span class="sub-item"
                    ><b>关注中：</b
                    >{{ storeInfo.account.following_count }}</span
                  >
                </li>
              </div>
              <div class="info-item">
                <p>关注粉丝</p>
                <li>
                  <span class="sub-item">自动关注的开始位置</span>
                  <span class="sub-item">自动关注的数量</span>
                </li>
                <li>
                  <span class="sub-item">
                    <input
                      type="number"
                      placeholder="默认从第一个开始"
                      v-model="filterParams.startIndex"
                      v-enterNumberMin="0"
                    />
                    <small class="error-info" ref="startIndex"
                      >请输入开始位置</small
                    >
                  </span>

                  <span class="sub-item">
                    <input
                      type="number"
                      placeholder="100"
                      v-model="filterParams.limitFollowNumber"
                      v-enterNumberMin="0"
                    />
                    <small class="error-info" ref="limitFollowNumber"
                      >请输入关注数量</small
                    >
                  </span>
                </li>
                <li>
                  <span class="sub-item">上次登录时间</span>
                  <span class="sub-item">最少评价次数</span>
                </li>
                <li>
                  <span class="sub-item">
                    <input
                      type="number"
                      placeholder="<=30天"
                      v-model="filterParams.lastLoginTime"
                      v-enterNumberMax="30"
                      v-enterNumberMin="-1"
                    />
                    <small class="error-info" ref="lastLoginTime"
                      >请输入上次登录时间
                    </small>
                  </span>
                  <span class="sub-item">
                    <input
                      type="number"
                      placeholder=">=0次"
                      v-model="filterParams.commentsTimes"
                      v-enterNumberMin="-1"
                    />
                    <small class="error-info" ref="commentsTimes"
                      >请输入评价次数
                    </small>
                  </span>
                </li>
                <li>
                  <span class="sub-item">最少关注数</span>
                </li>
                <li>
                  <span class="sub-item">
                    <input
                      type="number"
                      placeholder=">=0次"
                      v-model="filterParams.followsTimes"
                      v-enterNumberMin="-1"
                    />
                    <small class="error-info" ref="followsTimes"
                      >请输入关注人数
                    </small>
                  </span>
                </li>
                <li>
                  <span class="sub-item">过滤卖家</span>
                  <span class="sub-item" v-if="!filterParams.isFilterSeller">
                    卖家商品数
                  </span>
                </li>
                <li>
                  <span class="sub-item">
                    <input
                      type="checkbox"
                      class="check-box"
                      v-model="filterParams.isFilterSeller"
                    />
                    {{ filterParams.isFilterSeller ? '是' : '否' }}
                  </span>
                  <span class="sub-item" v-if="!filterParams.isFilterSeller">
                    <input
                      type="number"
                      placeholder=">=50"
                      v-model="filterParams.sellerGoodsCount"
                    />
                  </span>
                </li>
              </div>
            </div>
            <!-- 操作 -->
            <div class="footer-action-wrap">
              <button
                @click="handleStart('follow')"
                :style="{ background: isRequest ? '#747d8c' : '#ee4d2d' }"
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
                  <span class="sub-item"
                    ><b>评价：</b>{{ calcRate }}个评价</span
                  >
                  <span class="sub-item"><b>取消率：</b>8%</span>
                </li>
                <li>
                  <span class="sub-item"
                    ><b>粉丝数：</b>{{ storeInfo.follower_count }}</span
                  >
                  <span class="sub-item"
                    ><b>关注中：</b
                    >{{ storeInfo.account.following_count }}</span
                  >
                </li>
              </div>
              <div class="info-item">
                <p>关注粉丝</p>
                <li>
                  <span class="sub-item">取消关注</span>
                </li>
                <li>
                  <span class="sub-item">
                    <input
                      type="number"
                      v-enterNumberMin="0"
                      v-enterNumberMax="countFollowers"
                      v-model="unfollowMaxNumber"
                      placeholder="取消关注的数量"
                    />
                  </span>
                </li>
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
          <template v-if="!cookieSyncStatus">
            <div class="no-login-warning">
              <p><b>粉丝关注使用步骤：</b></p>
              <p>1.进入站点指定卖家中心完成登录,"温馨提示"点击取消</p>
              <p>2.进入站点前台确认右上角账号信息已同步</p>
              <p>
                3.在前台底部推荐商品列表点击"获取粉丝"按钮，打开粉丝列表页面进行操作
              </p>
              <li v-for="item in shoppeSites" :key="item.name">
                <a :href="item.seller">{{ item.name }}卖家中心</a>
                <a :href="item.front">{{ item.name }}前台</a>
              </li>
              <p><b>取关粉丝使用步骤：</b></p>
              <p>1.确认"粉丝关注"步骤1,2已完成</p>
              <p>
                2.进入任意一个自己店铺商品详情页，看到形如<span
                  style="color:#f00"
                  >https://shopee.com.my/Electronic-i.341541524.6064074928</span
                >的链接，将第一个数字341541524复制到以下站点对应取关页面将ID替换为该数字后回车后方可进行取关操作<span
                  style="color:#f00"
                  >注：(此处341541524只做示例，具体数值以用户店铺实际数值为准)</span
                >
              </p>
              <li v-for="(item, index) in shoppeSites" :key="index + 'b'">
                <a :href="item.mall" target="black">{{ item.name }}取关页面</a>
              </li>
            </div>
          </template>
          <p class="count-info" v-if="countFollowers">
            当前页面可操作用户数：{{ countFollowers }}
          </p>
        </div>
      </drawer>
    </div>
  </div>
</template>

<script>
import Drawer from './Drawer'
import Follow from '@/inject/follow-content'
import $$ from 'jquery'
import { websites } from './conf'
const packJSON = require('../../package.json')
function getTime() {
  return new Date().toTimeString().substring(0, 8)
}
export default {
  components: {
    Drawer,
  },
  data() {
    return {
      pluginVersion: packJSON.version,
      display: false,
      drawerWidth: '400px',
      currentTab: 1,
      //   筛选参数
      filterParams: {
        startIndex: 1, //自动开始位置
        limitFollowNumber: '', //自动关注数量
        lastLoginTime: '', //上次登录时间
        commentsTimes: '', //评价次数
        followsTimes: '', //关注数
        isFilterSeller: false, //是否过滤卖家
        sellerGoodsCount: null, //卖家商品数
      },
      buttonText: '开启',
      countFollowers: null, //当前页面粉丝数
      storeInfo: {
        account: {},
      }, //店铺信息
      resultCount: {
        success: 0,
        fail: 0,
        skip: 0,
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
      shoppeSites: websites,
      countryCode: null, //当前国家
      currentStoreId: null,
    }
  },
  computed: {
    calcRate() {
      let { rating_bad, rating_good, rating_normal } = this.storeInfo
      return rating_bad + rating_good + rating_normal
    },
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
      },
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
      },
    },
  },

  watch: {
    display: {
      handler(newVal) {
        let { pathname } = window.location
        if (!/followers|following/.test(pathname) && newVal) {
          //   this.handleToggleTabs(2)
          this.currentTab = 1
        } else {
          if (/following/.test(window.location.href)) {
            this.currentTab = 2
          } else if (/followers/.test(window.location.href)) {
            this.currentTab = 1
          }
        }
        if (newVal && !this.cookieSyncStatus) {
          this.$Notice.error({
            content: '【虾皮粉丝插件】:登录状态同步失败，请关闭窗口重新登录',
          })
        }
      },
    },
  },

  mounted() {
    this.isOther = window.location.search.search('other') == 1
    this.currentTab = this.isOther ? 1 : 2
    this.buttonText = this.isOther ? '开启关注' : '开启取关'
    let _this = this
    let { pathname } = window.location
    if (/followers|following/.test(pathname)) {
      this.display = true
      let storeId = pathname.replace(/[^0-9]/gi, '')
      Follow.getStoreInfoById(storeId).then((res) => {
        this.storeInfo = res.result.data
        console.log(this.storeInfo)
      })
      _this.scrollTo()
    } else {
      //获取虾皮的店铺ID,除了以上两个页面
      this.getCurrentStoreId()
    }

    window.addEventListener('scroll', this.handleScroll)
    this.$nextTick(() => {
      Follow.sendCsrfToken()
        .then((res) => {
          console.log('cookies同步成功')
          this.cookieSyncStatus = true
        })
        .catch(() => {
          this.$Notice.error({
            content: '【虾皮粉丝插件】:登录状态同步失败，请关闭窗口重新登录',
          })
        })
    })
  },
  methods: {
    handleToggleTabs(index) {
      this.currentTab = index
      Follow.syncShoppeBaseInfo(null, null).then((res) => {
        this.currentStoreId = res.result.storeId
        this.countryCode = res.result.country
        if (!this.countryCode) {
          this.$Notice.error({
            content: '【虾皮粉丝插件】:未获取到当前站点信息',
          })
          return
        }
        let reg = new RegExp(this.countryCode.toLowerCase())
        let countryWebSite = websites.find((el) => reg.test(JSON.stringify(el))) //获取到对应的取关地址
        this.display = false
        if (this.currentTab == 2) {
          window.open(countryWebSite.mall.replace('ID', this.currentStoreId))
        } else if (countryWebSite.front != window.location.href) {
          window.open(countryWebSite.front)
        }
      })
    },
    handleScroll() {
      this.countFollowers = $$('.clickable_area.middle-centered-div').length
    },
    scrollTo() {
      let timer = setInterval(() => {
        if (this.lastOffsetHeight >= document.body.offsetHeight) {
          clearTimeout(timer)
        } else {
          window.scrollTo(0, document.body.offsetHeight)
          this.lastOffsetHeight = document.body.offsetHeight
        }
      }, 5000)
    },

    //获取当前登录店铺的id
    getCurrentStoreId() {
      let pageStoreName = localStorage.getItem('username')
        ? localStorage.getItem('username').replace(/"/g, '')
        : undefined
      console.log(pageStoreName, 'pageStoreName')
      if (!pageStoreName) {
        this.$Notice.error({
          content: '【虾皮粉丝插件】: 请检查是否已登录虾皮账号',
        })
      } else {
        Follow.getCurrentStoreId(pageStoreName).then((res) => {
          let { shopid, country } = res.result.data
          if (!country || !shopid) {
            this.$Notice.error({
              content:
                '【虾皮粉丝插件】: 请检查当前店铺是否已授权或是否已登录虾皮账户',
            })
          } else {
            Follow.syncShoppeBaseInfo(shopid, country).then((res) => {
              this.currentStoreId = res.result.storeId
              this.countryCode = res.result.country
              console.log(this.countryCode, 'this.countryCode')
            })
          }
        })
      }
    },

    //开始关注
    handleStart(actionType) {
      let _this = this
      if (this.isRequest) {
        this.handleCancel()
        return
      }
      if (!this.validate()) return
      let userNameList = []
      let htmlStr = `<li>[${getTime()}] 任务开始...</li>`
      $$('#ResultContent').prepend(htmlStr)
      $$('.down a').each(function(index) {
        if (index >= _this.filterParams.startIndex) {
          userNameList.push($$(this).attr('username'))
        } else {
          _this.resultCount.skip += 1 //跳过
        }
      })
      this.usernameQueue = userNameList
      this.getStoreFollowers(actionType)
    },

    // //取消关注
    handleCancelFollow() {
      let _this = this
      if (this.isRequest) {
        this.handleCancel()
        return
      }
      if (!this.validate()) return
      let userNameList = []
      let htmlStr = `<li>[${getTime()}] 取关任务开始...</li>`
      $$('#ResultContent').prepend(htmlStr)
      $$('.down a').each(function(index) {
        userNameList.push($$(this).attr('username'))
      })
      this.usernameQueue = userNameList
      this.getStoreFollowers('unfollow')
    },

    //关注或取关操作
    getStoreFollowers(actionType) {
      this.globalTimer = setInterval(() => {
        this.currentUserName = this.usernameQueue.splice(0, 1)
        if (!!this.currentUserName) {
          this.isRequest = true
          this.buttonText = '正在运行中，点击可取消'
          this.actionedUserList.push(this.currentUserName)
          if (!this.handleSkipJudge(actionType)) return
          Follow.getStoreFollowers(this.currentUserName).then((res) => {
            let { shopid } = res.result.data
            if (actionType == 'follow' && this.filterMatch(res.result.data)) {
              this.handleNotifyToBack(actionType, shopid, this.currentUserName)
            } else if (actionType == 'unfollow') {
              this.handleNotifyToBack(actionType, shopid, this.currentUserName)
            } else {
              this.resultCount.skip += 1
              let htmlStr = `<li>[${getTime()}] ${
                this.currentUserName
              }跳过</li>`
              $$('#ResultContent').prepend(htmlStr)
            }
          })
        } else {
          let infoText = actionType == 'follow' ? '关注' : '取关'
          let htmlStr = `<li>[${getTime()}] ${infoText} 任务完毕！</li>`
          $$('#ResultContent').prepend(htmlStr)
        }
      }, 1000)
    },
    handleSkipJudge(actionType) {
      let limitOpts = {
        1:
          this.resultCount.success > this.filterParams.limitFollowNumber ||
          this.actionedUserList > this.countFollowers,
        2:
          this.actionedUserList.length > this.unfollowMaxNumber ||
          this.actionedUserList > this.countFollowers,
      }
      if (limitOpts[this.currentTab]) {
        clearInterval(this.globalTimer)
        this.$nextTick(() => {
          let infoText = actionType == 'follow' ? '关注' : '取关'
          let htmlStr = `<li style="color:#2ecc71">[${getTime()}] ${infoText} 任务完成...</li>`
          this.buttonText = this.isOther ? '开启关注' : '开启取关'
          this.isRequest = false
          $$('#ResultContent').prepend(htmlStr)
        })
        return false
      }
      return true
    },
    //关注或取关，传送给后台
    handleNotifyToBack(actionType, shopid, name) {
      //   console.log('操作过的用户', this.actionedUserList)
      Follow.notifyBackFollowOrUnFollow(actionType, shopid).then((res) => {
        if (res.result.success) {
          let infoText = actionType == 'follow' ? '关注' : '取关'
          let htmlStr = `<li style="color:#2ecc71">[${getTime()}] ${name}${infoText}成功</li>`
          $$('#ResultContent').prepend(htmlStr)
          this.resultCount.success += 1
        } else if (res.result.error == 'error_not_login') {
          clearInterval(this.globalTimer)
          let htmlStr = `<li style="color:#f00">[${getTime()}] 请同步登录状态后重新操作</li>`
          $$('#ResultContent').prepend(htmlStr)
          this.resultCount.fail += 1
          this.isRequest = false
          this.buttonText = this.isOther ? '开启关注' : '开启取关'
        } else {
          let htmlStr = `<li style="color:#f00">[${getTime()}] ${name}${infoText}失败</li>`
          $$('#ResultContent').prepend(htmlStr)
          this.resultCount.fail += 1
        }
      })
    },

    //过滤匹配
    filterMatch(source) {
      // item_count是商品数
      let {
        account: { is_seller },
        mtime,
        item_count,
        follower_count,
        rating_bad,
        rating_good,
        rating_normal,
        name,
      } = source
      let rateCount = rating_bad + rating_good + rating_normal //评价次数
      console.log(
        `上次登录: ${new Date(
          mtime * 1000
        ).toLocaleDateString()},商品数: ${item_count},关注数: ${follower_count},评价数: ${rateCount},是否卖家：${is_seller},用户姓名：${name},获取时间：${getTime()}`
      )
      let {
        lastLoginTime, //上次登录时间
        commentsTimes, //评价次数
        followsTimes, //关注数
        isFilterSeller, //是否过滤卖家
        sellerGoodsCount, //卖家商品数
      } = this.filterParams
      let timestamp = Math.round(new Date().getTime() / 1000).toString()
      let matchStep1 = follower_count >= followsTimes //和关注数
      let matchStep2 = parseInt((timestamp - mtime) / 86400) <= lastLoginTime //限制上次登录
      let matchStep3 = item_count >= sellerGoodsCount //限制商品数
      let matchStep5 = is_seller == false
      let matchStep6 = rateCount >= commentsTimes //限制评价次数
      //   如果不过滤卖家
      if (!isFilterSeller) {
        return matchStep1 && matchStep2 && matchStep3 && matchStep6
      } else {
        return (
          matchStep1 && matchStep2 && matchStep3 && matchStep5 && matchStep6
        )
      }
    },

    validate() {
      let validQueue = []
      Object.keys(this.filterParams).forEach((key) => {
        const exclude = ['isFilterSeller', 'sellerGoodsCount']
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
    },
  },
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
.text-center {
  text-align: center;
}
.seller-erp-fixed-right {
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999999999;
  .icon-toggle {
    width: 60px;
    height: 60px;
    cursor: pointer;
    position: fixed;
    top: 55%;
    right: 20px;
    z-index: 8;
  }
  .drawer-wrap {
    width: 100%;
    background: #fff;
    height: 100vh;
    position: fixed;

    .follow-panel {
      //   height: auto;
      min-height: 100vh;
      overflow-x: hidden;
      overflow-y: auto;
      width: 100%;
      li {
        list-style: none;
        padding-left: 20px;
        a {
          width: 40%;
          line-height: 25px;
          color: #ee4d2d;
          margin-right: 50px;
        }
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
      .info-item {
        p {
          font-weight: bold;
          font-size: 16px;
        }
        margin-bottom: 20px;
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
            input {
              border: none;
              border-bottom: 1px solid #000;
              outline: none;
              width: 80%;

              &.check-box {
                width: 20px;
              }
            }
            .error-info {
              position: absolute;
              bottom: -18px;
              left: 0;
              color: #f00;
              display: none;
              pointer-events: none;
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
        padding-left: 70px;
      }
    }
    .no-login-warning {
      position: absolute;
      top: 65px;
      right: 0;
      height: 100%;
      width: 100%;
      line-height: 30px;
      font-size: 16px;
      background: #ededed;
      padding: 12px;
      li {
        display: flex;
        justify-content: space-around;
        color: #ee4d2d;
        font-size: 14px;
      }
    }

    .count-info {
      position: fixed;
      bottom: 0;
      color: #ee4d2d;
    }
  }
}
</style>
