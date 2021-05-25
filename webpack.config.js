const fs = require("fs");
const path = require("path");
const glob = require("glob");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = {
  entry: {},
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
    // new HtmlWebpackPlugin({
    //   title: "hello",
    // }),
  ],
};

const apps = glob.sync("*/src/app.ts", { absolute: true });
for (const entry of apps) {
  const name = path.basename(path.resolve(entry, "../.."));
  config.entry[name] = entry;
  config.plugins.push(
    new HtmlWebpackPlugin({
      appName: name,
      chunks: [name],
      title: name,
      //template: path.resolve(__dirname, `./index.html`),
      filename: path.resolve(__dirname, `./build/${name}.html`),
    })
  );
}

module.exports = config;
