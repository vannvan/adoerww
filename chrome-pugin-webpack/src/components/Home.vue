<template>
  <div class="seller-erp-fixed-right">
    <img
      class="icon-toggle"
      src="@/assets/icon/fengche.png"
      @click="display = true"
    />
    <div class="drawer-wrap">
      <drawer
        title="卖旺ERP插件@1.0.2"
        :display.sync="display"
        :inner="true"
        :width="drawerWidth"
        :mask="false"
      >
        <div class="follow-panel">
          <div class="tab-wrap">
            <span
              class="tab-item"
              @click="currentTab = 1"
              :class="{ active: currentTab == 1 }"
              >粉丝关注</span
            >
            <span
              class="tab-item"
              @click="currentTab = 2"
              :class="{ active: currentTab == 2 }"
              >自动取关</span
            >
          </div>
          <!-- 关注 -->
          <template v-if="currentTab == 1">
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
                      v-enterNumberMax="100"
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
                      v-enterNumberMax="100"
                      v-enterNumberMin="0"
                    />
                    <small class="error-info" ref="limitFollowNumber"
                      >请输入关注数量</small
                    >
                  </span>
                </li>
                <li>
                  <span class="sub-item">上次登录时间</span>
                  <span class="sub-item">评价次数</span>
                </li>
                <li>
                  <span class="sub-item">
                    <input
                      type="number"
                      placeholder="<=30天"
                      v-model="filterParams.lastLoginTime"
                      v-enterNumberMax="30"
                      v-enterNumberMin="0"
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
                      v-enterNumberMin="0"
                    />
                    <small class="error-info" ref="commentsTimes"
                      >请输入评价次数
                    </small>
                  </span>
                </li>
                <li>
                  <span class="sub-item">关注数</span>
                </li>
                <li>
                  <span class="sub-item">
                    <input
                      type="number"
                      placeholder=">=0次"
                      v-model="filterParams.followsTimes"
                      v-enterNumberMin="0"
                    />
                    <small class="error-info" ref="followsTimes"
                      >请输入关注数
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
                @click="handleStart()"
                :style="{ background: isRequest ? '#27ae60' : '#ee4d2d' }"
              >
                {{ buttonText }}
              </button>
            </div>
            <!-- 显示区域 -->
            <p style="color:#f00" class="text-center" v-if="isRequest">
              请勿关闭本页面
            </p>
            <div class="show-result-count" v-if="isRequest">
              <div class="count-item success">
                <p>成功</p>
                <p>{{ resultCount.success }}</p>
              </div>
              <div class="count-item fail">
                <p>失败</p>
                <p>{{ resultCount.fail }}</p>
              </div>
              <div class="count-item skip">
                <p>条国</p>
                <p>{{ resultCount.skip }}</p>
              </div>
            </div>
            <div
              class="show-result-list overflow-y"
              id="ResultContent"
              v-if="isRequest"
            ></div>
            <p class="count-info">当前页面可见粉丝数：{{ countFollowers }}</p>
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
                  <span class="sub-item">取消关注(450)</span>
                </li>
                <li>
                  <span class="sub-item">
                    <input type="number" placeholder="取消关注的数量" />
                  </span>
                </li>
              </div>
              <div class="footer-action-wrap">
                <button
                  @click="handleCancelFollow()"
                  :style="{ background: isRequest ? '#27ae60' : '#ee4d2d' }"
                >
                  {{ button2Text }}
                </button>
              </div>
            </div>
          </template>
        </div>
      </drawer>
    </div>
  </div>
</template>

<script>
import Drawer from './Drawer'
import Follow from '@/inject/follow-content'
import $$ from 'jquery'
function getTime() {
  return new Date().toTimeString().substring(0, 8)
}
export default {
  components: {
    Drawer,
  },
  data() {
    return {
      display: true,
      drawerWidth: '400px',
      currentTab: 1,
      //   筛选参数
      filterParams: {
        startIndex: 1, //自动开始位置
        limitFollowNumber: 1, //自动关注数量
        lastLoginTime: 1, //上次登录时间
        commentsTimes: 1, //评价次数
        followsTimes: 1, //关注数
        isFilterSeller: false, //是否过滤卖家
        sellerGoodsCount: null, //卖家商品数
      },
      buttonText: '开启关注',
      button2Text: '开启取关',
      countFollowers: null, //当前页面粉丝数
      storeInfo: {
        account: {},
      }, //店铺信息
      resultCount: {
        success: 0,
        fail: 0,
        skip: 0,
      },
      isRequest: false,
      globalTimer: null,
      usernameQueue: [],
      currentUserName: null,
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
            input.value = 1
          }
          trigger(input, 'input')
        })
      },
    },
  },
  mounted() {
    let _this = this
    let { pathname } = window.location
    if (/followers/.test(pathname)) {
      let storeId = pathname.split('/')[2]
      Follow.getStoreInfoById(storeId).then((res) => {
        this.storeInfo = res.result.data
        console.log(this.storeInfo)
      })
    }
    _this.scrollTo()

    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.countFollowers = $$('.clickable_area').length
    },
    scrollTo() {
      let limit = 500
      let timer = setInterval(() => {
        window.scrollTo(0, limit)
        limit += 1000
        if (limit > 5000) {
          clearTimeout(timer)
        }
      }, limit)
    },
    //开始关注
    handleStart() {
      if (this.isRequest) {
        this.handleCancel()
        return
      }
      if (!this.validate()) return
      let userNameList = []
      $$('.down a').each(function() {
        userNameList.push($$(this).attr('username'))
      })
      this.usernameQueue = userNameList
      //   console.log(usernameQueue)
      this.isRequest = true
      this.buttonText = '正在运行中，点击可取消'
      this.getStoreFollowers()
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

    //关注请求
    getStoreFollowers() {
      this.globalTimer = setInterval(() => {
        this.currentUserName = this.usernameQueue.splice(0, 1)
        Follow.getStoreFollowers(this.currentUserName).then((res) => {
          console.log(res)
          let { name } = res.result.data
          let htmlStr = `<li>[${getTime()}] ${name}开始关注</li>`
          $$('#ResultContent').append(htmlStr)
        })
      }, 3000)
    },

    //取消关注
    handleCancelFollow() {
      //
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
      margin: 0 auto;
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
      height: 600px;
      width: 100%;
      margin-top: 12px;
      li {
        line-height: 30px;
        text-align: center;
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
