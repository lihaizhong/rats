/**
 * @author Sky
 * @email lihaizh_cn@foxmail.com
 * @create date 2017-05-25 03:29:49
 * @modify date 2017-05-25 03:29:49
 * @desc webpack DLL文件配置
*/

const path = require('path')

const webpack = require('webpack')

module.exports = {
  entry: {
    'vue-core': ['vue', 'vue-router'],
    'vue-touch': ['vue-touch']
  },
  output: {
    path: path.resolve(__dirname, '../dll'),
    filename: '[name].dll.js',
    library: 'library_[hash:8]'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new webpack.DllPlugin({
      context: path.resolve(__dirname, '..'),
      path: path.resolve(__dirname, '[name]-manifest.json'),
      libraryTarget: 'umd',
      name: 'library_[hash:8]'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}
