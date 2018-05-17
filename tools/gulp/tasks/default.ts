import { task } from 'gulp';
import { yellow } from 'ansi-colors';
import log = require('fancy-log');

task('default', () => {
  log(yellow('      === GULP ===     '));
  log(yellow('Default gulp tasks.'));
  log(yellow('Read the package json script prop'));
  log(yellow('to find out the runnable tasks'));
  log(yellow('      === GULP ===     '));
});
