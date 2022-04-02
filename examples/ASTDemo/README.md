# AST抽象语法树

[AST对象文档](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API)

``` bash
node ./learn/AST/parse.js

node ./learn/AST/read.js ./learn/AST/files/demo.js
```

## recast

- parse
- print
- builder
- prettyPrint

- run 通过命令行读取js文件，并转化成ast以供处理。
- tnt 通过assert()和check()，可以验证ast对象的类型。
- visit 遍历ast树，获取有效的AST对象并进行更改。

## recast.types.builders

- identifier
- expressionStatement
- memberExpression
- assignmentExpression
- arrowFunctionExpression
- blockStatement
