#
#
#  Author       : dmike
#  Date         : 23 September 2017
#  Description  : TODO
#
# ============================================================================ #

# ============================================================================ #
# Create an helper for path resolve
# Globals:
#  None
# Arguments:
#  Directory where save the file
# Returns:
#  Cat exit status
# ============================================================================ #
function setup__path_helper() {
  cat > ${1}/helper.js <<HELPER
const path = require('path');
const _root = path.resolve(__dirname,'../..');

function root(){
  let args = Array.prototype.slice.call(arguments,0);
  return path.join.apply(path,[_root].concat(args));
}

exports.root = root;
HELPER
  return $?
}

# ============================================================================ #
# Create common configuration for webpack
# Globals:
#  None
# Arguments:
#  Directory where save the file
# Returns:
#  Cat exit status
# ============================================================================ #
function setup__config_common() {
  cat > ${1}/webpack.common.js <<COMMON
const helper = require('./helper');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Entry Points
  entry:{
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },
  // Ext to resolve when is not specified
  resolve:{
    extensions: ['.ts','.js']
  },
 //Module section
  module:{
    rules:[
    //typescript rule
      {
        test: /\.ts$/,
        use:[
          {
            loader: 'awesome-typescript-loader',
            options:{configFileName:helper.root('src','tsconfig.app.json')}
          },
          'angular2-template-loader'
        ]
      },
      //Html rule
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options:{minimize:false}
        }
      },
      //Image and fonts rule
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: ['file-loader?name=assets/[name].[hash].[ext]']
      },
      //Css in assets rule
      {
        test: /\.scss$/,
        exclude: helper.root('src','app'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {sourceMap:true}
          },
          {
            loader: 'sass-loader',
            options: {sourceMap: true}
          }]
        })
      },
      // Css in app folder rule
      {
        test: /.scss$/,
        include: helper.root('src','app'),
        use: ['raw-loader','sass-loader']
      }
    ]
  },

  plugins:[
  //Fix an angular2 warning
    new webpack.ContextReplacementPlugin(
      /angular(\\\\|\/)core(\\\\|\/)(@angular|esm5)/,
      helper.root('./src'),
      {}
    ),
  //Optimize common dependencies
    new webpack.optimize.CommonsChunkPlugin({
      name:['app','vendor','polyfills']
    }),
  // Fill the index.html with buldle geneated
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};
COMMON
  return $?
}
# ============================================================================ #
# Create developemnt configuration
# Globals:
#  None
# Arguments:
#  None
# Returns:
#  cat exit status
# ============================================================================ #
function setup__config_dev() {
  cat >${1}/webpack.dev.js <<DEV
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helper = require('./helper');

module.exports = webpackMerge(commonConfig,{
  devtool: 'cheap-module-eval-source-map',

  output:{
    path: helper.root('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins:[
    new ExtractTextPlugin('[name].css')
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    https: true
  }
});
DEV
  return $?
}
# ============================================================================ #
# Create production configuration
# Globals:
#  None
# Arguments:
#  None
# Returns:
#  cat exit status
# ============================================================================ #
function setup__config_production() {
  cat >${1}/webpack.prod.js <<PROD
  const webpackMerge = require('webpack-merge');
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  const commonConfig = require('./webpack.common.js');
  const {plugins} = require('./webpack.prod.env');
  const helper = require('./helper');

  module.exports = webpackMerge(commonConfig,{
    devtool: 'source-map',

    output: {
      path: helper.root('build'),
      publicPath: '/lab1100/',
      filename: '[name].[chunkhash].js',
      chunkFilename: '[id].[chunkhash].chunk.js'
    },

    module: {
      rules: [
        //typescript rule
        {
          test: /\.ts$/,
          use: [{
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: helper.root('src', 'tsconfig.app.json')
              }
            },
            'angular2-template-loader'
          ]
        }
      ]
    },

    plugins:[
      ...plugins
    ]
  });
PROD
  cat > ${1}/webpack.prod.env.js <<PRODENV
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const helper = require('./helper');
const info = require(helper.root('package.json'));
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const VERSION = info.version;
const PROJECT_NAME = info.name;

module.exports = {
  plugins: [
    //Clean dist on rebuild
    new CleanWebpackPlugin([helper.root('build')], {
      allowExternal: true
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'boilerplate'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        mangle: {
          keep_fnames: true
        }
      }
    }),
    new ExtractTextPlugin('[name].[chunkhash].css'),
    new webpack.DefinePlugin(
    {
        'process.env': {
        'ENV': JSON.stringify(ENV),
        'VERSION': JSON.stringify(VERSION),
        'PROJECT_NAME': JSON.stringify(PROJECT_NAME)
      }
    }),
    new webpack.ProgressPlugin()
  ]
};
PRODENV
  cat > ${1}/webpack.prod.aot.js <<PRODAOT
