import { task } from 'gulp';
import { WebpackBuildAOTPackage } from '@ngx-lab1100/packages';
import { webpackCompile } from '@ngx-lab1100/process';

export function createI18nTask(i18nPack: WebpackBuildAOTPackage) {
    task(`${i18nPack.getName()}:i18n`, (cb: (err?: any) => void) => {

        webpackCompile(i18nPack.getConfig(), cb);
    });
}
