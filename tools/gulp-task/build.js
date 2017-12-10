/**
 * Gulp build task
 */

function builProcess(gulp,configuration,cb){
  const webpack = require('webpack');
  const webpackStream = require('webpack-stream');
  const pump = require('pump');
  const helper = require('../config/helper');
  const src = helper.root('src');

  pump([
    gulp.src([`${src}/main.ts`,`${src}/polyfills.ts`,`${src}/vendor.ts`]),
    webpackStream(configuration,webpack),
    gulp.dest(helper.root('build'))
  ],cb);
}

exports.default = (gulp) => (cb) => {
  const prodaction = require('../config/webpack.prod');

  builProcess(gulp,prodaction,cb);
};

exports.aot = (gulp) => (cb) => {
  const prodAOT = require('../config/webpack.prod.aot');

  builProcess(gulp,prodAOT,cb);
};

exports.pack = (gulp) => () => {
  const gutil = require('gulp-util');
  gutil.log('TO DO');
};
