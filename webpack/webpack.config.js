const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'development',
    entry: {
        main: './renderer/js/index.js'
    },
    // target: 'electron-main',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),
        clean: true,
    },
    context: path.resolve(__dirname, '../src'),
    module: {
        rules: [{
            test: /\.scss/i,
            use: [
                'style-loader', 'css-loader', 'sass-loader',
            ],
        },{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        [ '@babel/preset-react' ],
                        [ '@babel/preset-env', { targets: "defaults" } ]
                    ]
                }
            }
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            components: path.resolve(__dirname, '../src/renderer/js/components/'),
            context: path.resolve(__dirname, '../src/renderer/js/context/'),
            utils: path.resolve(__dirname, '../src/renderer/js/utils/')
        },
        fallback: {
            "fs": false
        }
    },
    plugins: [
        new NodePolyfillPlugin(),
        new HtmlWebpackPlugin({
            title: 'Cheat',
            template: './index.ejs',
            inject: 'body'
        }),
    ],
    optimization: {
        runtimeChunk: 'single'
        // chunkIds: 'named',
        // splitChunks: {
        //     chunks: "all"
        // }
    }
};
