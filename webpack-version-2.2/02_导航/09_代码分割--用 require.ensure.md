[代码分割——用require.ensure](https://webpack.js.org/guides/code-splitting-require/)

# 代码分割——用require.ensure

本章节中，我们讨论怎么使用`require.ensure`分割代码。

## `require.ensure()`

webpack会在代码构建时静态解析`require.ensure()`。任何被作为依赖或者`require()`都会添加一个新的块。这个新块被写入一个异步捆绑包中，它是由webpack通过jsonp的形式加载的。

下面是它的语法：

```
require.ensure(dependencies: String[], callback: function(require), chunkName: String)
```

### dependencies

这是一个字符串数组，每个字符串都代表我们声明的模块的名称。这些模块会在回调函数调用前执行。

### callback

这是一个回调函数，webpack会在所有依赖都加在完成之后执行它。这个方法有一个参数`require`。这个方法体可以在执行到需要的时候`require`需要的模块。

### chunkName

`chunkName`是由特定`require.ensure()`赋予的块的名称。通过几个传递了相同`chunkName`的`require.ensure()`被调用，我们可以将他们的代码合并到一个块中，这样浏览器加载时就只有一个文件。

## 案例

让我们考虑以下的文件结构：

```
.
|-- dist
|-- js
|    |-- a.js
|    |-- b.js
|    |-- c.js
|    |-- entry.js
|-- webpack.config.js
```

**entry.js**

```
require('./a');

require.ensure(['./b'], function(require) {
  require('./c');

  console.log('done!');
});
```

**a.js**

```
console.log('****** I AM a *****');
```

**b.js**

```
console.log('****** I AM b *****');
```

**c.js**

```
console.log('****** I AM c *****');
```

**webpack.config.js**

```
var path = require('path');

module.exports = function(require) {
  return {
    entry: './js/entry.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      // 告诉webpack，按需加载的位置
      publicPath: 'https://cdn.example.com/asserts/',
      // 在捆绑包中显示注释，不压缩文件
      // 不应该应用于生产环境
      pathinfo: true
    }
  }
}
```

运行webpack，我们发现webpack生成了两个新包，`bundle.js`和`0.bundle.js`。

`entry.js`和`a.js`都被绑定到了`bundle.js`。

**bundle.js**

```
/******/ (function(modules) { // webpackBootstrap
//webpack bootstrap code...

/******/     // __webpack_public_path__
/******/     __webpack_require__.p = "https://cdn.example.com/assets/";

// webpack bootstrap code...
/******/ })
/******/ ([
/* 0 */
/* unknown exports provided */
/* all exports used */
/*!*****************!*\
  !*** ./js/a.js ***!
  \*****************/
/***/ (function(module, exports) {

console.log('***** I AM a *****');


/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/* unknown exports provided */
/* all exports used */
/*!*********************!*\
  !*** ./js/entry.js ***!
  \*********************/
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./a */ 0);
__webpack_require__.e/* require.ensure */(0).then((function(require){
    __webpack_require__(/*! ./c */ 2);
    console.log('done!');
}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);


/***/ })
/******/ ]);
```

`b.js`和`c.js`都被绑定到了0.bundle.js。

**0.bundle.js**

```
webpackJsonp([0],[
/* 0 */,
/* 1 */
/* unknown exports provided */
/* all exports used */
/*!*****************!*\
  !*** ./js/b.js ***!
  \*****************/
/***/ (function(module, exports) {

console.log('***** I AM b *****');


/***/ }),
/* 2 */
/* unknown exports provided */
/* all exports used */
/*!*****************!*\
  !*** ./js/c.js ***!
  \*****************/
/***/ (function(module, exports) {

console.log('***** I AM c *****');



/***/ })
]);
```

现在`bundle.js`添加到你的HTML文件中并且在浏览器中打开，`0.bundle.js`将通过webpack按需加载。

**更多案例**

- [https://github.com/webpack/webpack/tree/master/examples/code-splitting](https://github.com/webpack/webpack/tree/master/examples/code-splitting)
- [https://github.com/webpack/webpack/tree/master/examples/named-chunks](https://github.com/webpack/webpack/tree/master/examples/named-chunks) —— 说明`chunkName`的用途。

## `require.ensure`的问题

### 空数组作为参数

```
require.ensure([], function(require) {
  require('./a.js');
});
```

上面的代码确定了一个分割点，`a.js`是单独捆绑的。

## 依赖参数

```
require.ensure(['./b.js'], function(require) {
  require('./c.js');
});
```

在以上代码中，`b.js`和`c.js`被捆绑在一起独立为一个捆绑包。但是仅仅是有`c.js`的内容被执行。`b.js`的内容仅仅被提供，但是没有被执行。想要执行`b.js`，我们必须`require('./b.js')`
