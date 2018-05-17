import { green, red } from 'ansi-colors';
import log = require('fancy-log');
import webpack = require('webpack');
import WebpackDevServer = require('webpack-dev-server');

export function webpackCompile(config: webpack.Configuration, cb: (err?: any) => void): void {
    try {
        // Configure the compiler
        const compiler = webpack(config);
        // Run compilation process
        compiler.run((err, stats) => {
            if (err) {
                log(red(err.stack || err.toString()));
                if ((err as any).details) {
                    log(red((err as any).details));
                }
                cb(err);
            } else {
                if (stats.hasErrors()) {
                    const json = stats.toJson('errors-only');
                    json.errors.forEach((error: string) => {
                        log(red(error));
                    });
                } else {
                    log(stats.toString({
                        colors: true
                    }));
                }
                cb(null);
            }

        });
    } catch (err) {
        cb(err);
    }
}

export function webpackServe(config: webpack.Configuration, secure: boolean, cb: (err?: any) => void): void {
    // Create a server entry point to broswer reload
    WebpackDevServer.addDevServerEntrypoints(config, config.devServer);
    // Initialite webpack compiler
    const compiler = webpack(config);
    // Apply progress bar plugin
    compiler.apply(new webpack.ProgressPlugin());
    // Create the server instance
    const webpackDevServerOpts = Object.assign(config.devServer, {
        stats: {
            cached: false,
            cachedAssets: false,
            colors() {
                return require('supports-color');
            }
        }
    });
    const server = new WebpackDevServer(compiler, config.devServer);
    // Close serve un SIGINT,SIGTERM event
    closeOnSign(server, ['SIGINT', 'SIGTERM'], () => true);
    server.listen(config.devServer.port, config.devServer.host, (err: any) => {
        if (err) {
            cb(err);
        } else {
            const domain = [
                (secure ? 'https' : 'http'),
                '://', config.devServer.host, ':', config.devServer.port
            ];
            log(' ');
            log(green('Application serving at'));
            log(green(domain.join('')));
            cb();
        }
    });
}

function closeOnSign(closable: { close: (cb?: () => void) => void }, signs: any[], callback: (err?: any) => void) {
    const onSign = () => {
        callback();
        closable.close(() => {
            process.exit();
        });
    };
    for (const sign of [...signs]) {
        process.on(sign, onSign);
    }
}
