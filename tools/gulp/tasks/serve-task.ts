import { task } from 'gulp';
import WebpackDevServer = require('webpack-dev-server');
import { webpackServe } from '@ngx-lab1100/process';
import { WebpackServePackage } from '@ngx-lab1100/packages';

export function createServeWebpackTask(servePack: WebpackServePackage): void {
    task(`${servePack.getName()}:serve`, (cb: (err?: any) => void) => {
        webpackServe(servePack.getConfig(), servePack.https, cb);
    });
}
