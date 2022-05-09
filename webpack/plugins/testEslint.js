const { ESLint} = require('eslint')
// api 的方式来 调用eslint插件
const engine =  new ESLint({
   fix:false,
   overrideConfig:{
     parserOptions:{
       ecmaFeatures: 6
     },
     rules:{
       "my-brace-style": ["error"]
     },
   },
   rulePaths:[__dirname], // __dirname--> "d:\\Apro\\mini-webpack\\webpack\\plugins"
   useEslintrc:false
});

(async function main(){
  const results = await engine.lintText(`if (a)
  { console.log('xxx')}`);

  const formatter = await engine.loadformatter('stylelish')
  const resultText = formatter(results)
   
})()




// https://eslint.org/docs/developer-guide/nodejs-api#linting