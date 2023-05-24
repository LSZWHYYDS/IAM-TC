/*global __dirname, process, require, module*/

const webpack = require("webpack");
const path = require("path");
const html_plugins = require("./webpack.html.config");

module.exports = {
   devtool: "eval-source-map",
   cache: false,
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
      filename: "[name]/[name].js"
   },

   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
               loader: "babel-loader",
               options: {
                  presets: ["es2015"],
                  compact: false
               }
            }]
         },
         {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
         },
         {
            test: /\.(png|jpg|svg|gif|ico)$/,
            loader: "file-loader",
            options: {
               name: "[name].[ext]",
               publicPath: "./",
               outputPath: "img/"
            }
         },
         {
            test: /\.(woff|svg|eot|ttf)\??.*$/,
            use: [{
               loader: "url-loader",
               options: {
                  name: "fonts/[name].[md5:hash:hex:7].[ext]"
               }
            }]
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
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.ProvidePlugin({
         $: "jquery",
         jQuery: "jquery",
         "window.jQuery": "jquery"
      })
   ].concat(html_plugins),

   devServer: {
      historyApiFallback: true,
      disableHostCheck: true,
      host: "127.0.0.1",
      port: process.env.PORT || 7000,
      inline: true,
      hot: true,
      proxy: {
         // '/iam': {
         //   // target: "https://192-168-50-15-75jpjhaff5ds.ztna.dingtalk.com",
         //   target: "https://192-168-50-17-75uievyndse8.ztna.dingtalk.com/",
         //   // target: "https://lego.jinancq.cn:446",
         //   changeOrigin: true,
         //   secure: false,
         // }
         '/iam': {
            secure: false,
            // target: 'https://lego.jinancq.cn:446',
            target: "https://192-168-50-17-75uievyndse8.ztna.dingtalk.com/",
            //   target: 'https://192-168-50-13-709gf5vfwy68.ztna.dingtalk.com',
            //   target: 'https://192-168-50-15-75jpjhaff5ds.ztna.dingtalk.com',
            changeOrigin: true
         },
         '/mdm': {
            secure: false,
            target: "https://192-168-50-17-75uievyndse8.ztna.dingtalk.com/",
            // target: 'https://lego.jinancq.cn:446',
            // target: 'https://192-168-50-13-709gf5vfwy68.ztna.dingtalk.com',
            // target: 'https://192-168-50-15-75jpjhaff5ds.ztna.dingtalk.com',
            changeOrigin: true
         },
      }
   }
};
