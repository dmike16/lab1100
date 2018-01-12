import ExtractTextPlugin = require('extract-text-webpack-plugin');
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
import { AngularCompilerPlugin } from '@ngtools/webpack';
import { version, name } from '../../../package.json';

import Package from './package';

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const VERSION = version;
const PROJECT_NAME = name;
/**
 * Common class to all webpack packages
 */
export abstract class WebpackCommonPackage extends Package {
  constructor(name: string, dependencies?: Package[]) {
    super(`${name}:webpack`, dependencies);
  }

  getRules(): [any] {
    return null;
  }

  getConfig(): Configuration {
    return {
      // Entry Points
      entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/main.ts'
      },
      // Ext to resolve when is not specified
      resolve: {
        extensions: ['.ts', '.js']
      },
      //Module section
      module: {
        rules: [
          //Html rule
          {
            test: /\.html$/,
            use: {
              loader: 'html-loader',
              options: { minimize: false }
            }
          },
          //Image and fonts rule
          {
            test: /\.(?:png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
            use: ['file-loader?name=assets/[name].[hash].[ext]']
          },
          //Css in assets rule
          {
            test: /\.scss$/,
            exclude: this.resolveInProject('src', 'app'),
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [{
                loader: 'css-loader',
                options: { sourceMap: true }
              },
              {
                loader: 'sass-loader',
                options: { sourceMap: true }
              }]
            })
          },
          // Css in app folder rule
          {
            test: /.scss$/,
            include: this.resolveInProject('src', 'app'),
            use: ['raw-loader', 'sass-loader']
          }
        ]
      },

      plugins: [
        //Fix an angular2 warning
        new ContextReplacementPlugin(
          /angular(\\|\/)core(\\|\/)(@angular|esm5)/,
          this.resolveInProject('./src'),
          {}
        )
      ]
    }
  }
}
/**
 * Build webpack package
 *
 */
export class WebpackBuildProdPackage extends WebpackCommonPackage {

  getRules(): [any] {
    return [{
      test: /\.ts$/,
      use: [{
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: this.resolveInProject('src', 'tsconfig.app.json')
        }
      },
        'angular2-template-loader'
      ]
    }]
  }

  getConfig(): Configuration {
    return merge(super.getConfig(), {
      devtool: 'source-map',

      output: {
        path: this.resolveInProject('build'),
        publicPath: '/lab1100/',
        filename: '[name].[chunkhash].js',
        chunkFilename: '[id].[chunkhash].chunk.js'
      },

      module: {
        rules: this.getRules()
      },

      plugins: [
        //Clean dist on rebuild
        new CleanWebpackPlugin([this.resolveInProject('build')], {
          allowExternal: true
        }),
        new NoEmitOnErrorsPlugin(),
        new HashedModuleIdsPlugin(),
        new optimize.CommonsChunkPlugin({
          names: ['app', 'vendor', 'polyfills']
        }),
        new optimize.CommonsChunkPlugin({
          name: 'boilerplate',
          minChunks: Infinity
        }),
        new optimize.UglifyJsPlugin({
          sourceMap: true,
          mangle: {
            keep_fnames: true
          }

        }),
        new ExtractTextPlugin('[name].[chunkhash].css'),
        new DefinePlugin({
          'process.env': {
            'ENV': JSON.stringify(ENV),
            'VERSION': JSON.stringify(VERSION),
            'PROJECT_NAME': JSON.stringify(PROJECT_NAME)
          }
        }),
        // Fill the index.html with buldle geneated
        new HtmlWebpackPlugin({
          template: 'src/index.html'
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
  constructor(name: string, dependencies?: Package[]) {
    super(`${name}:aot`, dependencies);
  }

  getRules(): [any] {
    return [{
      test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
      loader: '@ngtools/webpack'
    }];
  }
  getConfig(): Configuration {
    return merge(super.getConfig(), {
      plugins: [
        new AngularCompilerPlugin({
          tsConfigPath: this.resolveInProject('src', 'tsconfig.app.json'),
          entryModule: this.resolveInProject('src', 'app', 'app.module#AppModule'),
          sourceMap: true
        })
      ]
    })
  }
}
/**
 * Serve webpack server pacakge
 */
export class WebpackServePackage extends WebpackCommonPackage {
  public https: any = true;


  getRules(): [any] {
    return [{
      test: /\.ts$/,
      use: [{
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: this.resolveInProject('src', 'tsconfig.app.json')
        }
      },
        'angular2-template-loader'
      ]
    }]
  }

  getConfig(): Configuration {
    return merge(super.getConfig(), {
      devtool: 'cheap-module-eval-source-map',

      output: {
        path: this.resolveInProject('dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
      },

      module: {
        rules: this.getRules()
      },

      plugins: [
        new ExtractTextPlugin('[name].css'),
        new optimize.CommonsChunkPlugin({
          names: ['app', 'vendor', 'polyfills']
        }),
        // Fill the index.html with buldle geneated
        new HtmlWebpackPlugin({
          template: 'src/index.html'
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
export class WebpackKarmaPackage extends WebpackCommonPackage
 {
  getRules(): [any] {
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
      //Html rule
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: { minimize: false }
        }
      },
      //Image and fonts rule
      {
        test: /\.(?:png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: 'null-loader'
      },
      //Css in assets rule
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
      }
    ];
  }

  getConfig(): Configuration{
    const parent = super.getConfig();
    delete parent.entry;
    delete parent.module;

    return merge(parent,{
      devtool: 'cheap-module-eval-source-map',

      output: {
        path: this.resolveInProject('dist'),
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
