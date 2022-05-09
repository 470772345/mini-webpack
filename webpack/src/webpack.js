const fs = require('fs')
const path = require('path')  // fs path 好基友
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default //用es6 导出的. 用befault方法
const babel = require('@babel/core')

console.log('webpack...')

function getModuleInfo(file){
    const body = fs.readFileSync(file,"utf-8") //读取文件
    // visitor 模式
    const ast = parser.parse(body,{
      sourceType:"module"  // 表示我们要解释是 es模块
    })

    // 收集依赖
    const deps = []
    traverse(ast,{
      ImportDeclaration({node}){
        console.log('node---',node)
        const dirname = path.dirname(file)

      }
    })
}
const info = getModuleInfo("./src/index.js");
console.log("info:", info);