[代码分割——CSS](https://webpack.js.org/guides/code-splitting-css/)

# 代码分割——CSS

使用webpack捆绑CSS文件，像[其他模块](https://webpack.js.org/concepts/modules)一样导入CSS，并使用`css-loader`（它将CSS文件作为一个JS模块输出），可以使用`ExtractTextWebpackPlugin`（它会提取CSS内容，输出到CSS文件中）。

## 导入CSS

像JS模块一样，导入CSS文件。例如在`vendor.js`中：

```
import "bootstrap/dist/css/bootstrap.css";
```

## 使用`css-loader`

在`webpack.config.js`中配置`css-loader`，如下：

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'css-loader'
      }
    ]
  }
}
```

结果是，CSS将会和你的JS捆绑在一起。

这有一个明显的缺点，就是你不能利用浏览器的异步/并行加载能力。你的页面也不得不等到整个JS包下载完成才能展现样式。

webpack可以帮助你分割CSS模块，你可以使用`ExtractTextWebpackPlugin`。

## 使用 `ExtractTextWebpackPlugin`

安装[`ExtractTextWebpackPlugin`](https://webpack.js.org/plugins/extract-text-webpack-plugin)，如下：

```
npm i -D extract-text-webpack-plugin
```

需要以下三步，将`ExtractTextWebpackPlugin`添加到你的`webpack.config.js`中。

```
+ var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
-       use: 'css-loader',
+       use: ExtractTextWebpackPlugin({
+         use: 'css-loader'
+       })
      }
    ]
  },
+ plugins: [
+   new ExtractTextWebpackPlugin('styles.css')
+ ]
}
```

以上两步，你就能生成一个指定所有CSS模块的捆绑束，你可以将它们添加到`index.html`。
