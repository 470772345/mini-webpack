module.exports = {
  meta:{
    docs:{
      description:"eslint style test ....",
      fixable: true,
      message:{
        braceError:"大括号格式不对",
        spaceError:"大括号缺少空格"
      }
    }
  },
  create(context){
    const sourceCode = context.getSourceCode()
    console.log('sourceCode',sourceCode)
    return {

    }
  }
}