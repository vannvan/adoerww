<template>
  <div class="page-content">
    <div class="search-form-wrap">
      <Form ref="formData" :model="formData" inline :label-width="80">
        <FormItem prop="createdTime" label="记录时间">
          <DatePicker
            type="daterange"
            v-model="formData.createdTime"
            placeholder="埋点上传数据的时间"
            style="width:190px"
            clearable
          ></DatePicker>
        </FormItem>
        <FormItem prop="pagePath" label="页面路径">
          <Input v-model="formData.pagePath" style="width:190px" clearable>
          </Input>
        </FormItem>

        <FormItem prop="visiteTime" label="访问时间">
          <DatePicker
            type="daterange"
            v-model="formData.visiteTime"
            placeholder="页面的访问时间"
            style="width:190px"
            clearable
          ></DatePicker>
        </FormItem>

        <FormItem prop="userMobile" label="用户账号">
          <Input v-model="formData.userMobile" style="width:190px" clearable>
          </Input>
        </FormItem>
        <FormItem prop="userName" label="用户姓名">
          <Input v-model="formData.userName" style="width:190px" clearable>
          </Input>
        </FormItem>
        <FormItem prop="userAgent" label="设备信息">
          <Input
            v-model="formData.userAgent"
            style="width:190px"
            placeholder="浏览器userAgent"
            clearable
          >
          </Input>
        </FormItem>
        <!-- <FormItem prop="dpi" label="分辨率哈">
          <Select v-model="formData.dpi" style="width:190px" clearable>
            <Option
              v-for="item in dpiOptions"
              :value="item.value"
              :key="item.key"
              >{{ item.value }}</Option
            >
          </Select>
        </FormItem> -->
        <Button type="primary" @click="handleSearch()">搜索</Button>
      </Form>
    </div>
    <div class="table-wrap">
      <Table
        :columns="columns"
        :data="monitorData"
        :loading="loading"
        height="600"
      >
        <!-- 记录时间 -->
        <template slot-scope="{ row }" slot="createTimeSlot">
          {{ formatTime(row.created) }}
        </template>
        <!-- 访问页面时间 -->
        <template slot-scope="{ row }" slot="pageInfoSlot">
          <p>
            {{ formatTime(row.pageInfo.entryTime) }}
          </p>
          <p>
            {{ formatTime(row.pageInfo.leaveTime) }}
          </p>
        </template>
        <!-- 设备信息 -->
        <template slot-scope="{ row }" slot="uaInfoSlot">
          <p>
            userAgent:
            <Tooltip
              :content="row.uaInfo.userAgent"
              :transfer="true"
              max-width="300"
            >
              {{ row.uaInfo.userAgent.substr(0, 8) }}
            </Tooltip>
          </p>
          <p>分辨率:{{ row.uaInfo.dpiWidth }}*{{ row.uaInfo.dpiHeight }}</p>
        </template>
        <!-- 用户信息 -->
        <template slot-scope="{ row }" slot="userInfoSlot">
          <p>用户姓名:{{ row.userInfo.userName }}</p>
          <p>用户账号:{{ row.userInfo.userMobile }}</p>
        </template>
        <!-- 事件信息 -->
        <template slot-scope="{ row }" slot="eventInfoSlot">
          <div v-if="row.eventData.length">
            <p v-for="(item, index) in row.eventData" :key="index">
              <Tag checkable color="primary"
                >{{ item.innerText }} : {{ formatTime(item.clickTime) }}</Tag
              >
            </p>
          </div>
          <div v-else>无操作</div>
        </template>
      </Table>
    </div>
    <div class="page-wrap">
      <Page
        :total="page.total"
        show-sizer
        show-total
        @on-change="changePage"
        :page-size="page.pageSize"
      />
    </div>
  </div>
</template>

<script>
import Monitor from '@/api/monitor.js'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      loading: false,
      formData: {
        createdTime: [],
        visiteTime: [],
        userMobile: null,
        userName: null,
        pagePath: null,
        dpi: ''
      },
      columns: [
        {
          title: '记录时间',
          slot: 'createTimeSlot'
        },
        {
          title: '页面',
          key: 'path'
        },
        {
          title: '访问时间',
          slot: 'pageInfoSlot'
        },
        {
          title: '设备信息',
          slot: 'uaInfoSlot'
        },
        {
          title: '用户信息',
          slot: 'userInfoSlot'
        },
        {
          title: '操作行为',
          slot: 'eventInfoSlot'
        }
      ],
      monitorData: [],
      page: {
        total: null,
        current: 1,
        pageSize: 20
      },
      dpiOptions: [
        { key: 1, value: '600*1000' },
        {
          key: 2,
          value: '600*1900'
        }
      ]
    }
  },
  computed: {
    formatTime() {
      return (time) => {
        return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },

  mounted() {
    this.getMonitorData()
  },

  methods: {
    handleSearch() {
      let {
        createdTime,
        visiteTime,
        pagePath,
        userName,
        userMobile,
        userAgent,
        dpi
      } = this.formData
      let params = {
        createdStartTime: createdTime[0]
          ? dayjs(createdTime[0]).format('YYYY-MM-DD')
          : null,
        createEndTime: createdTime[1]
          ? dayjs(createdTime[1]).format('YYYY-MM-DD')
          : null,
        pageEntryTime: visiteTime[0]
          ? dayjs(visiteTime[0]).format('YYYY-MM-DD')
          : null,
        pageLeaveTime: visiteTime[1]
          ? dayjs(visiteTime[1]).format('YYYY-MM-DD')
          : null,
        path: pagePath,
        userName,
        userMobile,
        userAgent,
        dpiWidth: dpi ? dpi.split('*')[0] : null,
        dpiHeight: dpi ? dpi.split('*')[1] : null
      }
      this.getMonitorData(params)
    },

    getMonitorData(searchParams = {}) {
      this.loading = true
      let params = Object.assign(searchParams, {
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      })

      Monitor.getMonitorPage(params).then((res) => {
        let { data, total } = res
        this.page.total = total
        this.monitorData = data
        this.loading = false
      })
    },

    changePage(index) {
      this.page.current = index
      this.getMonitorData()
    }
  }
}
</script>

<style lang="scss">
.table-wrap {
  margin: 16px 10px;
  height: 600px;
}
.page-wrap {
  margin: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
