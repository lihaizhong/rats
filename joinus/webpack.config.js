/**
 * Created by sky on 2017/4/10.
 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'cheap-source-map',

    entry: path.resolve(__dirname, 'src/main.js'),

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:8].js'
    },

    module: {
        rules: [
            {
                test: /\.(png|jpeg|jpg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: ['src/scss'],
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            beautify: true,
            sourceMap: true
        }),
        new HtmlWebpackPlugin({
            title: '动画推广页',
            filename: 'index.html',
            template: 'src/views/index.html',
            minify: {
                minifyCSS: true,
                minifyJS: true
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
