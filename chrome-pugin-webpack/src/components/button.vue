<template>
  <button
    @click="$emit('click')"
    :disabled="disabled"
    :class="[
      prefixCls,
      prefixCls + '__' + type,
      prefixCls + '__' + type + '--' + size,
      { 'is-plain': plain, 'is-disabled': disabled, 'is-round': round },
    ]"
  >
    <i v-if="icon !== ''" :class="icon"></i>
    <span :class="[prefixCls + '__loading', type]" v-if="loading"></span>
    <slot></slot>
  </button>
</template>
<script>
const prefixCls = 'wui__button'
export default {
  name: 'WButton',
  props: {
    type: {
      type: String,
      default: 'default',
    },
    size: {
      type: String,
      default: 'default',
    },
    icon: {
      type: String,
      default: '',
    },
    plain: Boolean,
    disabled: Boolean,
    round: Boolean,
    loading: Boolean,
  },
  data() {
    return {
      prefixCls: prefixCls,
    }
  },
}
</script>
