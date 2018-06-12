/**
 * Gulp file usgin ts-node + typescript
 */
'use strict';

const path = require('path');
const tsconfigPath = path.join(__dirname, 'tools/gulp/tsconfig.json');
require('./lib/bootstrap-local').bootstrap(tsconfigPath);
require('./tools/gulp/gulpfile');
