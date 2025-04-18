// webpack.client.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  target: 'web',
  entry: './src/client.js',
  output: {
    path: path.resolve(__dirname, 'build/public'),
    filename: 'client.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};

// webpack.server.js
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  entry: './src/server.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['css-loader'] // No need for styles on the server
      }
    ]
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};