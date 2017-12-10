/**
 * Default gulp task
 */
const helper = require('../config/helper');
const info = require(helper.root('package.json'));
const gutil = require('gulp-util');

exports.default = (gulp)=>()=>{
  gutil.log(gutil.colors.blue(info.name));
  gutil.log(gutil.colors.green(info.description));
  gutil.log(gutil.colors.red(info.author.email));
  gutil.log(gutil.colors.red(info.repository.url));
};
