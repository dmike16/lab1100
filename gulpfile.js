/**
 * Gulp file configuration
 */
const gulp = require('gulp');

function loadTask(fileName,taskName){
  let task = require(`./tools/gulp-task/${fileName}`);
  let tn = taskName || 'default';
  return task[tn](gulp);
}

gulp.task('default',loadTask('default'));
gulp.task('serve',loadTask('serve'));
gulp.task('build',loadTask('build'));
gulp.task('build:aot',loadTask('build','aot'));
gulp.task('build:pack',['build:aot'],loadTask('build','pack'));
