import { Configuration } from 'webpack';
import { WebpackOption } from './model';
import { AngularCompilerPlugin } from '@ngtools/webpack';
import * as path from 'path';

export function webpackJIT(wbo: WebpackOption): Configuration {
    return webpackTypescript(wbo, true);
}

export function webpackAOT(wbo: WebpackOption): Configuration {
    return webpackTypescript(wbo);
}

function webpackTypescript(wbo: WebpackOption, skipCodeGeneration: boolean = false): Configuration {
    const {root, buildConfig, tsConfigPath} = wbo;
    const compiler = {
        test: skipCodeGeneration ? /\.tsx?$/ : /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        use: { loader: '@ngtools/webpack' }
    };
    let i18nFileAndFormat = {};
    if (buildConfig.i18nInFile) {
        i18nFileAndFormat = {
            i18nInFile: buildConfig.i18nInFile,
            i18nInFormat: buildConfig.i18nInFormat
        };
    } else if (buildConfig.i18nOutFile) {
        i18nFileAndFormat = {
            i18nOutFile: path.resolve(root, buildConfig.i18nOutFile),
            i18nOutFormat: path.resolve(root, buildConfig.i18nOutFormat)
        };
    }

    return {
        module: {
            rules: [compiler]
        },
        plugins: [
            new AngularCompilerPlugin({
                tsConfigPath,
                mainPath: path.resolve(root, buildConfig.mainPath),
                skipCodeGeneration,
                sourceMap: buildConfig.sourceMap,
                ...i18nFileAndFormat,
                locale: buildConfig.i18nLocale,
                missingTranslation: buildConfig.i18nMissingTranslation
            })
        ]
    };
}
