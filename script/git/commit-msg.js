'use strict';

const path = require('path');
const tsconfigPath = path.join(__dirname, '../../tools/validate-commit-message/tsconfig.json');
require('../../lib/bootstrap-local').bootstrap(tsconfigPath);
require('../../tools/validate-commit-message');
