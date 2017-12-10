/**
 * Gulp build task
 */

exports.default = (gulp) => (cb) => {
  const pump = require('pump');
  const prodaction = require('../config/webpack.prod');
  const webpack = require('webpack');
  const webpackStream = require('webpack-stream');
  const helper = require('../config/helper');
  const src = helper.root('src');
  pump([
    gulp.src([`${src}/main.ts`,`${src}/polyfills.ts`,`${src}/vendor.ts`]),
    webpackStream({
      config: prodaction,
      progress: true
    }),
    gulp.dest(helper.root('build'))
  ],cb);
};

exports.aot = (gulp) => () => {
  const gutil = require('gulp-util');
  gutil.log('TO DO');
}

exports.pack = (gulp) => () => {
  const gutil = require('gulp-util');
  gutil.log('TO DO');
}
