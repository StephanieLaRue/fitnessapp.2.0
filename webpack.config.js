'use strict'

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const devMode = process.env.NODE_ENV !== 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    fitness: './src/main.jsx'
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
        rules: [
            {
              test: /\.scss$/, 
              use: ['style-loader', MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
              test: /\.css$/, 
              use: ['style-loader', MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [["env"], ["react"]],
                  cacheDirectory: true,
                }
              }
            }   
        ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
      new HtmlWebpackPlugin({
        template: "./public/template.html",
        filename: "index.html",
        hash: true
    })
    ],
  resolve: {
    extensions: [".js", ".jsx", ".scss", ".css"]
  },
  performance: {
    hints: false
  },
}
