# mini-webpack
##手写mimi-webpack 学习webpack原理


### webpack的构建流程是什么?从读取配置到输出文件这个过程尽量说全。

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：<br>

初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；<br>
开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；<br>
确定入口：根据配置中的 entry 找出所有的入口文件；<br>
编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口<br>依赖的文件都经过了本步骤的处理；
完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；<br>
输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；<br>
输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。<br>
在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果<br>

参考: https://baijiahao.baidu.com/s?id=1706629892058057497&wfr=spider&for=pc
https://www.51cto.com/article/699555.html


++ plugins 文件夹 是突然学了 eslint 插件. 集成进来的.

++ webpack\webpack.js 文件用来模拟 webpack 打包   node webpack.js 执行

## 总结
1 学习webpack的一个大概的打包过程/原理
2.学习自定义一个eslint规则的插件开发,了解eslint的运作原理,
  Eslint 是用来检查代码中的错误和格式问题的，基于 AST，Babel 也是基于 AST 做的代码分析和转换，但是却不能检查格式。
  为了探究原因，我们写了一个 EsLint 的检查大括号格式的 rule，通过 SourceCode 的 api 拿到 { 和 ( 的 token，对比下行列号来做检查。并且通过 fixer 的字符串替换做了自动修复。
  写完之后，我们发现 EsLint 能做格式检查的原因是**因为 AST 中记录了 range，也保留了 token信息，并且提供了根据 range 查询 token 的 api，而 Babel 没有。**
  EsLint 和 Babel 原理大同小异，但是有不同的设计目的，所以提供了不同的 api，有着不同的功能
3.学习在vscode debuuger 调试
