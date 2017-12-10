const {AngularCompilerPlugin} = require('@ngtools/webpack');
const {plugins} = require('./webpack.prod.env');
const webpackMerge = require('webpack-merge');
const prodaction = require('./webpack.prod');
const common = require('./webpack.common');
const helper = require('./helper');

module.exports = webpackMerge(common, {
  devtool: prodaction.devtool,
  output: prodaction.output,

  module: {
    rules: [{
      test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
      loader: '@ngtools/webpack'
    }]
  },

  plugins: [
    new AngularCompilerPlugin({
      tsConfigPath: helper.root('src','tsconfig.json'),
      entryModule: helper.root('src','app','app.module#AppModule'),
      sourceMap: true
    }),
    ...plugins
  ]
});