const {AngularCompilerPlugin} = require('@ngtools/webpack');
const {plugins} = require('./webpack.prod.env');
const webpackMerge = require('webpack-merge');
const prodaction = require('./webpack.prod');
const common = require('./webpack.common');
const helper = require('./helper');

module.exports = webpackMerge(common, {
  devtool: prodaction.devtool,
  output: prodaction.output,

  module: {
    rules: [{
      test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
      loader: '@ngtools/webpack'
    }]
  },

  plugins: [
    new AngularCompilerPlugin({
      tsConfigPath: helper.root('src','tsconfig.app.json'),
      entryModule: helper.root('src','app','app.module#AppModule'),
      sourceMap: true
    }),
    ...plugins
  ]
});
PRODAOT
}
# ============================================================================ #
# Create the package.json with param passed from
# Globals:
#  None
# Arguments:
#  $1: project name
#  $2: description
#  $3: license
#  $4: author
# Returns:
#  cat exit statuts
# ============================================================================ #
function setup__package_json() {
  cat > package.json <<PACKAGE
  {
    "name": "$1",
    "version": "1.0.0",
    "description": "$2",
    "scripts": {
      "info": "gulp",
      "start": "gulp serve",
      "build": "gulp build",
      "prod": "gulp build:aot",
      "dist": "gulp pack",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "$4",
    "license": "$3"
  }
PACKAGE
}

# ============================================================================ #
# Create typescript compiler config file
# Globals:
#  None
# Arguments:
#  $1: location of file
# Returns:
#  cat exit statuts
# ============================================================================ #
function setup__typescript_config() {
  cat > ./tsconfig.json <<TSCONFIG
  {
    "compileOnSave": false,
    "compilerOptions": {
      "outDir": "./build/out-tsc",
      "sourceMap": true,
      "declaration": false,
      "moduleResolution": "node",
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "noImplicitAny": true,
      "target": "es5",
      "typeRoots": [
        "node_modules/@types"
      ],
      "lib": [
        "es2017",
        "dom"
      ]
    },
    "angularCompilerOptions": {
      "preserveWhitespaces": false
    }
  }
TSCONFIG

cat > ${1}/tsconfig.app.json <<TSCONFIG_APP
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "ES6",
    "types": ["node"]
  },
  "exclude": [
    "test.ts",
    "**/*.spec.ts"
  ],
  "angularCompilerOptions": {
    "strictMetadataEmit": true
  }
}
TSCONFIG_APP

cat > ${1}/tsconfig.spec.json <<TSCONFIG_SPEC
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../out-tsc/spec",
    "module": "ES6",
    "target": "es5",
    "types": [
      "jasmine",
      "node"
    ]
  },
  "files": [
    "test.ts"
  ],
  "include": [
    "**/*.spec.ts",
    "**/*.d.ts"
  ]
}
TSCONFIG_SPEC
}

# ============================================================================ #
# Create intial polyfill ts file
# Globals:
#  None
# Arguments:
#  $1: location of the file
# Returns:
#  cat exit statuts
# ============================================================================ #
function setup__polyfill_ts() {
  cat > ${1}/polyfills.ts <<POLYFILL
import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');

if(process.env.ENV === 'production'){
  //Production
}else{
  //Development
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}
POLYFILL
}

# ============================================================================ #
# Create initial vendor ts file
# Globals:
#  None
# Arguments:
#  $1: location of file
# Returns:
#  cat exit statuts
# ============================================================================ #
function setup__vendor_ts() {
  cat > ${1}/vendor.ts <<VENDOR
// Angular
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';

// RxJS
import 'rxjs';

// Other vendors for example jQuery, Lodash or Bootstrap
// You can import js, ts, css, sass, ...
// To import bootstrap type npm install --save bootstrap and uncomment line below
//import 'bootstrap/dist/css/bootstrap.min.css';
VENDOR
}

