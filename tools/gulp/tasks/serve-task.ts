import { task } from 'gulp';
import { webpackServe, webpackDevServe } from '@ngx-lab1100/process';
import { WebpackServePackage } from '@ngx-lab1100/packages';

export function createServeWebpackTask(servePack: WebpackServePackage): void {
    task(`${servePack.getName()}:serve`, (cb: (err?: any) => void) => {
        const argv = servePack.getArgv({ hmr: 'false' });
        servePack.wbo.buildConfig.hmr = argv.hmr === 'true';
        // TODO: dmike16 fix webpack-serve not reloading
        webpackDevServe(servePack.getConfig(), cb);
        // webpackServe(servePack.getConfig(), cb);
    });
}
