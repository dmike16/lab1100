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
