const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
let devMode = process.env.NODE_ENV === "development";

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    background: "./src/background.js",
    content: "./src/content.js"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",

        options: {
          loaders: {
            scss: ["vue-style-loader", "sass-loader", "css-loader"],
            sass: ["vue-style-loader", "css-loader", "sass-loader"],
            css: "css-loader"
          }
        }
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "file-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  output: {
    filename: "./[name].build.js",
    chunkFilename: "./[name].chunk.js",
    path: path.resolve(__dirname, "dist")
  },

  optimization: {
    minimize: false
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js", ".vue"],
    alias: {
      vue: "vue/dist/vue.runtime.js"
    }
  },

  plugins: [
    new VueLoaderPlugin(),

    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css"
    }),

    new webpack.ProvidePlugin({
      _: "lodash",
      Lodash: "lodash",
      vue: "vue"
    }),

    new CopyPlugin([
      { from: "./assets/**/*", to: "dist/assets", force: true, flatten: true },

      {
        from: "./manifest.json",
        to: "manifest.json",
        force: true,
        flatten: true
      }
    ]),

    new webpack.ProvidePlugin({
      regeneratorRuntime: "regenerator-runtime/runtime"
    })
  ]
};
