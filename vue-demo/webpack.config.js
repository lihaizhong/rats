/**
 * Created by sky on 2017/5/11.
 */

const path = require('path')

const webpack = require('webpack')

const htmlWebpackPlugins = require('html-webpack-plugin')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    // devtool: 'cheap-eval-source-map',
    devtool: false,
    entry: {
        main: path.resolve(__dirname, 'main.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:8].js'
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        //         css: ExtractTextPlugin.extract({
                        //             use: [
                        //                 'css-loader',
                        //                 'sass-loader'
                        //             ],
                        //             fallback: 'vue-style-loader'
                        //         })
                    }
                }
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
        new webpack.DllReferencePlugin({
            manifest: require('./build/vue-core-manifest.json')
        }),
        new webpack.DllReferencePlugin({
            manifest: require('./build/vue-touch-manifest.json')
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"devlopment"'
            }
        }),
        new htmlWebpackPlugins({
            filename: 'index.html',
            template: 'index.template.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new BundleAnalyzerPlugin()
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
        port: 10086,
        clientLogLevel: 'error',
        lazy: false,
        // filename指只有请求某个文件时才进行编译
        // 注：只有lazy: true时，filename才有效
        filename: '',
        // 响应头部设置
        headers: {},
        historyApiFallback: {
            // 如果出现404错误时，跳转的页面
            // index: '/default.html',
            // rewrites: [
            //   {
            //     from: '',
            //     to: ''
            //   }
            // ],
            // 如果路径中使用点符号
            // disableDotRule: true,
            // 日志打印
            // verbose: true,
            // logger: console.log.bind(console),
            // htmlAcceptHeaders: ['text/html', '*/*']
        },
        // default is `localhost`
        // host: '0.0.0.0',
        hot: true,
        // {key: 'server.key路径', cert: 'server.crt路径', ca: 'ca.pem路径'}
        https: false,
        inline: true,
        // 关闭webpack打包信息
        noInfo: false,
        // true = {errors: true, warnings: false}，可以设置为{warnings: true, errors: true}
        overlay: true,
        // proxy: {
        //     // 请求'/api/users'会被代理到'http://localhost:8080/api/users'
        //     '/api': 'http://localhost:8080',
        //     '/api2': {
        //         target: 'http://localhost:8080',
        //         pathRewrite: { "^/api": "" }
        //     },
        //     '/api3': {
        //         target: 'https://localhost:8080',
        //         secure: false
        //     },
        //     '/api4': {
        //         target: "http://localhost:8080",
        //         bypass: function(req, res, proxyOptions) {
        //             if (req.headers.accept.indexOf('html') !== -1) {
        //                 console.log('Skipping proxy for browser request.');
        //                 return 'index.html';
        //             }
        //         }
        //     }
        // },
        publicPath: '/src/',
        // 启动quiet后，初始化之外的任何信息都不可见（包括webpack的错误或者警告）
        quiet: false,
        // 中间件
        // setup(app) {

        // },
        // 控制绑定信息展示
        // stats: 'errors-only',
        // 监视devServer.contentBase选项的文件，文件改动将触发整个页面重新刷新
        watchContentBase: true,
        watchOptions: {
            pull: true,
            aggregateTimeout: 500,
            ignored: /node_modules/
        }
    }
}