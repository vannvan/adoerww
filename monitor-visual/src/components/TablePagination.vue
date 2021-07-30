<template>
  <div class="pagination-wrap">
    <Page
      :total="page.total"
      show-sizer
      show-total
      @on-change="changePage"
      :page-size="page.pageSize"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: {
        total: 0,
        pageSize: 20
      }
    }
  },

  props: {
    pageInfo: {
      type: Object,
      default: () => {}
    }
  },

  mounted() {
    this.page = this.pageInfo
  },

  methods: {
    changePage(index) {
      this.page.current = index
      this.$emit('on-change', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-wrap {
  margin: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
