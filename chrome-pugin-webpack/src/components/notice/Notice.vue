<template>
  <transition name="notice-fade">
    <div
      class="wui__notice"
      :class="[prefixCls + '__box']"
      :style="positionStyle"
      v-if="visible"
    >
      <span
        :class="[prefixCls + '__icon--' + type, iconType]"
        v-show="iconType"
      ></span>
      <div :class="[prefixCls + '__content']">
        <h3 :class="[prefixCls + '__content--title', type]" v-if="title">
          {{ title }}
        </h3>
        <div :class="[prefixCls + '__content--body']" v-html="content"></div>
      </div>
      <!-- <i class="icon-close" @click.stop="close()" v-if="closable"></i> -->
    </div>
  </transition>
</template>

<script>
const prefixCls = 'wui__notice'
export default {
  name: 'WNotice',
  data() {
    return {
      prefixCls: prefixCls,
      verticalOffset: 0,
      timer: null,
      closed: false,
      position: 'top-right',
    }
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false
        this.$el.addEventListener('transitionend', this.destroyElement)
      }
    },
  },
  computed: {
    verticalProperty() {
      return /^top-/.test(this.position) ? 'top' : 'bottom'
    },
    positionStyle() {
      return {
        [this.verticalProperty]: `${this.verticalOffset}px`,
      }
    },
  },
  mounted() {
    // if closable is false means it's can't close ,set duration = 0
    if (!this.closable) {
      this.duration = 0
    }
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        if (!this.closed) {
          this.close()
        }
      }, this.duration)
    }
  },
  methods: {
    destroyElement() {
      this.$el.removeEventListener('transitionend', this.destroyElement)
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    close() {
      this.closed = true
      if (typeof this.onClose === 'function') {
        this.onClose()
      }
    },
  },
}
</script>

<style lang="scss"></style>
