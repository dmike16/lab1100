import { task } from 'gulp';
import { webpackServe, webpackDevServe } from '@ngx-lab1100/process';
import { WebpackServePackage } from '@ngx-lab1100/packages';
import { certificateFor } from 'devcert';

export function createServeWebpackTask(servePack: WebpackServePackage): void {
    task(`${servePack.getName()}:serve`, (cb: (err?: any) => void) => {
        const argv = servePack.getArgv({ hmr: false });
        servePack.wbo.buildConfig.hmr = argv.hmr === true;
        certificateFor('localhost', { skipHostsFile: true }).then((certs) => {
            servePack.wbo.buildConfig.https = certs;
            webpackDevServe(servePack.getConfig(), cb);
            // TODO(dmike16 ):fix webpack-serve not reloading
            // webpackServe(servePack.getConfig(), cb);
        }).catch((err) => cb(err));
    });
}