# ============================================================================ #
# Create bootstrap angular file plus index.html
# Globals:
#  None
# Arguments:
#  $1: location of files
# Returns:
#  cat exit status
# ============================================================================ #
function setup__angular_bootstrap() {
## index.html
  cat > ${1}/index.html <<INDEX
<!DOCTYPE html>
<html>
  <head>
    <base href="/">
    <title>Angular With Webpack</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <my-app class="container-fluid">Loading...</my-app>
  </body>
</html>
INDEX

## main.ts bootstrap file
  cat > ${1}/main.ts <<MAIN
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';

if (process.env.ENV === 'production') {
  enableProdMode();
  console.log(\`%c\${process.env.PROJECT_NAME}\`,'font-size:13px;color:#0147A7;');
  console.log(\`%cv\${process.env.VERSION}\`,'font-size:11px;color:#c4342e;');
}

platformBrowserDynamic().bootstrapModule(AppModule);
MAIN
}

# ============================================================================ #
# Create file for first component
# Globals:
#  None
# Arguments:
#  $1: location of files
# Returns:
#  cat exit status
# ============================================================================ #
function setup__angular_comp() {
## app typescript
  cat > ${1}/app.component.ts<<APPTS
import { Component } from '@angular/core';

import '../assets/css/styles.scss';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  pageTitle: string = "Angular2 Webpack";
}
APPTS
## app css
  cat > ${1}/app.component.scss <<APPCSS
main {
  padding: 1em;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
  margin-top: 50px;
  display: block;
}
APPCSS
## app html
  cat > ${1}/app.component.html <<APPHTML
<main>
  <h1>{{ pageTitle }}</h1>
  <!-- Download the image from angular documentation -->
  <img src="../assets/images/angular.png">
</main>
APPHTML
## app module
  cat > ${1}/app.module.ts <<APPMODULE
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
APPMODULE
}

# ============================================================================ #
# Create gulp task setup
# Globals:
#  None
# Arguments:
#  Directory where save the file
# Returns:
#  Cat exit status
# ============================================================================ #
function setup__gulp_setup() {
  ## gulpfile js
  cat > ${1}/gulpfile.js <<GULPJS
  /**
   * Gulp file usgin ts-node + typescript
   */
  const path = require('path');
  const tsconfigPath = path.join(__dirname,'tools/gulp/tsconfig.json');

  require('ts-node').register({
    project: tsconfigPath
  });
  require('./tools/gulp/gulpfile');
GULPJS
  ## gulpfile ts
  cat > ${2}/gulpfile.ts <<GULPTS
import createInfoTask from './tasks/info-task';
import { createServeWebpackTask } from './tasks/serve-task';
import { createBuildWebpackTask } from './tasks/build-task';
import { createZipDistTask } from './tasks/dist-task';

import { infoPack, webpackServePack, webpackBuildPack, webpackAOTPack, zipPack } from './packages';

createInfoTask(infoPack);
createServeWebpackTask(webpackServePack);
createBuildWebpackTask(webpackBuildPack);
createBuildWebpackTask(webpackAOTPack);
createZipDistTask(zipPack);

import './tasks/default';
GULPTS
  ## package.ts
  cat > ${2}/packages.ts <<PACKS
import InfoPackage from './packages/info-package';
import {
  WebpackBuildProdPackage,
  WebpackBuildAOTPackage,
  WebpackServePackage
} from './packages/webpack-package';
import ZipPackage from './packages/zip-package';

export const infoPack = new InfoPackage('lab1100');
export const webpackBuildPack = new WebpackBuildProdPackage('lab1100');

export const webpackServePack = new WebpackServePackage('lab1100');

export const webpackAOTPack = new WebpackBuildAOTPackage('lab1100');
export const zipPack = new ZipPackage('lab1100', [webpackAOTPack]);
PACKS
  ## gulp tsconf
  cat > ${2}/tsconfig.json <<GTSCONF
{
  "compileOnSave": false,
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES6",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "alwaysStrict": true,
    "declaration": true,
    "lib": [
      "ES6", "ES2015"
    ],
    "typeRoots": ["./node_modules/@types", "./types"],
    "types": ["node", "gulp", "gulp-util", "package.json", "webpack", "webpack-dev-server", "webpack-merge", "extract-text-webpack-plugin", "clean-webpack-plugin",
      "html-webpack-plugin","pump","webpack-stream","run-sequence","gulp-zip"
    ]
  },
  "files": [
    "gulpfile.ts"
  ]
}
GTSCONF
  local packs="${2}/packages"
  local tasks="${2}/tasks"
  local types="${2}/types"
  ## packages
  mkdir -p ${packs} || return $?
  cat > ${packs}/package.ts <<PACKAGES
import {resolve,join} from 'path';
/**
 * Abstract Package class
 * @param  {string}   name         [package name]
 * @param  {Package[]} dependencies [dependencies]
 */
export default abstract class Package{

  constructor(protected name:string,protected dependencies?: Package[]){}

  getName(): string{
    return this.name;
  }

  getDepsPackages(): Package[]{
    return this.dependencies;
  }

  getDepsTasks(phase?:string):string[]{
    const suffix = (phase)?\`:\${phase}\`:'';
    return this.dependencies.map((p) =>{
      return \`\${p.getName()}\${suffix}\`;
    });
  }

  resolveInProject(...path: string[]):string{
    return join(root,...path);
  }

  abstract getConfig():{[prop:string]:any};
}

export const root :string = resolve(__dirname,'../../../');
PACKAGES
  ## info pack
  cat > ${packs}/info-package.ts <<INFO
import Package from './package';
import {log,colors} from 'gulp-util';

import * as data from '../../../package.json';

export default class InfoPackage extends Package{
  constructor(name:string,dependencies?:Package[]){
    super(name,dependencies);
  }

  getConfig():{[prop:string]:any}{
    return {
      'blue': [data.name],
      'green': [data.description],
      'red':[data.author.email,data.repository.url]
    }
  }
}
INFO
  ## webpack pack
  cat > ${packs}/webpack-package.ts <<WEBPACK
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
    super(\`\${name}:webpack\`, dependencies);
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
          /angular(\\\\|\/)core(\\\\|\/)(@angular|esm5)/,
          this.resolveInProject('./src'),
          {}
        ),
        //Optimize common dependencies
        new optimize.CommonsChunkPlugin({
          names: ['app', 'vendor', 'polyfills']
        }),
        // Fill the index.html with buldle geneated
        new HtmlWebpackPlugin({
          template: 'src/index.html'
        })
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
          name: 'boilerplate'
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
    super(\`\${name}:aot\`, dependencies);
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
        rules: [
          //typescript rule
          {
            test: /\.ts$/,
            use: [{
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: this.resolveInProject('src', 'tsconfig.app.json')
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
        https: (this.https === true ? true : this.https ? this.https : false),
        host: 'localhost',
        port: 4200
      }
    });
  }
}
WEBPACK
  ## zip pack
  cat > ${packs}/zip-package.ts <<ZIPACK
import Package from './package';
import { root } from './package';

export default class ZipPackage extends Package {

  getConfig(): { [prop: string]: any } {
    return {
      source: \`\${root}/build/**/*\`,
      name: \`\${this.name}.zip\`,
      target: \`\${root}/build/Release\`
    };
  }
}
ZIPACK
  ## tasks
  mkdir -p "${tasks}" || return $?
  ## default
  cat > ${tasks}/default.ts <<DEFAULT
import {task} from 'gulp';
import {log,colors} from 'gulp-util';

task('default',()=>{
  log(colors.yellow('      === GULP ===     '));
  log(colors.yellow('Default gulp tasks.'));
  log(colors.yellow('Read the package json script prop'));
  log(colors.yellow('to find out the runnable tasks'));
  log(colors.yellow('      === GULP ===     '));
});
DEFAULT
  ## info
  cat > ${tasks}/info-task.ts <<INFO
import {task} from 'gulp';
import {log,colors} from 'gulp-util';

import InfoPackage from '../packages/info-package';

export default function createInfoTask(infoPack: InfoPackage):void{
  const config = infoPack.getConfig();
  const color:{[p:string]:any} = {
    'blue': colors.blue,
    'red':colors.red,
    'green':colors.green
  }
  task(\`\${infoPack.getName()}:info\`,async ()=>{
    for(let key in config){
      config[key].forEach((value:any)=>{
        log(color[key](value));
      });
    }
  });
}
INFO
  ## serve
  cat > ${tasks}/serve-tasks.ts <<SERVE
import { task } from 'gulp';
import { log, colors } from 'gulp-util';
import webpack = require('webpack');
import WebpackDevServer = require('webpack-dev-server');

import { WebpackServePackage } from '../packages/webpack-package';

export function createServeWebpackTask(servePack: WebpackServePackage): void {
    task(\`\${servePack.getName()}:serve\`, (cb: (err?:any) => void) => {
        const config: webpack.Configuration= servePack.getConfig();
        //Create a server entry point to broswer reload
        WebpackDevServer.addDevServerEntrypoints(config, config.devServer);
        //Initialite webpack compiler
        const compiler = webpack(config);
        //Apply progress bar plugin
        compiler.apply(new webpack.ProgressPlugin());
        //Create the server instance
        const server = new WebpackDevServer(compiler, config.devServer);
        //Close serve un SIGINT,SIGTERM event
        closeOnSign(server, ['SIGINT', 'SIGTERM'], cb);
        server.listen(config.devServer.port, config.devServer.host, (err:any) => {
            if (err) {
                throw err;
            } else {
                const domain = [
                    (servePack.https ? 'https' : 'http'),
                    '://', config.devServer.host, ':', config.devServer.port
                ];
                log(' ');
                log(colors.green('Application serving at'));
                log(colors.green(domain.join('')));
            }
        });
    });
}

function closeOnSign(closable: { close: (cb?:Function) => void }, signs: any[], callback: (err?:any) => void) {
    let onSign = () => {
        callback();
        closable.close(() => {
            process.exit();
        });
    };
    for (let sign of [...signs]) {
        process.on(sign, onSign);
    }
}
SERVE
  ## build task
  cat > ${tasks}/build-task.ts <<BUILD
import {task,src,dest} from 'gulp';
import webpack = require('webpack');
import webpackStream = require('webpack-stream');
import pump = require('pump');

import {WebpackBuildProdPackage} from '../packages/webpack-package';

export function createBuildWebpackTask(buildPack: WebpackBuildProdPackage){
  const source = buildPack.resolveInProject('src');
  const target = buildPack.resolveInProject('build');
  task(\`\${buildPack.getName()}:build\`,(cb:(err?:any)=>void)=>{
    pump([
      src([\`\${source}/main.ts\`,\`\${source}/polyfills.ts\`,\`\${source}/vendor.ts\`]),
      webpackStream(buildPack.getConfig(),webpack),
      dest(target)
    ],cb);
  });
}
BUILD
  ## dist
  cat > ${tasks}/dist-task.ts <<DIST
import { task, src, dest } from 'gulp';
import runSeq = require('run-sequence');
import pump = require('pump');
import zip = require('gulp-zip');

import ZipPackage from '../packages/zip-package';

export function createZipDistTask(zipPack: ZipPackage) {
    const config = zipPack.getConfig();
    task(\`\${zipPack.getName()}:zip\`, (cb) => {
        runSeq(zipPack.getDepsTasks('build'), () => {
            createArchive(zipPack.getConfig(), cb);
        });
    });
}

function createArchive(config: { [prop: string]: any }, cb: (err?: any) => void) {
    pump([
        src(config.source),
        zip(config.name),
        dest(config.target)
    ], cb);
}
DIST
  ## types
  mkdir -p ${types} || return $?
  ## json
  cat > ${types}/json.d.ts <<JSON
declare module "*.json"{
  const value: any;
  export default value;
}
JSON
  return $?
}

# ============================================================================ #
# Create principal css style file
# Globals:
#  None
# Arguments:
#  $1: location of file
# Returns:
#  cat exit status
# ============================================================================ #
function setup__angular_style() {
  cat > ${1}/styles.scss<<STYLES
body {
    background: #0147A7;
    color: #333;
}
STYLES
}

# ============================================================================ #
# Download angular
# Globals:
#
# Arguments:
#
# Returns:
#
# ============================================================================ #
function setup__angular_image() {
  curl -L# https://angular.io/assets/images/logos/angular/angular.png -o "${1}/angular.png"
  return 0
}
# ============================================================================ #
# Install angular 2 dependencies
# Globals:
#  None
# Arguments:
#  None
# Returns:
#  npm command exit statuts
# ============================================================================ #
function setup__angular_dep() {
  ${1} @angular/common @angular/compiler @angular/core \
  @angular/forms @angular/http @angular/platform-browser  \
  @angular/platform-browser-dynamic @angular/router core-js rxjs zone.js && \
  ${2} @types/node @types/jasmine angular2-template-loader \
  awesome-typescript-loader css-loader extract-text-webpack-plugin file-loader \
  html-loader html-webpack-plugin jasmine-core raw-loader style-loader \
  typescript webpack webpack-dev-server webpack-merge clean-webpack-plugin \
  gulp gulp-zip gulp-util pump webpack-stream @ngtools/webpack @angular/language-service \
  @angular/compiler-cli sass-loader node-sass && \
  touch .initialized

  return $?
}
