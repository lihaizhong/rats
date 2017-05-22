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
        filename: '[name].[hash:8].js'
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                // options: {
                //     loaders: {
                //         css: ExtractTextPlugin.extract({
                //             use: [
                //                 'css-loader',
                //                 'sass-loader'
                //             ],
                //             fallback: 'vue-style-loader'
                //         })
                //     }
                // }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"devlopment"'
            }
        }),
        new htmlWebpackPlugins({
            filename: 'index.html',
            template: 'index.template.html'
        }),
        new ExtractTextPlugin('style.css')
    ]
}