const recast = require('recast')

const {
  identifier,
  expressionStatement,
  blockStatement,
  memberExpression,
  assignmentExpression,
  arrowFunctionExpression
} = recast.types.builders

recast.run(function (ast, printSource) {
  console.log(ast)

  // 创建一个块级作用域
  // printSource(blockStatement([]));

  // 创建一个箭头函数
  // printSource(arrowFunctionExpression([], blockStatement([])));

  // 将函数名`add`赋值给箭头函数
  // printSource(
  //   assignmentExpression(
  //     "=",
  //     identifier("add"),
  //     arrowFunctionExpression([], blockStatement([]))
  //   )
  // );

  // 导出`add`函数
  printSource(
    expressionStatement(
      assignmentExpression(
        '=',
        memberExpression(identifier('exports'), identifier('add')),
        arrowFunctionExpression([], blockStatement([]))
      )
    )
  )
})
