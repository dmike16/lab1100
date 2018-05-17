/**
 * Gulp file usgin ts-node + typescript
 */
const path = require('path');
const tsconfigPath = path.join(__dirname,'tools/gulp/tsconfig.json');
const tsconfig = require(tsconfigPath);

require('ts-node').register({
  project: tsconfigPath,
  cache: false
});

require("tsconfig-paths").register({
  baseUrl: path.dirname(tsconfigPath),
  paths: tsconfig.compilerOptions.paths
});

require('./tools/gulp/gulpfile');
