const fs = require('fs')
const path = require('path')  // fs path 好基友
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default //用es6 导出的. 用befault方法
const babel = require('@babel/core')

console.log('webpack...')
// babel 的编译流程分为三步：parse、transform、generate
function getModuleInfo(file){
    const body = fs.readFileSync(file,"utf-8") //读取文件
    // parse
    const ast = parser.parse(body,{
      sourceType:"module"  // 表示我们要解释是 es模块
    })

    // 收集依赖
    const deps = []
    // function traverse(parent, opts)  parent 指定要遍历的 AST 节点，opts 指定 visitor 函数
    traverse(ast,{
      ImportDeclaration({node}){
        const dirname = path.dirname(file)
        // console.log(dirname) // .src
        // path.join path.resolve 用法 https://blog.csdn.net/weixin_44138611/article/details/91352299
        let abspath = "./" + path.join(dirname, node.source.value);
        // windows 是斜杠 转换下
        abspath = abspath.replace("\\",'/');
        console.log(abspath);
        deps[node.source.value] = abspath;
      }
    })
    
    // ES6转成ES5
    const { code } = babel.transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    }); // => { code, map, ast }
    
    const moduleInfo = { file, deps, code };
    return moduleInfo;

}
const info = getModuleInfo("./src/index.js");
console.log("info:", info);