import { task } from 'gulp';
import { log, colors } from 'gulp-util';
import webpack = require('webpack');
import WebpackDevServer = require('webpack-dev-server');

import { WebpackServePackage } from '../packages/webpack-package';

export function createServeWebpackTask(servePack: WebpackServePackage): void {
    task(`${servePack.getName()}:serve`, (cb: (err?:any) => void) => {
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
