import { readFileSync } from 'fs';
import { InfoPackage,
  WebpackBuildAOTPackage,
  WebpackBuildProdPackage, WebpackKarmaPackage, WebpackServePackage
} from '@ngx-lab1100/packages';
import {ZipPackage} from '@ngx-lab1100/packages';
import {E2eProtractorPackage} from '@ngx-lab1100/packages';

export const infoPack = new InfoPackage('lab1100');
export const webpackBuildPack = new WebpackBuildProdPackage('lab1100');

export const webpackServePack = new WebpackServePackage('lab1100');
webpackServePack.https = {
  key: readFileSync(webpackServePack.resolveInProject('tools/ssl/ssl.key')),
  cert: readFileSync(webpackServePack.resolveInProject('tools/ssl/ssl.crt'))
};

export const webpackAOTPack = new WebpackBuildAOTPackage('lab1100');
export const zipPack = new ZipPackage('lab1100', [webpackAOTPack]);
export const e2ePack = new E2eProtractorPackage('lab1100');
export const krmPack = new WebpackKarmaPackage('lab1100');
export const i18nPack = new WebpackBuildAOTPackage('lab1100');
export const itPack = new WebpackBuildAOTPackage('lab1100-it');
