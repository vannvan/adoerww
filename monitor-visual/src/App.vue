<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import Layout from '@/layout/Layout'
export default {
  components: {
    // Layout
  },
  mounted() {
    if (typeof window !== undefined && window._VV === undefined) {
      window._VV = this
    }
  }
}
</script>

<style lang="scss" scoped></style>
