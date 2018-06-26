import { green, red } from 'ansi-colors';
import log = require('fancy-log');
import webpack = require('webpack');
import WebpackDevServer = require('webpack-dev-server');

const serve = require('webpack-serve');
const apiHistoryFallback = require('connect-history-api-fallback');
const e2k = require('koa-connect');

export function webpackCompile(config: webpack.Configuration, cb: (err?: any) => void): void {
    try {
        // Configure the compiler
        const compiler = webpack(config);
        compiler.name = 'ngx-lab1100';
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

export function webpackServe(config: webpack.Configuration, cb: (err?: any) => void): void {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const compiler = webpack(config);
    compiler.name = 'ngx-lab1100';
    serve({
        compiler,
        add: (app: any, midd: any, option: any) => {
            midd.webpack();
            midd.content();

            // History api fallback
            const historyApiOpton = {};
            app.use(e2k(apiHistoryFallback()));
        }
    }).catch(() => process.exit(1));
}
/**
 *  @deprecated
 * @param config
 * @param cb
 */
export function webpackDevServe(config: webpack.Configuration, cb: (err?: any) => void): void {
    // Create a server entry point to broswer reload
    WebpackDevServer.addDevServerEntrypoints(config, config.devServer);
    // Initialite webpack compiler
    const compiler = webpack(config);
    compiler.name = 'ngx-lab1100';
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
                (config.devServer.https ? 'https' : 'http'),
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
