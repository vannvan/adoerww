const path = require('path')
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = function(plop) {
  plop.setGenerator('test', {
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: '组件类型?',
        choices: [
          { name: '基础组件', value: 'basic' },
          { name: '业务组件', value: 'business' }
        ]
      },
      {
        type: 'input',
        name: 'name',
        message: '组件名称?'
      }
    ],
    actions: function(data) {
      var actions = []
      const { type, name } = data
      if (!name) {
        console.error('请输入组件名称')
        process.exit(1)
      }
      if (type == 'basic') {
        actions.push(
          {
            type: 'add',
            path: resolve('src/packages/{{ properCase name }}/index.vue'),
            templateFile: './plop-templates/BasicComponent.vue.hbs'
          },
          {
            type: 'add',
            path: resolve('src/packages/{{ properCase name }}/index.js'),
            templateFile: './plop-templates/BasicComponent.js.hbs'
          }
        )
      } else {
        actions.push({
          type: 'add',
          path: resolve('src/components/{{ properCase name }}/index.vue'),
          templateFile: './plop-templates/BusinessComponent.vue.hbs'
        })
      }

      return actions
    }
  })
}
