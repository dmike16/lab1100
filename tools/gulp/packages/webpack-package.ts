import {
  ContextReplacementPlugin,
  NoEmitOnErrorsPlugin,
  HashedModuleIdsPlugin,
  optimize,
  DefinePlugin,
  ProgressPlugin,
  Configuration
} from 'webpack';
import merge = require('webpack-merge');
import HtmlWebpackPlugin = require('html-webpack-plugin');
import CleanWebpackPlugin = require('clean-webpack-plugin');
import { AngularCompilerPlugin, AngularCompilerPluginOptions } from '@ngtools/webpack';
const { version, name } = require('../../../package.json');

import { Package, root } from './package';
import { WebpackOption } from '@ngx-lab1100/configuration';

const VERSION = version;
const PROJECT_NAME = name;
/**
 * Common class to all webpack packages
 */
export abstract class WebpackCommonPackage extends Package {
  constructor(name: string, protected wco: WebpackOption, dependencies?: Package[]) {
    super(`${name}:webpack`, dependencies);
  }
}
/**
 * Build webpack package
 *
 */
export class WebpackBuildProdPackage extends WebpackCommonPackage {

  getConfig(): Configuration {
    return merge(super.getConfig(), {
      devtool: 'source-map',
      mode: 'production',
      recordsPath: this.resolveInProject('records.json'),
      cache: true,
      output: {
        path: this.resolveInProject('build'),
        publicPath: '/lab1100/',
        filename: '[name].[chunkhash].js',
        chunkFilename: '[id].[chunkhash].chunk.js'
      },
      plugins: [
        // Clean dist on rebuild
        new CleanWebpackPlugin([this.resolveInProject('build')], {
          allowExternal: true
        }),
        new NoEmitOnErrorsPlugin(),
        new HashedModuleIdsPlugin(),
        new DefinePlugin({
          'process.env': {
            VERSION: JSON.stringify(VERSION),
            PROJECT_NAME: JSON.stringify(PROJECT_NAME)
          }
        }),
        // Fill the index.html with buldle geneated
        new HtmlWebpackPlugin({
          template: './index.html',
          xhtml: true
        }),
        new ProgressPlugin()
      ]
    });
  }
}
/**
 * AOT build package
 */
export class WebpackBuildAOTPackage extends WebpackBuildProdPackage {
  private aotOptions: AngularCompilerPluginOptions = {
    tsConfigPath: this.resolveInProject('src', 'tsconfig.app.json'),
    entryModule: this.resolveInProject('src', 'app', 'app.module#AppModule'),
    sourceMap: true
  };

  constructor(name: string, dependencies?: Package[]) {
    super(`${name}:aot`, dependencies);
  }

  set options(value: AngularCompilerPluginOptions) {
    this.aotOptions = Object.assign(this.aotOptions, value);
  }

  getConfig(): Configuration {
    return merge(super.getConfig(), {
      plugins: [
        new AngularCompilerPlugin(this.aotOptions)
      ]
    });
  }
}
/**
 * Serve webpack server pacakge
 */
export class WebpackServePackage extends WebpackCommonPackage {
  https: any = true;

  getConfig(): Configuration {
    return merge(super.getConfig(), {
      devtool: 'cheap-module-eval-source-map',
      mode: 'development',
      output: {
        path: this.resolveInProject('build'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
      },
      // optimization
      optimization: {
        minimizer: [
          new UglifyJSPlugin({
            sourceMap: false,
            parallel: true,
            cache: true,
            uglifyOptions: {
              ecma: 6
            }
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
        // Fill the index.html with buldle geneated
        new HtmlWebpackPlugin({
          template: './index.html'
        })
      ],

      devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        https: (this.https === true ? true : this.https ? this.https : false),
        host: 'localhost',
        port: 4200
      }
    });
  }
}
/**
 * Test webpack Karma package
 */
export class WebpackKarmaPackage extends WebpackCommonPackage {
  getRules(): any[] {
    return [
      {
        test: /\.ts$/,
        use: [{
          loader: 'awesome-typescript-loader',
          options: {
            configFileName: this.resolveInProject('src', 'tsconfig.spec.json')
          }
        },
          'angular2-template-loader'
        ]
      },
      // Html rule
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: { minimize: false }
        }
      },
      // Image and fonts rule
      {
        test: /\.(?:png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: 'null-loader'
      },
      // Css in assets rule
      {
        test: /\.scss$/,
        exclude: this.resolveInProject('src', 'app'),
        use: 'null-loader'
      },
      // Css in app folder rule
      {
        test: /.scss$/,
        include: this.resolveInProject('src', 'app'),
        use: ['raw-loader', 'sass-loader']
      },
      // Supress warning on using SystemJS inside angular core
      {
        test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
        parser: { system: true }
      }
    ];
  }

  getConfig(): Configuration {
    const parent = super.getConfig();
    delete parent.entry;
    delete parent.module;

    return merge(parent, {
      devtool: 'cheap-module-eval-source-map',
      mode: 'development',
      output: {
        path: this.resolveInProject('build'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
      },

      module: {
        rules: this.getRules()
      },

      plugins: [
        new NoEmitOnErrorsPlugin(),
        new ProgressPlugin()
      ]
    });
  }
}

function recursiveIssuer(module: any): string {
  if (module.nameForCondition) {
    console.info(module.nameForCondition());
    return module.nameForCondition();
  } else {
    console.info('no name');
    return '';
  }
}
