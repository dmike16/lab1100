const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const {plugins} = require('./webpack.prod.env');
const helper = require('./helper');

module.exports = webpackMerge(commonConfig,{
  devtool: 'source-map',

  output: {
    path: helper.root('build'),
    publicPath: '/lab1100/',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].chunk.js'
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

  plugins:[
    ...plugins
  ]
});
