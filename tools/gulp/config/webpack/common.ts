import { WebpackOption } from './model';
import { Configuration, ContextReplacementPlugin, ProgressPlugin, HashedModuleIdsPlugin, DefinePlugin, NamedModulesPlugin } from 'webpack';
import * as path from 'path';
import { getHashTypeFormat } from './utils';

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { version, name } = require('../../../../package.json');

export function webpackCommon(wbo: WebpackOption): Configuration {
    const { root, buildConfig, projectRoot } = wbo;
    const extraPlugin: any[] = [];
    const rxPaths = wbo.es2015support ? require('rxjs/_esm2015/path-mapping') : require('rxjs/_esm5/path-mapping');
    const resolve = {
        extensions: ['.ts', '.tsx', '.mjs', '.js'],
        modules: [root, 'node_modules'],
        alias: rxPaths()
    };

    // asset copy
    if (buildConfig.assets) {
        const copyWebpackPatterns = buildConfig.assets.map(({ input, output, glob }) => {
            input = path.resolve(root, input);
            input = input.endsWith('/') ? input : `${input}/`;
            output = output.endsWith('/') ? output : `${output}/`;

            return {
                context: input,
                to: output.replace(/^\//, ''),
                from: {
                    glob,
                    dot: true
                }
            };
        });
        extraPlugin.push(new CopyWebpackPlugin(copyWebpackPatterns, {
            ignore: ['.gitkeep', ' ** /.DS_Store', '**/Thumbs.db', ...buildConfig.ingorePath]
        }));
    }

    const uglifyOptions = {
        ecma: wbo.es2015support ? 6 : 5,
        safari10: true,
        output: {
            ascii_only: true,
            comments: false,
            webkit: true,
            beautify: buildConfig.debug
        },
        ...(wbo.buildConfig.platform === 'server' ? {} : {
            compress: {
                // Workaround known uglify-es issue
                // See https://github.com/mishoo/UglifyJS2/issues/2949#issuecomment-368070307
                inline: wbo.es2015support ? 1 : 3,
                passes: wbo.buildConfig.higherCompression ? 3 : 1
            }
        }),
        mangle: wbo.buildConfig.platform === 'broswer'
    };

    const cacheOPT = buildConfig.buildOptimization ?
        {
            recordsPath: path.resolve(projectRoot, buildConfig.recordsPath),
            cache: true
        } : {};

    const hashFormat = getHashTypeFormat(buildConfig.outputHash, buildConfig.outputHashLen);
    if (buildConfig.env === 'production') {
        extraPlugin.push(new HashedModuleIdsPlugin());
    } else {
        extraPlugin.push(new NamedModulesPlugin());
    }

    return {
        mode: buildConfig.env,
        context: root,
        ...cacheOPT,
        resolve,
        resolveLoader: {
            modules: ['node_modules']
        },
        entry: {
            polyfills: ['./polyfills.ts'],
            main: ['./main.ts']
        },
        output: {
            path: path.resolve(root, buildConfig.outputPath),
            publicPath: buildConfig.deployPath,
            filename: `[name]${hashFormat.file}.js`,
            chunkFilename: `[id]${hashFormat.chunk}.js`
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
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: `[name]${hashFormat.asset}.[ext]`
                        }
                    }]
                },
                {
                    test: /\.(?:png|jpe?g|gif|woff|woff2|ttf|ani|ico)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            name: `[name]${hashFormat.asset}.[ext]`,
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
                ...(buildConfig.higherCompression ? [new OptimizeCssAssetsPlugin({
                    cssProcessorOptions: {
                        map: {
                            inline: false
                        }
                    }
                })] : [])
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
            new DefinePlugin({
                'process.env': {
                    VERSION: JSON.stringify(version),
                    PROJECT_NAME: JSON.stringify(name),
                    BOOTSTAP_COMPETED: JSON.stringify('Bootstrap process completed'),
                    BOOTSTRAP_ERROR: JSON.stringify('Bootstrap process terminated with error.'),
                    BOOTSTRAP_HMR: JSON.stringify('HMR is enabled. Using @angularclass/hrm'),
                    TYPE: buildConfig.hmr ? JSON.stringify('-hmr') : buildConfig.env === 'production' ? JSON.stringify('-prod') : JSON.stringify('')
                }
            })
            , ...extraPlugin]
    };
}
