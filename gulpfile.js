/**
 * Gulp file usgin ts-node + typescript
 */
const path = require('path');
const tsconfigPath = path.join(__dirname,'tools/gulp/tsconfig.json');
const tsconfig = require(tsconfigPath);

require("tsconfig-paths").register({
  baseUrl: `${__dirname}/tools/gulp`,
  paths: tsconfig.compilerOptions.paths
});
require('ts-node').register({
  project: tsconfigPath
});
require('./tools/gulp/gulpfile');
