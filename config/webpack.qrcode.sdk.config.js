
const webpack = require("webpack");

module.exports = {
    entry:  __dirname + "/../console/common/qrcode-login-sdk.js",
    output: {
        path: __dirname + "/../build",
        filename: "sdk/qrcode-login-sdk.min.js",
        libraryTarget: "umd",
        library: "qrcodesso",
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
                    compact: true
                }
                                                                        
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ]
};
