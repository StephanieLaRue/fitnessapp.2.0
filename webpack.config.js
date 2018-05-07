'use strict'

const path = require('path');

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
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
              test: /.jsx?$/,
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
  resolve: {
    extensions: [".js", ".jsx", ".scss"]
  },
  performance: {
    hints: false
  }
}
