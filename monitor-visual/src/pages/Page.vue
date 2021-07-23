<template>
  <div class="page-analysis-page page-content">
    <div class="tree-wrap">
      <Tree :data="erpMenuList" @on-select-change="handleCheckNode"> </Tree>
    </div>
    <div class="data-wrap">
      {{ pageEventData }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Monitor from '@/api/monitor.js'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      pageEventData: []
    }
  },

  computed: {
    ...mapState({
      erpMenuList: (state) => state.user.menuList
    })
  },

  mounted() {},

  methods: {
    handleCheckNode(node) {
      const { href } = node[0]
      href && this.getPageMonitor(href)
    },

    getPageMonitor(href) {
      let params = {
        path: href,
        createdStartTime: 0,
        createEndTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
      Monitor.getMonitorList(params).then((res) => {
        let eventData = res.data.map((el) => el.eventData)
        this.pageEventData = eventData
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-analysis-page {
  display: flex;
  .tree-wrap {
    width: 280px;
    height: 100%;
    overflow-y: auto;
  }
  .data-wrap {
    flex: 1;
    background: #ededed;
  }
}
</style>
