[代码分割——使用import()](https://webpack.js.org/guides/code-splitting-import/)

# 代码分割——使用import()

## 动态导入

目前，一个“类函数”`import()`模块加载语法已被ECMAScript提议。

[ES2015加载器规则](https://whatwg.github.io/loader/)定义了`import()`方法来动态加载ES2015模块。

webpack将`import()`作为一个分割点，将请求的模块放在单独的块中。

`import()`获取模块名称作为参数，并返回一个`Promise`对象：

`import(name) -> Promise`

**index.js**

```
function determineDate() {
  import('moment').then(function(moment) {
    console.log(moment().format());
  }).catch(function(err) {
    console.log('Failed to load moment', err);
  });
}
```

## Promise polyfill

如果你在旧版浏览器中使用`import()`，记住必须使用如[es6-promise](https://github.com/stefanpenner/es6-promise)或者[promise-polyfill](https://github.com/taylorhakes/promise-polyfill)垫片来实现Promise。

在你的应用程序中的入口点

```
import Es6Promise from 'es6-promise';
Es6Promise.polyfill();
// or
import 'es6-promise/auto';
// or
import Promise from 'promise-polyfill';
if (!window.Promise) {
  window.Promise = Promise;
}
// or ...
```

## 使用Babel

如果你想使用babel中的`import`，你讲需要安装插件[`syntax-dynamic-import`]。这仍然在标准的第三阶段，解决解析错误问题。当提案被添加进规范后，这个插件将不再是必要的了。

```
npm install -D babel-core babel-loader babel-plugin-syntax-dynamic-import babel-preset-es2015

npm install -S moment
```

**index-es2015.js**

```
function determineDate() {
  import('moment')
    .then(moment => moment().format('LLLL'))
    .then(str => console.log(str))
    catch(err => console.log('Failed to load moment', err));
}

determineDate();
```

**webpack.config.js**

```
module.exports = {
  entry: './index-es2015.js',
  output: {
    filename: 'dist.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['es2015, {modules: false}']],
              plugins: ['syntax-dynamic-import']
            }
          }
        ]
      }
    ]
  }
};
```

不使用`syntax-dynamic-import`插件将构建失败

- `Module build failed: SyntaxError: 'import' and 'export' may only appear at the top level`
or
- `Module build failed: SyntaxError: Unexpected token, expected {`

## 使用babel的`async/await`

使用ES2017 `async/await`需要`import()`：

```
npm install -D babel-plugin-transform-async-to-generator babel-plugin-transform-regenerator babel-plugin-transform-runtime
```

**index-es2017.js**

```
async function determineDate() {
  const moment = await import('moment');
  return moment().format('LLLL');
}
```

determineDate().then(str => console.log(str));

**webpack.config.js**

```
module.exports = {
  entry: './index-es2017.js',
  output: {
    filename: 'dist.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['es2015', {modules: false}]],
              plugins: [
                'syntax-dynamic-import',
                'transform-async-to-generator',
                'transform-regenerator',
                'transform-runtime'
              ]
            }
          }
        ]
      }
    ]
  }
}
```

## `import`取代`require.ensure`？

好消息：现在加载模块失败的时候讲可以进行失败处理，因为他们是基于Promise的。

警告：`require.ensure`允许可选的第三个参数进行简单的块命名，但是`import`API没有提供这个能力。如果你想要这个功能，你可以继续使用`require.ensure`。

```
require.ensure([], function(require) {
  var foo = require('./module');
}, 'custom-chunk-name');
```

## `System.import` 被抛弃

`System.import`用法不符合建议的规范，所以它将在v2.1.0-beta.28中被`import()`替代。

## 例子

- [https://github.com/webpack/webpack/tree/master/examples/harmony](https://github.com/webpack/webpack/tree/master/examples/harmony)
- [https://github.com/webpack/webpack/tree/master/examples/code-splitting-harmony](https://github.com/webpack/webpack/tree/master/examples/code-splitting-harmony)
- [https://github.com/webpack/webpack/tree/master/examples/code-splitting-native-import-context](https://github.com/webpack/webpack/tree/master/examples/code-splitting-native-import-context)

## 网站链接

- [浏览器懒加载ES2015模块](https://dzone.com/articles/lazy-loading-es2015-modules-in-the-browser)
