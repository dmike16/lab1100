exports.bootstrap = (tsconfigPath) => {
    const path = require('path');
    const tsconfig = require(tsconfigPath);

    require('ts-node').register({
        project: tsconfigPath,
        cache: false
    });

    require("tsconfig-paths").register({
        baseUrl: path.dirname(tsconfigPath),
        paths: tsconfig.compilerOptions.paths
    });
};
