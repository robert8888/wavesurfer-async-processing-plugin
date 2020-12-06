const path = require("path")

module.exports = {
    mode: 'development',
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
                        presets: ['@babel/preset-env'],
                        plugins: ["@babel/plugin-proposal-class-properties", {lose: true}]
                    }
                }
            }
        ]
    }
};
