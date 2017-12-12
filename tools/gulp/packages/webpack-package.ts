import ExtractTextPlugin from 'extract-text-webpack-plugin';
import {
  ContextReplacementPlugin,
  CommonsChunkPlugin,
  NoEmitOnErrorsPlugin,
  HashedModuleIdsPlugin,
  UglifyJsPlugin,
  DefinePlugin,
  ProgressPlugin
} from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import {AngularCompilerPlugin} from '@ngtools/webpack';
import {version,name} from '../../../package.json';

import Package from './package';

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const VERSION = version;
const PROJECT_NAME = name;

abstract class WebpackCommonPackage extends Package {
  constructor(name:string,dependencies?: Package[]){
      super(`${name}:webpack`,dependencies);
  }

  getRules():[any]{
    return null;
  }

  getConfig(): {[prop:string]:any} {
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
        ),
        //Optimize common dependencies
        new CommonsChunkPlugin({
          name: ['app', 'vendor', 'polyfills']
        }),
        // Fill the index.html with buldle geneated
        new HtmlWebpackPlugin({
          template: 'src/index.html'
        })
      ]
    }
  }
}

export class WebpackBuildProdPackage extends WebpackCommonPackage {

  getRules(): [any] {
    return [{
      test: /\.ts$/,
      use: [{
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: this.resolveInProject('src', 'tsconfig.json')
        }
      },
        'angular2-template-loader'
      ]
    }]
  }

  getConfig(): {[prop:string]:any} {
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
        new CommonsChunkPlugin({
          name: 'boilerplate'
        }),
        new UglifyJsPlugin({
          sourceMap: true,
          uglifyOptions: {
            mangle: {
              keep_fnames: true
            }
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
        new ProgressPlugin()
      ]
    });
  }
}

export class WebpackBuildAOTPackage extends WebpackBuildProdPackage{
  constructor(name:string,dependencies?: Package[]){
      super(`${name}:aot`,dependencies);
  }

  getRules():[any]{
    return [{
      test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
      loader: '@ngtools/webpack'
    }];
  }
  getConfig():{[prop:string]:any}{
    return merge(super.getConfig,{
      plugins:[
        new AngularCompilerPlugin({
          tsConfigPath: this.resolveInProject('src','tsconfig.json'),
          entryModule: this.resolveInProject('src','app','app.module#AppModule'),
          sourceMap: true
        })
      ]
    })
  }
}

export class WebpackServePackage extends WebpackCommonPackage{
  constructor(name:string,dependencies?: Package[]){
      super(`${name}:serve`,dependencies);
  }

  getRules():[any]{
    return [{
      test: /\.ts$/,
      use: [{
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: this.resolveInProject('src', 'tsconfig.json')
        }
      },
        'angular2-template-loader'
      ]
    }]
  }

  getConfig():{[prop:string]:any}{
    return merge(super.getConfig,{
      devtool: 'cheap-module-eval-source-map',

      output: {
        path: this.resolveInProject('dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
      },

      module: {
        rules: [
          //typescript rule
          {
            test: /\.ts$/,
            use: [{
                loader: 'awesome-typescript-loader',
                options: {
                  configFileName: this.resolveInProject('src', 'tsconfig.json')
                }
              },
              'angular2-template-loader'
            ]
          }
        ]
      },

      plugins: [
        new ExtractTextPlugin('[name].css')
      ],

      devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        https: true
      }
    });
  }
}
