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

interface HashType { file: string; chunk: string; asset: string; }
export function getHashTypeFormat(option: string, len = 20): HashType {
    const hashRegistry: { [key: string]: HashType } = {
        none: { file: '', asset: '', chunk: '' },
        serve: { file: `.[hash:${len}]`, asset: `.[hash:${len}]`, chunk: `.[hash:${len}].chunk` },
        all: { file: `.[chunkhash:${len}]`, asset: `.[hash:${len}]`, chunk: `.[chunkhash:${len}].chunk` }
    };

    return hashRegistry[option] || hashRegistry['none'];
}
