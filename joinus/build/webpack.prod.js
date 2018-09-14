const common = require('./webpack.common')
const merge = require('webpack-merge')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: Object.assign({}, common.output, {
    filename: '[name].[chunkhash:7].js'
  }),
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
})
