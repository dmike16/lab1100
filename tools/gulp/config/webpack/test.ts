import { Configuration } from 'webpack';
import { WebpackOption } from './model';
import * as path from 'path';

export function webpackTest(wbo: WebpackOption): Configuration {
    const { buildConfig, root } = wbo;
    return {
        mode: 'development',
        devtool: buildConfig.sourceMap ? 'cheap-module-eval-source-map' : false,
        resolve: {
            mainFields: [
                ...(wbo.es2015support ? ['es2015'] : []),
                'browser', 'module', 'main']
        },
        entry: {
            main:  buildConfig.main
        },
        optimization: {
            splitChunks: {
                chunks:  (chunk: {name: string}) => chunk.name !== 'polyfills',
                cacheGroups: {
                   vendors: false,
                   vendor: {
                       name: 'vendor',
                       chunks: 'initial',
                       test: /[\\/]node_modules[\\/]/
                   }
                }
            }
        } as any
    };
}
