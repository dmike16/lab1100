import { Configuration } from 'webpack';
import { WebpackOption } from './model';

export function webpackJIT(wbo: WebpackOption): Configuration {
    return null;
}

export function webpackAOT(wbo: WebpackOption): Configuration {
    return null;
}

function webpackTypescript(wbo: WebpackOption, skipcodeGeneration: boolean = false): Configuration {
    const compiler = {
        test: skipcodeGeneration ? /\.tsx?$/ : /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        use: { loader: '@ngtools/webpack' }
    };
    return null;
}
