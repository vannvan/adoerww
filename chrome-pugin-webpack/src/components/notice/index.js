import Vue from 'vue'
import Notice from './notice.vue'

const NotificationConstructor = Vue.extend(Notice)

let instance
let instances = []
let name = 1

const defaults = {
  visible: false,
  title: undefined,
  content: undefined,
  duration: 4500,
  type: null,
  iconType: null,
  name: 0,
  closable: true,
}

const typeMap = {
  info: 'icon-info',
  error: 'icon-heart-broken',
  warning: 'icon-stopwatch',
  success: 'icon-checkmark-outline',
}

const Notification = (options = {}) => {
  if (Vue.prototype.$isServer) return
  options = Object.assign({}, defaults, options)
  const position = options.position || 'top-right'
  const userOnClose = options.onClose
  const id = 'notification_' + name++

  options.onClose = function() {
    Notification.close(id, userOnClose)
  }

  let instance = new NotificationConstructor({
    el: document.createElement('div'),
    data: options,
  })

  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.iconType = typeMap[instance.type]
  instance.visible = true
  instance.name = id
  instance.dom = instance.$el
  console.log(instance)

  setTimeout(function() {
    let verticalOffset = options.offset || 0
    instances
      .filter((item) => item.position === position)
      .forEach((item) => {
        verticalOffset += item.$el.offsetHeight + 16
      })
    verticalOffset += 16
    instance.verticalOffset = verticalOffset
    instances.push(instance)
  }, 10)
  // console.log(instances)
  return instance
}

Object.keys(typeMap).forEach((key) => {
  Notification[key] = (options) => {
    if (typeof options === 'string') {
      options = {
        content: options,
      }
    }
    // console.log(options)
    options.type = key
    return Notification(options)
  }
})

Notification.close = function(id, userOnClose) {
  let index = -1
  const len = instances.length
  const instance = instances.filter((instance, i) => {
    if (instance.name === id) {
      // console.log(id)
      index = i
      return true
    }
    return false
  })[0]
  if (!instance) return

  if (typeof userOnClose === 'function') {
    userOnClose(instance)
  }
  instances.splice(index, 1)
  if (len <= 1) return
  const position = instance.position
  let removedHeight = instance.$el.offsetHeight
  for (let i = index; i < len - 1; i++) {
    if (instances[i].position === position) {
      instances[i].verticalOffset =
        instances[i].verticalOffset - removedHeight - 16
    }
  }
}

export default Notification
