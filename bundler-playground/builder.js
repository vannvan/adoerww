const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')
const resolve = require('resolve').sync

const { entry, output } = require('./config')

class Builder {
  constructor({ entry, output }) {
    this.entry = entry
    this.output = output
    this.startId = 0
  }

  start() {
    const content = this.pack(this.createDependencyGraph(this.entry))
    fs.writeFile(this.output, content, (err) => {
      if (!err) {
        console.log('打包完成')
      }
    })
  }

  /**
   * 生成依赖模块
   * @param {*} filePath
   * @returns
   */
  createModuleInfo(filePath) {
    // 读取模块源代码
    const content = fs.readFileSync(filePath, 'utf-8')
    // 对源代码进行 AST 产出
    const ast = parser.parse(content, {
      sourceType: 'module',
    })
    // 相关模块依赖数组
    const deps = []
    // 遍历模块 AST，将依赖推入 deps 数组中
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        deps.push(node.source.value)
      },
    })
    const id = this.startId++
    // 编译为 ES5
    const { code } = babel.transformFromAstSync(ast, null, {
      presets: ['@babel/preset-env'],
    })
    return {
      id,
      filePath,
      deps,
      code,
    }
  }

  /**
   * 生成依赖树
   * @param {*} entry
   * @returns
   */
  createDependencyGraph(entry) {
    // 获取模块信息
    const entryInfo = this.createModuleInfo(entry)

    // 项目依赖树
    const graphArr = []
    graphArr.push(entryInfo)
    // 以入口模块为起点，遍历整个项目依赖的模块，并将每个模块信息维护到 graphArr 中
    for (const module of graphArr) {
      module.map = {}
      module.deps.forEach((depPath) => {
        const baseDir = path.dirname(module.filePath)
        const moduleDepPath = resolve(depPath, { baseDir })
        const moduleInfo = this.createModuleInfo(moduleDepPath)
        graphArr.push(moduleInfo)
        module.map[depPath] = moduleInfo.id
      })
    }
    return graphArr
  }

  /**
   * 执行打包
   * @param {*} graph
   * @returns
   */
  pack(graph) {
    const moduleArgArr = graph.map((module) => {
      return `${module.id}: {
            factory: (exports, require) => {
                ${module.code}
            },
            map: ${JSON.stringify(module.map)}
        }`
    })

    // 下面require(0)指的就是入口
    const iifeBundler = `(function(modules){
        const require = id => {
            const {factory, map} = modules[id];
            const localRequire = requireDeclarationName => require(map[requireDeclarationName]); 
            const module = {exports: {}};
            factory(module.exports, localRequire); 
            return module.exports; 
        }
        require(0);
    })({${moduleArgArr.join()}})
`
    return iifeBundler
  }
}

const app = new Builder({
  entry,
  output,
})

app.start()
