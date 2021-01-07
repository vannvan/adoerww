// Copyright (c) 2019 by https://github.com/vannvan.
// All Rights Reserved.

import WNotice from './notice/index'

const components = []

const install = function(Vue, opts = {}) {
  if (install.installed) return
  components.map((component) => Vue.component(component.name, component))
  Vue.prototype.$Notice = WNotice
  Vue.prototype.$WUI = {
    transfer: 'transfer' in opts ? opts.transfer : '',
    modal: {
      maskClosable: opts.modal
        ? 'maskClosable' in opts.modal
          ? opts.modal.maskClosable
          : ''
        : '',
    },
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  WNotice,
}
