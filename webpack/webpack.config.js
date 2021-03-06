const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: ['regenerator-runtime/runtime.js', './renderer/index.js']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),
        clean: true,
    },
    context: path.resolve(__dirname, '../src'),
    module: {
        rules: [{
            test: /\.s?css/i,
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
        },{
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', 'scss'],
        alias: {
            components: path.resolve(__dirname, '../src/renderer/components/'),
            store: path.resolve(__dirname, '../src/renderer/store/'),
            utils: path.resolve(__dirname, '../src/renderer/utils/'),
            keys: path.resolve(__dirname, '../src/renderer/keys/'),
            hooks: path.resolve(__dirname, '../src/renderer/hooks/'),
            fonts: path.resolve(__dirname, '../fonts/'),
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
            inject: false
        })
    ],
    optimization: {
        runtimeChunk: 'single'
    }
};
