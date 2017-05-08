/**
 * Created by sky on 2017/4/10.
 */

const path = require('path')

const webpack = require('webpack')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const autoprefixer = require('autoprefixer')

const STATIC_PATH = 'static'
const IMAGE_PATH = STATIC_PATH + '/img'
const CSS_PATH = STATIC_PATH + '/css'
const JS_PATH = STATIC_PATH + '/js'

module.exports = {
    devtool: 'cheap-source-map',

    entry: path.resolve(__dirname, 'src/main.js'),

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:8].js'
    },

    module: {
        rules: [
            // image
            {
                test: /\.(png|jpeg|jpg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: IMAGE_PATH + '/[name]-[hash:8].[ext]'
                        }
                    }
                ]
            },
            // sass
            {
                test: /\.scss$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: [
                        'css-loader',
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: ['src/scss']
                            }
                        }
                    ],
                    fallback: 'style-loader'
                })
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
            filename: 'index.html',
            template: 'src/views/index.html'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            options: {
                postcss: [
                    autoprefixer({
                        remove: true,
                        browsers: ['> 1% in CN']
                    })
                ]
            }
        }),
        new ExtractTextWebpackPlugin(CSS_PATH + '/[name]-[chunkhash:8].css'),
        // new webpack.HotModuleReplacementPlugin()
    ]
};
