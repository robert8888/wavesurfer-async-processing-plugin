const TerserPlugin = require('terser-webpack-plugin');
const path = require("path")

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'wavesurfer-async.js',
        library: 'wavesurfer-async',
        libraryTarget: 'umd',
        libraryExport: 'default',
        globalObject: 'this',
    },

    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [["@babel/preset-env", {"modules": false} ]],
                        plugins: [["@babel/plugin-proposal-class-properties", { "loose": true }]]
                    }
                }
            }
        ]
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true
                }
            })
        ]
    },
};
