import { WebpackOption } from './model';
import { Configuration, ContextReplacementPlugin } from 'webpack';
import * as path from 'path';

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

export function webpackCommon(wbo: WebpackOption): Configuration {
    const { root, buildConfig } = wbo;
    const resolve = {
        extensions: ['.ts', '.tsx', '.mjs', '.js'],
        modules: [root, 'node_modules'],
        mainFields: [
            ...(wbo.es2015support ? ['es2015'] : []),
            'browser', 'module', 'main']
    };

    const uglifyOptions = {
        ecma: wbo.es2015support ? 6 : 5,
        safari10: true,
        output: {
            ascii_only: true,
            comments: false,
            webkit: true
        },
        ...(wbo.buildConfig.platform === 'server' ? {} : {
            inline: wbo.es2015support ? 1 : 3,
            passes: wbo.buildConfig.higherCompression ? 3 : 1
        }),
        mangle: wbo.buildConfig.platform === 'broswer'
    };

    return {
        mode: buildConfig.env,
        context: root,
        resolve,
        resolveLoader: {
            modules: ['node_modules']
        },
        entry: {
            polyfills: './polyfills.ts',
            app: './main.ts'
        },
        module: {
            rules: [
                // Html rule
                {
                    test: /\.html$/,
                    use: {
                        loader: 'raw-loader'
                    }
                },
                // Image and fonts rule
                {
                    test: /\.(?:png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                    use: ['file-loader?name=assets/[name].[hash].[ext]']
                },
                // Css in app folder rule
                {
                    test: /.scss$/,
                    include: path.resolve(root, 'src', 'app'),
                    use: ['raw-loader', 'sass-loader']
                },
                // Supress warning on using SystemJS inside angular core
                {
                    test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                    parser: { system: true }
                }
            ]
        },
        optimization: {
            noEmitOnErrors: true,
            minimizer: [
                new UglifyJSPlugin({
                    sourceMap: true,
                    cache: true,
                    parallel: true,
                    uglifyOptions
                })
            ],
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
            // Fix an angular warning
            new ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)(@angular|esm5|fesm5|fesm2015)/,
                path.resolve(root, 'src'),
                {}
            )
        ]
    };
}
