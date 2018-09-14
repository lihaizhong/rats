const common = require('./webpack.common')
const merge = require('webpack-merge')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: Object.assign({}, common.output, {
    filename: '[name].[hash:7].js'
  }),
  devServer: {
    contentBase: '../dist'
  }
})
