import * as  path from 'path';

export function resolveTsConfigTarget(tsConfigPath: string): string {
    const tsConfig = require(tsConfigPath);

    if (tsConfig.compilerOptions && tsConfig.compilerOptions.target) {
        return tsConfig.compilerOptions.target;
    } else {
        return tsConfig.extends ? resolveTsConfigTarget(
            path.resolve(path.dirname(tsConfigPath), tsConfig.extends)) : '';
    }
}
