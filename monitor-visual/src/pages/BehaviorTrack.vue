<template>
  <div class="content-wrap behabior-wrap">
    <div class="left-user-list">
      <List>
        <ListItem v-for="item in memberList" :key="item.maAccount">
          <ListItemMeta
            avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar"
            :title="item.maAccount"
            :description="'最后记录时间:' + formatTime(item.updateTime)"
          />
          <template slot="action">
            <li>
              <a @click="filterSomeone(item.maAccount)">查看</a>
            </li>
          </template>
        </ListItem>
      </List>
    </div>
    <div class="right-records-list">
      <p>默认追踪最近200条记录</p>
      <Timeline>
        <TimelineItem v-for="(item, index) in currentUserRecords" :key="index">
          <p class="time">
            访问时间 : {{ formatTime(item.pageInfo.entryTime) }} 离开时间 :
            {{ formatTime(item.pageInfo.leaveTime) }} 逗留时长 :
            {{
              division(item.pageInfo.leaveTime - item.pageInfo.entryTime, 60) +
                's'
            }}
          </p>
          <p class="content">访问页面 : {{ item.path }}</p>
        </TimelineItem></Timeline
      >
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import Monitor from '@/api/monitor.js'
import { division } from '@/utils'

export default {
  data() {
    return {
      allRecordsList: [],
      memberList: [],
      recordsList: [],
      currentUserAccount: null,
      currentUserRecords: [],
      deviceInfo: {} //还没想好怎么显示
    }
  },

  computed: {
    formatTime() {
      return (time) => {
        return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    division() {
      return (a, b) => {
        return division(a, b).toFixed(2)
      }
    }
  },

  async mounted() {
    let maAccount = await this.getMemberPage()
    this.getRecordsList(maAccount)
  },

  methods: {
    getMemberPage() {
      return new Promise((resolve, reject) => {
        Monitor.getMemberPage()
          .then(({ data }) => {
            this.memberList = data
            this.currentUserAccount = data[0].maAccount
            resolve(data[0].maAccount)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    getRecordsList() {
      let params = {
        createEndTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        maAccount: this.currentUserAccount
      }
      Monitor.getMonitorList(params).then(({ data }) => {
        this.currentUserRecords = data
        this.deviceInfo = data[0].uaInfo
      })
    },

    filterSomeone(maAccount) {
      this.currentUserAccount = maAccount
      this.getRecordsList()
    }
  }
}
</script>

<style lang="scss" scoped>
.behabior-wrap {
  height: calc(100vh - 120px);
}
.content-wrap {
  display: flex;
  justify-content: space-between;

  .left-user-list {
    width: 400px;
    background: #fff;
    height: 100%;
    overflow-y: auto;
    margin-right: 12px;
    border-right: 5px solid #ededed;
    padding: 12px;
    box-sizing: border-box;
  }
  .right-records-list {
    flex: 1;
    padding: 12px;
    height: 100%;
    overflow-y: auto;
    .equipment-info {
      height: 200px;
    }
  }
}
</style>
