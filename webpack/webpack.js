const fs = require('fs')
const path = require('path')  // fs path 好基友
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default //用es6 导出的. 用befault方法
const babel = require('@babel/core')

console.log('webpack...')
// babel 的编译流程分为三步：parse、transform、generate
// 获取单个模块的信息
function getModuleInfo(file){
    const body = fs.readFileSync(file,"utf-8") //读取文件
    // parse
    const ast = parser.parse(body,{
      sourceType:"module"  // 表示我们要解释是 es模块
    })

    // 收集依赖
    const deps = {}
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
// node webpack.js 执行

//  分析多个模块,生成模块依赖图
function parseModules(file){
    const entry = getModuleInfo(file)
    const temp = [entry]
    // console.log('temp--->',temp)
    const depsGraph = {}  // 依赖关系图
    
    // 递归收集所有的依赖
    getDeps(temp, entry);

    temp.forEach((moduleInfo) => {
      depsGraph[moduleInfo.file] = {
        deps: moduleInfo.deps,
        code: moduleInfo.code,
      };
    });
    console.log('depsGraph--->',depsGraph)
    return depsGraph;
}

/**
 * @description 获取依赖
 * @param {*} temp 
 * @param {*} param1 
 */
 function getDeps(temp, { deps }) {
   console.log('deps-->',deps)
  Object.keys(deps).forEach((key) => {
    const child = getModuleInfo(deps[key]);
    temp.push(child);
    getDeps(temp, child);
  });
}

// 收集完所有的依赖后 生成 --> bundle 
function bundle(file) {
  const depsGraphObj = parseModules(file)
  console.log('depsGraphObj',depsGraphObj)
  const depsGraph = JSON.stringify(depsGraphObj);
  console.log(depsGraph,'depsGraph')
  return `(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require,exports,code) {
                eval(code)
            })(absRequire,exports,graph[file].code)
            return exports
        }
        require('${file}')
    })(${depsGraph})`;
}

const content = bundle('./src/index.js')

!fs.existsSync("./dist") && fs.mkdirSync("./dist");
fs.writeFileSync("./dist/bundle.js", content);
