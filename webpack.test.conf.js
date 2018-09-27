const path = require('path')

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve('')
    }
  }
}
