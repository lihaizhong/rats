const common = require('./webpack.common')
const merge = require('webpack-merge')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[chunkhash:7].js'
  },
  optimization: {
    // 单独拆分运行时代码，优化浏览器缓存命中，提高web访问性能
    runtimeChunk: 'single',
    // 按需加载文件，优化首屏打开性能
    splitChunks: {
      chunks: 'all',
      // 将第三方的库单独提取到一个文件中，有效利用浏览器缓存
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
})
