import { task } from 'gulp';
import { WebpackBuildAOTPackage } from '@ngx-lab1100/packages';
import { webpackCompile } from '@ngx-lab1100/process';

export function createI18nTask(i18nPack: WebpackBuildAOTPackage) {
    task(`${i18nPack.getName()}:i18n`, (cb: (err?: any) => void) => {
       /* i18nPack.options = {
            i18nOutFile: i18nPack.resolveInProject('src', 'locale', 'message.xlif'),
            i18nOutFormat: 'xlif',
            locale: 'en'
        } as any;
        */

        webpackCompile(i18nPack.getConfig(), cb);
    });
}
