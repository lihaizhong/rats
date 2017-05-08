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
                        // url-loader 包含参数
                        // limit: 表示源文件大于多少时，用`file-loader`处理，否则使用base64编码
                        // mimetype: 表示base64编码处理的文件类型，如果不设置，将根据文件后缀名进行判断。
                        loader: 'url-loader',
                        options: {
                            limit: 8192, // < 8KB
                            // file-loader 包含参数
                            // [path]: 源文件路径（用处不大）
                            // [name]: 文件名本身
                            // [hash]: 源文件的hash值
                            // [ext]: 文件的后缀名
                            name: IMAGE_PATH + '/[name]-[hash:8].[ext]',
                        }
                    }
                ]
            },
            // sass
            {
                test: /\.scss$/,
                // 将文本内容剥离出来，生成独立的文件
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
                    // 如果无法剥离，使用降级处理，嵌入HTML的<style>标签中
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: 'img:src img:data-src'
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        // js压缩工具
        new webpack.optimize.UglifyJsPlugin({
            beautify: true,
            sourceMap: true
        }),
        // 生成HTML文件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/views/index.html'
        }),
        // 加载器全局配置工具
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
        // 内容提取工具
        new ExtractTextWebpackPlugin(CSS_PATH + '/[name]-[chunkhash:8].css'),
        // new webpack.HotModuleReplacementPlugin()
    ]
};
