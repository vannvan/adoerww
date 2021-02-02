<template>
  <div id="emalaccaHistoryData" v-if="dataIsExit">
    <div class="data-content">
      <div class="left">
        <p>
          类目
          <span v-for="(item, index) in goodsInfo.categories" :key="item.catid"
            >{{ item.display_name }}
            <i v-show="index < goodsInfo.categories.length - 1">> </i></span
          >
        </p>
        <p style="height:45px;line-height:45px">
          商品规格历史销量数据
        </p>
        <div class="spec-sales-list overflow-y">
          <template v-if="getGoodModels(goodsInfo).length > 0">
            <li v-for="item in getGoodModels(goodsInfo)" :key="item.modelid">
              <span class="name">
                {{ item.name }}
              </span>
              <span class="value">{{ item.sold }}</span>
            </li>
          </template>
          <template v-else>
            <div class="empty-date">
              未获取到数据
            </div>
          </template>
        </div>
      </div>
      <div class="right">
        <p>
          商品历史数据
        </p>
        <div class="count-panel">
          <div class="item">
            <b>上架时间</b>
            <span>{{ formatDate(goodsInfo.ctime) }}</span>
          </div>
          <div class="item">
            <b>总销量</b>
            <span>{{ goodsInfo.sold }}</span>
          </div>
          <div class="item">
            <b>访问量</b>
            <span>{{ goodsInfo.view_count }}</span>
          </div>
          <div class="item">
            <b>转化率</b>
            <span>{{ conversionRate(goodsInfo) }}</span>
          </div>
        </div>
        <div class="time-action">
          <DatePicker
            type="daterange"
            :options="options2"
            placement="bottom-end"
            placeholder="Select date"
            style="width: 200px"
            @on-change="handleChangeDate"
            v-model="dateRange"
          ></DatePicker>
        </div>
        <div class="charts-content" ref="SaleCharts"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from '@/lib/echarts'
import History from '@/inject/history-data'
import dayjs from 'dayjs'
import { division } from '@/lib/utils'
import { ERROR } from '../lib/conf'
export default {
  data() {
    return {
      dataIsExit: false, //是否有数据
      goodsInfo: {}, //商品详情
      dateRange: [], //时间范围
      options2: {
        shortcuts: [
          {
            text: '1 week',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            }
          },
          {
            text: '1 month',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            }
          },
          {
            text: '3 months',
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            }
          }
        ],
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  computed: {
    formatDate() {
      return date => {
        return typeof date == 'number' ? dayjs(date * 1000).format('YYYY-MM-DD') : ''
      }
    },

    //转化率
    conversionRate() {
      return goodsInfo => {
        let { view_count = 0, sold = 0 } = goodsInfo
        return (division(sold, view_count) * 100).toFixed(2) + '%'
      }
    },

    //获取商品规格
    getGoodModels() {
      return goodsInfo => {
        return goodsInfo.models ? goodsInfo.models : []
      }
    }
  },
  mounted() {
    this.getGoodDetailInfo()
    this.dateRange = [new Date(dayjs().subtract(30, 'day')), new Date()]
    this.handleChangeDate()
  },
  methods: {
    handleChangeDate() {
      let [startTime, endTime] = this.dateRange
      let beginDateTime = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')
      let endDateTime = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')
      this.getDynamicPrices({ beginDateTime: beginDateTime, endDateTime: endDateTime })
    },

    //获取商品详情
    getGoodDetailInfo() {
      History.getGoodDetailInfo().then(res => {
        if (res && res.result) {
          this.goodsInfo = res.result.item
        } else {
          this.$Notice.error({
            content: ERROR.failedToGetShopeeData
          })
        }
      })
    },

    //获取价格数list
    getDynamicPrices({ beginDateTime, endDateTime }) {
      History.getDynamicPrices({
        beginDateTime: beginDateTime,
        endDateTime: endDateTime
      }).then(res => {
        if (res && res.result) {
          this.dataIsExit = true
          this.$nextTick(() => {
            this.drawCharts(res.result.data)
            $('.page-product__shop').css({ 'box-sizing': 'content-box' })
          })
        } else {
          this.dataIsExit = false
        }
      })
    },

    drawCharts(source = []) {
      if (source.length == 0) return
      let priceList = source.map(el => el.minPrice)
      let daySalesList = source.map(el => el.daySales)
      let dateList = source.map(el => el.gmtDate)
      let charts = echarts.init(this.$refs.SaleCharts)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              show: true,
              backgroundColor: '#fff',
              color: '#556677',
              borderColor: 'rgba(0,0,0,0)',
              shadowColor: 'rgba(0,0,0,0)',
              shadowOffsetY: 0
            },
            lineStyle: {
              width: 0
            }
          },
          backgroundColor: '#fff',
          color: '#5c6c7c',
          padding: [10, 10],
          extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
        },
        legend: {
          icon: 'circle',
          top: '5%',
          right: '48%',
          itemWidth: 6,
          itemGap: 20,
          color: '#556677'
        },
        xAxis: {
          type: 'category',
          data: dateList
        },
        yAxis: [
          {
            name: '销量/件',
            type: 'value',
            minInterval: 1,
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DCE2E8'
              }
            },
            axisLabel: {
              color: '#556677'
            },
            splitLine: {
              show: false
            }
          },
          {
            name: '价格',
            type: 'value',
            position: 'right',
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#556677',
              formatter: '{value}'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DCE2E8'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '销量',
            yAxisIndex: 0,
            data: daySalesList,
            type: 'line',
            showSymbol: false
          },
          {
            name: '价格',
            yAxisIndex: 1,
            data: priceList,
            type: 'line',
            showSymbol: false,
            itemStyle: {
              color: '#f1c40f'
            }
          }
        ]
      }
      charts.setOption(option)
    }
  }
}
</script>

<style lang="less"></style>
