'use strict'

const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
              test: /\.css$/, 
              use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
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
        filename: "style.css"
      })
    ],
  resolve: {
    extensions: [".js", ".jsx", ".scss", ".css"]
  },
  performance: {
    hints: false
  },
  mode: 'development'

}
