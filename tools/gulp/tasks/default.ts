import {task} from 'gulp';
import {log,colors} from 'gulp-util';

task('default',()=>{
  log(colors.yellow('      === GULP ===     '));
  log(colors.yellow('Default gulp tasks.'));
  log(colors.yellow('Read the package json script prop'));
  log(colors.yellow('to find out the runnable tasks'));
  log(colors.yellow('      === GULP ===     '));
});
