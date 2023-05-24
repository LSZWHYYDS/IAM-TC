/**
 * Created by shaliantao on 2017/9/8.
 */
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");

// const HTML_ROOT_PATH = __dirname + "/../help/html/pages";

// const html_plugins = function() {
//     const htmlfiles = fs.readdirSync(HTML_ROOT_PATH);
//     let htmlPlugins = [];

//     htmlfiles.forEach(function(item) {
//         const currentpath = path.join(HTML_ROOT_PATH, item);
//         const conf = {
//             template: currentpath,
//             filename: "help/" + item,
//             inject: false
//         };
//         htmlPlugins.push(new HtmlWebpackPlugin(conf));
//     });
//     return htmlPlugins;
// }();
module.exports = [
    new HtmlWebpackPlugin({
        filename: "index.html",
        template: __dirname + "/../console/index.html",
        chunks: ["console"]
    }),
    // new HtmlWebpackPlugin({
    //     filename: "help/index.html",
    //     template: __dirname + "/../help/html/index.html",
    //     chunks: ["help"]
    // })
];