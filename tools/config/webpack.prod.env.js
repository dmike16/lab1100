const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const helper = require('./helper');
const info = require(helper.root('package.json'));
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const VERSION = info.version;
const PROJECT_NAME = info.name;

module.exports = {
  plugins: [
    //Clean dist on rebuild
    new CleanWebpackPlugin([helper.root('build')], {
      allowExternal: true
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'boilerplate'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        mangle: {
          keep_fnames: true
        }
      }
    }),
    new ExtractTextPlugin('[name].[chunkhash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'VERSION': JSON.stringify(VERSION),
        'PROJECT_NAME': JSON.stringify(PROJECT_NAME)
      }
    }),
    new webpack.ProgressPlugin()
  ]
};
