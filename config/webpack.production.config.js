/*global __dirname, process, require, module*/

const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const html_plugins = require("./webpack.html.config");

module.exports = {
    entry: {
        console: [
            "core-js/modules/es6.array.from",
            "core-js/modules/es6.symbol",
            "core-js/fn/string/starts-with",
            "core-js/fn/string/ends-with",
            "core-js/fn/string/repeat",
            "core-js/fn/object/assign",
            "core-js/fn/object/keys",
            "core-js/fn/object/values",
            "core-js/fn/array/find-index",
            "core-js/fn/array/from",
            "core-js/fn/array/fill",
            "core-js/fn/number/is-integer",
            "core-js/fn/map",
            __dirname + "/../console/main.js"
        ]
    },
    output: {
        path: __dirname + "/../build",
        filename: "[name]-[hash].js"
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
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: {
                        loader: "css-loader",
                        options: {
                            minimize: true
                        }
                    }
                })
            },
            {
                test: /\.(png|jpg|svg|gif|ico)$/,
                loader: "file-loader",
                options: {
                    limit: 9000,
                    name: "[name].[ext]",
                    publicPath: "./",
                    outputPath: "img/"
                }
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: "url-loader",
                options: {
                    name: "fonts/[name].[md5:hash:hex:7].[ext]"
                }
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        minimize: true
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
        new ExtractTextPlugin({
            filename: "[name]-[hash].css"
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ].concat(html_plugins)
};
