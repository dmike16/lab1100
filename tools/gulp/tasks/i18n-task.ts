import { task, src } from 'gulp';
import pump = require('pump');
import { WebpackBuildAOTPackage } from '../packages/webpack-package';

export function createI18nTask(i18nPack: WebpackBuildAOTPackage) {
    task(`${i18nPack.getName()}:i18n`, (cb) => {
        const source = i18nPack.resolveInProject('src');
        i18nPack.options = {
            i18nOutFile: i18nPack.resolveInProject('src', 'locale', 'message.xlif'),
            i18nOutFormat: 'xlif',
            locale: 'en'
        } as any;
        //TODO new build process
    });
}
