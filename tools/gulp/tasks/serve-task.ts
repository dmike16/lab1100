import { task } from 'gulp';
import { green } from 'ansi-colors';
import log = require('fancy-log');
import webpack = require('webpack');
import WebpackDevServer = require('webpack-dev-server');

import { WebpackServePackage } from '../packages/webpack-package';

export function createServeWebpackTask(servePack: WebpackServePackage): void {
    task(`${servePack.getName()}:serve`, (cb: (err?: any) => void) => {
        const config: webpack.Configuration = servePack.getConfig();
        // Create a server entry point to broswer reload
        WebpackDevServer.addDevServerEntrypoints(config, config.devServer);
        // Initialite webpack compiler
        const compiler = webpack(config);
        // Apply progress bar plugin
        compiler.apply(new webpack.ProgressPlugin({
            profile: true
        }));
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
                    (servePack.https ? 'https' : 'http'),
                    '://', config.devServer.host, ':', config.devServer.port
                ];
                log(' ');
                log(green('Application serving at'));
                log(green(domain.join('')));
                cb();
            }
        });
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
