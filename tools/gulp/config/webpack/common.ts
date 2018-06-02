import { WebpackOption } from './model';
import { Configuration, ContextReplacementPlugin, ProgressPlugin, HashedModuleIdsPlugin, DefinePlugin } from 'webpack';
import * as path from 'path';

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { version, name } = require('../../../../package.json');

export function webpackCommon(wbo: WebpackOption): Configuration {
    const { root, buildConfig } = wbo;
    const rxPaths = wbo.es2015support ? require('rxjs/_esm2015/path-mapping') : require('rxjs/_esm5/path-mapping');
    const resolve = {
        extensions: ['.ts', '.tsx', '.mjs', '.js'],
        modules: [root, 'node_modules'],
        alias: rxPaths()
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

    const cacheOPT = buildConfig.buildOptimization ?
        {
            recordsPath: path.resolve(root, buildConfig.recordsPath),
            cache: true
        } : {};

    return {
        mode: buildConfig.env,
        context: root,
        ...cacheOPT,
        resolve,
        resolveLoader: {
            modules: ['node_modules']
        },
        entry: {
            polyfills: './polyfills.ts',
            app: './main.ts'
        },
        output: {
            path: path.resolve(root, buildConfig.outputPath),
            publicPath: buildConfig.deployPath,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[id].[chunkhash].chunk.js'
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
                    test: /\.(?:svg|eot|cur)$/,
                    use : [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]'
                        }
                    }]
                },
                {
                    test: /\.(?:png|jpe?g|gif|woff|woff2|ttf|ani|ico)$/,
                    use : [{
                        loader: 'url-loader',
                        options: {
                            name: '[name].[hash].[ext]',
                            limit: 10000
                        }
                    }]
                },
                // Supress warning on using SystemJS inside angular core
                {
                    test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                    parser: { system: true }
                },
                {
                    test: /\.js$/,
                    exclude: /(ngfactory|ngstyle).js$/,
                    enforce: 'pre',
                    use: [
                        { loader: 'source-map-loader' }
                    ]
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
                }),
                ...(buildConfig.higherCompression ? new OptimizeCssAssetsPlugin({
                    cssProcessorOptions: {
                        map: {
                            inline: false
                        }
                    }
                }) : [])
            ]
        },
        plugins: [
            // Fix an angular warning
            new ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)(@angular|esm5|fesm5|fesm2015)/,
                root,
                {}
            ),
            // Clean dist on rebuild
            new CleanWebpackPlugin([path.resolve(root, buildConfig.outputPath)], {
                allowExternal: true
            }),
            new ProgressPlugin(),
            new HashedModuleIdsPlugin(),
            new DefinePlugin({
                'process.env': {
                    VERSION: JSON.stringify(version),
                    PROJECT_NAME: JSON.stringify(name)
                }
            })
        ]
    };
}
