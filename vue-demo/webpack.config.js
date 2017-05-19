/**
 * Created by sky on 2017/5/11.
 */

const path = require('path')

const webpack = require('webpack')

const htmlWebpackPlugins = require('html-webpack-plugin')

const ExtractTextPlugin = require('extract-text-webpack-plugin')


module.exports = {
    entry: {
        main: path.resolve(__dirname, 'main.js')
    },
    output: {
        path: './dist',
        filename: '[name][hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: [
                                'css-loader',
                                'sass-loader'
                            ],
                            fallback: 'vue-style-loader'
                        })
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    plugins: [
        new htmlWebpackPlugins({
            filename: 'index.html',
            template: 'index.html'
        }),
        new ExtractTextPlugin('style.css')
    ]
}
