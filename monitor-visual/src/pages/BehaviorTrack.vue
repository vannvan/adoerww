<template>
  <div class="content-wrap behabior-wrap">
    <div class="left-user-list">
      <List>
        <ListItem v-for="item in userList" :key="item.maAccount">
          <ListItemMeta
            avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar"
            :title="item.maAccount"
            :description="'最后登录时间:' + item.lastLoginTime"
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
      <Timeline>
        <TimelineItem v-for="(item, index) in currentUserRecords" :key="index">
          <p class="time">
            访问时间 : {{ formatTime(item.pageInfo.entryTime) }} 离开时间 :
            {{ formatTime(item.pageInfo.leaveTime) }} 停留时间 :
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
const uniqueElementsBy = (arr, fn) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x) => fn(v, x))) acc.push(v)
    return acc
  }, [])
import { division } from '@/utils'

export default {
  data() {
    return {
      allRecordsList: [],
      userList: [],
      recordsList: [],
      currentUserAccount: null,
      currentUserRecords: []
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

  mounted() {
    this.getRecordsList()
  },

  methods: {
    getRecordsList() {
      let params = {
        createEndTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        maAccount: this.currentUserAccount
      }
      Monitor.getMonitorList(params).then((res) => {
        console.log(res)
        let { data } = res
        this.currentUserAccount = data[0].userInfo.maAccount
        this.currentUserRecords = data
        this.userList = uniqueElementsBy(
          data.map((el) => el.userInfo),
          (a, b) => a.maAccount == b.maAccount
        )
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
    width: 280px;
    background: #fff;
    height: 100%;
    overflow-y: auto;
  }
  .right-records-list {
    flex: 1;
    padding: 12px;
    height: 100%;
    overflow-y: auto;
  }
}
</style>
