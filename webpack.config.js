const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = {
  entry: {
    "arduino-blinky": "./arduino-blinky/src/app.ts",
  },
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    //filename: '[name].[contenthash:8].js',
    path: path.resolve(__dirname, "./build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "hello",
    }),
  ],
  devServer: {
    port: 9080,
    contentBase: path.join(__dirname, "build"),
  },
};

module.exports = config;
