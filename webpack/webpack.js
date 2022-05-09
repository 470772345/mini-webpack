
const fs = require('fs')
const path = require('path')  // fs path 好基友
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default //用es6 导出的. 用befault方法
const babel = require('@babel/core')
const { ESLint} = require('eslint')
// 强行集成 eslint 插件测试
// const engine =  new ESLint({
//    fix:true,
//    overrideConfig:{
//      parserOptions:{
//        ecmaFeatures: 6
//      },
//      rules:{
//        "my-brace-style": ["error"]
//      },
//    },
//    rulePaths:["d:\\Apro\\mini-webpack\\webpack\\plugins"], // __dirname--> "d:\\Apro\\mini-webpack\\webpack\\plugins"
//    useEslintrc:false
// });
// async function main(fileStr){
//   console.log('fileStr111-->',fileStr)
//   const results = await engine.lintText(fileStr);
//   console.log('results11->',results)
//   const formatter = await engine.loadFormatter('stylish');
//   // stylelish 打错了没有这个 应该是 stylish 报下面的错
//   // (node:10024) UnhandledPromiseRejectionWarning: Error: There was a problem loading formatter: d:\Apro\mini-webpack\webpack\node_modules\eslint\lib\cli-engine\formatters\stylelish
//   // Error: Cannot find module 'd:\Apro\mini-webpack\webpack\node_modules\eslint\lib\cli-engine\formatters\stylelish'
//   const resultText = formatter.format(results)
//   console.log('results',results)
//   if(results.output){
//     return results.output
//   }
// }

// 1.eslint -xxx 命令行的格式
// 2. api 的方式来 调用eslint插件(这里用的)

console.log('webpack...')
// babel 的编译流程分为三步：parse、transform、generate
// 获取单个模块的信息
function getModuleInfo(file){
    const body = fs.readFileSync(file,"utf-8") //读取文件

    //  这里集成自定义的eslint 插件.  或其他插件,例如压缩. 这里没有实际意义,刚好学了webapck 又来一个 eslint插件视频 就强行集成了 
    // const afterEslintFiltStr =  main(body)
    
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
// console.log("info:", info);
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
    // console.log('depsGraph--->',depsGraph)
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
