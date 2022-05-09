module.exports = {
  meta:{
    docs:{
      description:"eslint style test ....",
    },
    fixable: true,
    messages:{
        braceError:"大括号格式不对",
        spaceError:"大括号缺少空格"
      }
  },
  create(context){
      // 检查的是 token，这个用 context 里的一个 api：
    const sourceCode = context.getSourceCode();
    console.log('sourceCode',sourceCode)
    // 可以在这里 自定义 检验规则
    return {
      // https://astexplorer.net/   eslint 的要选择  espress
       BlockStatement(node){
           const firstToken = sourceCode.getFirstToken(node)
           const beforFirstToken = sourceCode.getTokenBefore(node)
           // 检验规则1: 的 ")" 与 {" 不在同一行
           if(firstToken.loc.start.line !== beforFirstToken.loc.start.line){
             context.report({
               node,
               loc:firstToken.loc,
               messageId:"braceError",
               fix: fixer=>{
                   // 修复逻辑
                   const res = fixer.replaceTextRange([beforFirstToken.range[1],firstToken.range[0]]," ")
                   return res
               }
             })
             // 检查出 { 和 ) 之间没有空格的格式错误
           }else if (firstToken.loc.start.column === beforFirstToken.loc.start.column + 1){
            context.report({
                node,
                loc: firstToken.loc,
                message: '大括号前缺少空格!!!',
                fix: fixer => {
                    return fixer.replaceTextRange([beforFirstToken.range[1], firstToken.range[0]], ' ');
                }
            });
        }
       }
    }
  }
}

// https://www.51cto.com/article/699555.html