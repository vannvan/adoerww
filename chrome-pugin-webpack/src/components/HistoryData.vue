<template>
  <div id="emalaccaHistoryData">
    <div class="data-content">
      <div class="left">
        商品历史数据
      </div>
      <div class="right">
        当月数据
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
#emalaccaHistoryData {
  -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  overflow: hidden;
  background: #fff;
  margin-top: 20px;
  .data-content {
    padding: 25px;
    background: #ccc;
    display: flex;
    justify-content: space-between;

    .left {
      margin-right: -25px;
      overflow: hidden;
      height: 346px;
      position: relative;
      flex: 1;
      flex-shrink: 0;
    }
    .right {
      flex: 1;
    }
  }
}
</style>
