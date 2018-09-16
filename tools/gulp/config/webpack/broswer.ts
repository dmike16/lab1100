import { WebpackOption } from './model';
import { Configuration } from 'webpack';
import * as path from 'path';
import { chunkSort } from './utils';
import { BasehrefWebpackPlugin } from '../../plugins/basehref-webpack';

const HtmlWebpackPlugin = require('html-webpack-plugin');

export function webpackBroswer(wbo: WebpackOption): Configuration {
    const { root, buildConfig } = wbo;
    const resolve = {
        mainFields: [
            ...(wbo.es2015support ? ['es2015'] : []),
            'browser', 'module', 'main']
    };
    const extraPlugin: any[] = [];

    return {
        devtool: buildConfig.sourceMap ? (buildConfig.env === 'production' ? 'source-map' : 'cheap-module-eval-source-map') : false,
        resolve,
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                maxAsyncRequests: Infinity,
                cacheGroups: {
                    default: {
                        chunks: 'async',
                        minChunks: 2,
                        priority: 10
                    },
                    common: {
                        name: 'common',
                        chunks: 'async',
                        minChunks: 2,
                        enforce: true,
                        priority: 5
                    },
                    vendors: false,
                    vendor: {
                        name: 'vendor',
                        chunks: 'initial',
                        enforce: true,
                        test: (module: any, chunks: Array<{ name: string }>) => {
                            const moduleName = module.nameForCondition ? module.nameForCondition() : '';
                            return /[\\/]node_modules[\\/]/.test(moduleName)
                                && !chunks.some(({ name }) => name === 'polyfills');
                        }
                    }
                } as any
            }
        },
        plugins: [
            ...extraPlugin,
            new HtmlWebpackPlugin({
                template: path.resolve(root, buildConfig.indexHTML),
                xhtml: true,
                chunksSortMode: chunkSort(wbo)
            }),
            new BasehrefWebpackPlugin({ baseHref: '/'})]
    };
}
