
const webpack = require("webpack");

module.exports = {
    entry:  __dirname + "/../console/common/webAuth.js",
    output: {
        path: __dirname + "/../build",
        filename: "sdk/web-auth-min.js",
        libraryTarget: "umd",
        library: "UCSSO",
        umdNamedDefine: true
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ]
};
