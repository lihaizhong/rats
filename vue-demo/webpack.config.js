/**
 * Created by sky on 2017/5/11.
 */

const path = require('path')

const webpack = require('webpack')


module.exports = {
    entry: {
        main: path.resolve(__dirname, 'main.js')
    },
    output: {

    },
    resolve: {
        extensions: ['', '.js', '.vue', '.json'],
        fallback: [path.resolve(__dirname, '../node_modules')],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    }
}
