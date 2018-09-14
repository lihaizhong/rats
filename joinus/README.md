# webpack 4.x

## 模式【mode】

webpack 4.x 引入了mode的概念，可以配置成`devlopment`或者`production`。

选项 :|: 描述
`devlopment` :|: 会将 `process.env.NODE_ENV`的值设为`development`。启用`NamedChunksPlugin`和`NamedModulesPlugin`。
`production` :|: 会将`process.env.NODE_ENV`的值设为`production`。启用`FlagDependencyUsagePlugin`、`FlagIncludedChunksPlugin`、`ModuleConcatenationPlugin`、`NoEmitOnErrorsPlugin`、`OccurrenceOrderPlugin`、`SideEffectsFlagPlugin`和`UglifyJsPlugin`。
