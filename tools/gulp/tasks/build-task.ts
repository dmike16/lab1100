import { task } from 'gulp';

import { WebpackBuildProdPackage, WebpackBuildAOTPackage } from '@ngx-lab1100/packages';
import {webpackCompile} from '@ngx-lab1100/process';

export function createBuildWebpackTask(buildPack: WebpackBuildProdPackage) {
  task(`${buildPack.getName()}:build`, (cb: (err?: any) => void) => {
    webpackCompile(buildPack.getConfig(), cb);
  });
}

export function createBuildIT(buildPack: WebpackBuildAOTPackage, translation: string) {
  buildPack.options = {
    i18nInFile: buildPack.resolveInProject('src', 'locale', translation),
    i18nInFormat: 'xlif',
    locale: 'it',
    missingTranslation: 'warning'
  } as any;
  createBuildWebpackTask(buildPack);
}
