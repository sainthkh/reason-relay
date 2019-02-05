const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /\/node_modules\//,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              "relay",
              //"@babel/plugin-transform-runtime",
              "@babel/plugin-proposal-class-properties"
            ],
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
        },
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './public'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: false,
    }),
  ],
}