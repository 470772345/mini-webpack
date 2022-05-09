const { ESLint} = require('eslint')
// 1.eslint -xxx 命令行的格式
// 2. api 的方式来 调用eslint插件(这里用的)
const engine =  new ESLint({
   fix:false,
   overrideConfig:{
     parserOptions:{
       ecmaVersion: 6, // 默认是es5语法 ,设置成es6
      //  ecmaFeatures: 6
     },
     rules:{
       "my-brace-style": ["error"]
     },
   },
   rulePaths:[__dirname], // __dirname--> "d:\\Apro\\mini-webpack\\webpack\\plugins"
   useEslintrc:false
});

(async function main(){
  const results = await engine.lintText(`
  if (print) 
  {
      const num = a + b;
      console.log(num);
  }
  for(let i = 0;i<100;i++)
  {
      console.log(i);
  }`);
  console.log('results->',results)
  const formatter = await engine.loadFormatter('stylish');
  // stylelish 打错了没有这个 应该是 stylish 报下面的错
  // (node:10024) UnhandledPromiseRejectionWarning: Error: There was a problem loading formatter: d:\Apro\mini-webpack\webpack\node_modules\eslint\lib\cli-engine\formatters\stylelish
  // Error: Cannot find module 'd:\Apro\mini-webpack\webpack\node_modules\eslint\lib\cli-engine\formatters\stylelish'
  const resultText = formatter.format(results)
  console.log('resultText',resultText)
   
})()

//  async function main(fileStr){
//   console.log('fileStr-->',fileStr)
//   const results = await engine.lintText(fileStr);
//   console.log('results->',results)
//   const formatter = await engine.loadFormatter('stylish');
//   // stylelish 打错了没有这个 应该是 stylish 报下面的错
//   // (node:10024) UnhandledPromiseRejectionWarning: Error: There was a problem loading formatter: d:\Apro\mini-webpack\webpack\node_modules\eslint\lib\cli-engine\formatters\stylelish
//   // Error: Cannot find module 'd:\Apro\mini-webpack\webpack\node_modules\eslint\lib\cli-engine\formatters\stylelish'
//   const resultText = formatter.format(results)
//   console.log('resultText',resultText)
//   if(results.output){
//     return results.output
//   }
// }




// https://eslint.org/docs/developer-guide/nodejs-api#linting