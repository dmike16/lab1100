const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helper = require('./helper');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helper.root('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    rules: [
      //typescript rule
      {
        test: /\.ts$/,
        use: [{
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: helper.root('src', 'tsconfig.json')
            }
          },
          'angular2-template-loader'
        ]
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('[name].css')
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    https: true
  }
});
