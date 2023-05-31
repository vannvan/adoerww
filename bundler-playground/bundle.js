;(function (modules) {
  const require = (id) => {
    const { factory, map } = modules[id]
    const localRequire = (requireDeclarationName) => require(map[requireDeclarationName])
    const module = { exports: {} }
    factory(module.exports, localRequire)
    return module.exports
  }
  require(0)
})({
  0: {
    factory: (exports, require) => {
      'use strict'

      var _module = _interopRequireDefault(require('./lib/module1.js'))
      var _module2 = _interopRequireDefault(require('./lib/module2.js'))
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj }
      }
      console.log('hello world')
      console.log(''.concat(_module['default'], ' - ').concat(_module2['default']))
    },
    map: { './lib/module1.js': 1, './lib/module2.js': 2 },
  },
  1: {
    factory: (exports, require) => {
      'use strict'

      Object.defineProperty(exports, '__esModule', {
        value: true,
      })
      exports['default'] = void 0
      var name = 'Bob'
      var _default = name
      exports['default'] = _default
    },
    map: {},
  },
  2: {
    factory: (exports, require) => {
      'use strict'

      Object.defineProperty(exports, '__esModule', {
        value: true,
      })
      exports['default'] = void 0
      var age = 22
      var _default = age
      exports['default'] = _default
    },
    map: {},
  },
})
