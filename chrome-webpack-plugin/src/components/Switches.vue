<template>
  <label class="layui-input-block">
    <input class="switch-component" type="checkbox" :checked="value" @change="trigger"/>
    <div class="layui-unselect layui-form-switch" :class="value ? 'layui-form-onswitch' : ''">
      <em>{{!value ? textEnabled : textDisabled}}</em>
			<i></i>
    </div>
  </label>
</template>

<script>
export default {
  name: 'Switches',

  props: {
    value: {
      default: false,
    },
		textEnabled: {
			default: ''
		},

		textDisabled: {
			default: ''
		},
  },
  mounted() {

	},

  methods: {
		trigger (e) {
			this.$emit('input', e.target.checked)
		}
  },

}
</script>

<style lang="less">
.layui-input-block {
  position: relative;
  min-height: 24px;
	width: 70px;
	box-sizing: border-box;
  display: inline-block;
}
.switch-component {
  display: none;
}

.layui-form-switch {
  position: relative;
  height: 22px;
  line-height: 22px;
  min-width: 35px;
  padding: 0 8px;
  border: 1px solid #d2d2d2;
  border-radius: 20px;
  cursor: pointer;
  background-color: #9B9B9B;
  -webkit-transition: 0.1s linear;
  transition: 0.1s linear;
  display: inline-block;
  vertical-align: middle;
  i {
    position: absolute;
    left: 5px;
    top: 3px;
    width: 16px;
    height: 16px;
    border-radius: 20px;
    background-color: #fff;
    -webkit-transition: 0.1s linear;
    transition: 0.1s linear;
  }
  em {
    position: relative;
    top: 0;
    width: 25px;
    margin-left: 21px;
		margin-right: 5px;
    padding: 0 !important;
    text-align: center !important;
    color: #fff !important;
    font-style: normal !important;
    font-size: 12px;
  }
}

.layui-form-switch.layui-form-onswitch {
  border-color: #ff720d;
  background-color: #ff720d;
  em {
    margin-left: 5px;
    margin-right: 21px;
    color: #fff !important;
  }
  i {
    left: 100%;
    margin-left: -21px;
    background-color: #fff;
  }
}
</style>
