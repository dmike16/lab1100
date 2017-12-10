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
            options:{configFileName:helper.root('src','tsconfig.json')}
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
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helper = require('./helper');
const info = require(helper.root('package.json'));
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const VERSION = info.version;
const PROJECT_NAME = info.name;

module.exports = webpackMerge(commonConfig,{
  devtool: 'source-map',

  output: {
    path: helper.root('dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].chunk.js'
  },

  plugins:[
  //Clean dist on rebuild
    new CleanWebpackPlugin(['build'],{allowExternal: true}),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'boilerplate'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        mangle:{
          keep_fnames: true
        }
      }
    }),
    new ExtractTextPlugin('[name].[chunkhash].css'),
    new webpack.DefinePlugin({
      'process.env':{
        'ENV': JSON.stringify(ENV),
        'VERSION': JSON.stringify(VERSION),
        'PROJECT_NAME': JSON.stringify(PROJECT_NAME)
      }
    })
  ]
});
PROD
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
  cat > ${1}/tsconfig.json <<TSCONFIG
  {
    "compilerOptions": {
      "target": "es5",
      "module": "ES6",
      "moduleResolution": "node",
      "sourceMap": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "lib": ["es2015", "dom"],
      "noImplicitAny": true,
      "suppressImplicitAnyIndexErrors": true
    },
    "angularCompilerOptions":{
      "strictMetadataEmit": true
    }
  }
TSCONFIG
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
  ## gulpfile
  cat > ${1}/gulpfile.js <<GULP
/**
 * Gulp file configuration
 */
const gulp = require('gulp');

function loadTask(fileName,taskName){
  let task = require(\`./tools/gulp-task/\${fileName}\`);
  let tn = taskName || 'default';
  return task[tn](gulp);
}

gulp.task('default',loadTask('default'));
gulp.task('serve',loadTask('serve'));
gulp.task('build',loadTask('build'));
gulp.task('build:aot',loadTask('build','aot'));
gulp.task('build:pack',['build:aot'],loadTask('build','pack'));
GULP
  ## default task
  cat > ${2}/default.js <<DEFAULT
/**
 * Default gulp task
 */
const helper = require('../config/helper');
const info = require(helper.root('package.json'));
const gutil = require('gulp-util');

exports.default = (gulp)=>()=>{
  gutil.log(gutil.colors.blue(info.name));
  gutil.log(gutil.colors.green(info.description));
  gutil.log(gutil.colors.red(info.author.email));
  gutil.log(gutil.colors.red(info.repository.url));
};
DEFAULT
  ## serve task
  cat > ${2}/serve.js <<SERVE
/**
 * Gulp serve task
 */

function closeOnSign(closable, signs, callback) {
  if (typeof closable.close === 'function') {
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
}

exports.default = (gulp) => (cb) => {
  const devConfig = require('../config/webpack.dev');
  const webpack = require('webpack');
  const gutil = require('gulp-util');
  const WebpackDevServer = require('webpack-dev-server');
  //Extract and add some devServer config options
  const devServer = Object.assign({}, devConfig.devServer, {
    host: 'localhost',
    port: 4200,
    publicPath: devConfig.output.publicPath
  });
  //Create a server entry point to broswer reload
  WebpackDevServer.addDevServerEntrypoints(devConfig, devServer);
  //Initialite webpack compiler
  const compiler = webpack(devConfig);
  //Apply progress bar plugin
  compiler.apply(new webpack.ProgressPlugin());
  //Create the server instance
  const server = new WebpackDevServer(compiler, devServer);
  //Close serve un SIGINT,SIGTERM event
  closeOnSign(server, ['SIGINT', 'SIGTERM'], cb);
  server.listen(devServer.port, devServer.host, (err) => {
    if (err) {
      throw err;
    } else {
      let domain = [
        (devServer.https ? 'https' : 'http'),
        '://', devServer.host, ':', devServer.port
      ];
      gutil.log(' ');
      gutil.log(gutil.colors.green('Application serving at'));
      gutil.log(gutil.colors.green(domain.join('')));
    }
  });
};
SERVE
  ## build task
  cat > ${2}/build.js <<BUILD
/**
 * Gulp build task
 */

exports.default = (gulp) => (cb) => {
  const pump = require('pump');
  const prodaction = require('../config/webpack.prod');
  const webpack = require('webpack');
  const webpackStream = require('webpack-stream');
  const helper = require('../config/helper');
  const src = helper.root('src');
  pump([
    gulp.src([\`\${src}/main.ts\`,\`\${src}/polyfills.ts\`,\`\${src}/vendor.ts\`]),
    webpackStream({
      config: prodaction,
      progress: true
    }),
    gulp.dest(helper.root('build'))
  ],cb);
};

exports.aot = (gulp) => () => {
  const gutil = require('gulp-util');
  gutil.log('TO DO');
}

exports.pack = (gulp) => () => {
  const gutil = require('gulp-util');
  gutil.log('TO DO');
}
BUILD
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
  sass-loader node-sass && \
  touch .initialized

  return $?
}
