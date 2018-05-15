import { readFileSync } from 'fs';

import {
  InfoPackage,
  ZipPackage,
  E2eProtractorPackage,
  WebpackBuildProdPackage,
  WebpackBuildAOTPackage,
  WebpackServePackage,
  WebpackKarmaPackage
} from  '@ngx-lab1100/packages';

export const infoPack = new InfoPackage('lab1100');
export const webpackBuildPack = new WebpackBuildProdPackage('lab1100');

export const webpackServePack = new WebpackServePackage('lab1100');
webpackServePack.https = {
  key: readFileSync(webpackServePack.resolveInProject('tools/ssl/ssl.key')),
  cert: readFileSync(webpackServePack.resolveInProject('tools/ssl/ssl.crt'))
};

export const webpackAOTPack = new WebpackBuildAOTPackage('lab1100');
export const zipPack = new ZipPackage('lab1100', [webpackAOTPack]);
export const karmaPack = new WebpackKarmaPackage('lab1100');
export const e2ePack = new E2eProtractorPackage('lab1100');
export const i18nPack = new WebpackBuildAOTPackage('lab1100');
export const itPack = new WebpackBuildAOTPackage('lab1100-it');
