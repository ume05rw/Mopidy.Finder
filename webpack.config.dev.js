const path = require('path');
const outDir = path.resolve(__dirname, "dist", "js");

module.exports = {

    cache: false,

    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: 'development',

    // メインとなるJavaScriptファイル（エントリーポイント）
    // 注) 'src/ts/Main.ts' では認識しない。'./src/ts/Main.ts' とする。
    entry: [
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
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // CSS内のurl()メソッドの取り込みを禁止する
                            url: false,
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
        ]
    },

    devtool: 'inline-source-map'
};
