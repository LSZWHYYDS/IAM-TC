
const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry:  __dirname + "/../console/common/secure-sdk.js",
    output: {
        path: __dirname + "/../build",
        filename: "sdk/secure-sdk.min.js",
        libraryTarget: "umd",
        library: "secure",
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["es2015"],
                    compact: true,
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            // compress: false,
            // mangle: false
        })
    ]
};
