import { readFileSync } from 'fs';
import { InfoPackage,
  WebpackBuildAOTPackage,
  WebpackBuildProdPackage, WebpackKarmaPackage, WebpackServePackage
} from '@ngx-lab1100/packages';
import {ZipPackage} from '@ngx-lab1100/packages';
import {E2eProtractorPackage} from '@ngx-lab1100/packages';

export const infoPack = new InfoPackage('ngx-lab1100');
export const webpackBuildPack = new WebpackBuildProdPackage('ngx-lab1100');

export const webpackServePack = new WebpackServePackage('ngx-lab1100');
webpackServePack.https = {
  key: readFileSync(webpackServePack.resolveInProject('tools/ssl/ssl.key')),
  cert: readFileSync(webpackServePack.resolveInProject('tools/ssl/ssl.crt'))
};

export const webpackAOTPack = new WebpackBuildAOTPackage('ngx-lab1100');
export const zipPack = new ZipPackage('ngx-lab1100', [webpackAOTPack]);
export const e2ePack = new E2eProtractorPackage('ngx-lab1100');
export const krmPack = new WebpackKarmaPackage('ngx-lab1100');
export const i18nPack = new WebpackBuildAOTPackage('ngx-lab1100');
export const itPack = new WebpackBuildAOTPackage('ngx-lab1100-it');
