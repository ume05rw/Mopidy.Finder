const path = require('path');
const outDir = path.resolve(__dirname, "dist", "js");
const webpack = require('webpack');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

    cache: false,

    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: 'development',

    // メインとなるJavaScriptファイル（エントリーポイント）
    // 注) 'src/ts/Main.ts' では認識しない。'./src/ts/Main.ts' とする。
    entry: [
        './src/js/polyfills.js',
        './src/js/libraries.js'
    ],

    // ファイルの出力設定
    output: {
        //  出力ファイルのディレクトリ名
        path: outDir,
        // 出力ファイル名
        filename: 'libonly.js'
    },

    module: {
        rules: [
            // CSS
            {
                test: /\.css/,
                //loader: ExtractTextPlugin.extract("css-loader")
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // CSS内のurl()メソッドの取り込み可否
                            url: true,
                            // ソースマップを有効にする
                            sourceMap: true
                        }
                    }
                ]
            },
            // TypeScript
            {
                test: /\.ts$|\.tsx$/,
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, "tsconfig.commonjs.json")
                }
            },
            // WebFont
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader?name=../font/[name].[ext]'
            }
        ]
    },

    resolve: {
        // node_modules をモジュールのルートディレクトリに追加
        modules: [
            'node_modules'
        ],

        extensions: [
            '.js',
            '.ts'
        ],

        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'va': 'vue2-admin-lte/src'
        }
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],

    devtool: 'inline-source-map'
};
