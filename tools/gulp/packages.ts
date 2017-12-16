import { readFileSync } from 'fs';

import InfoPackage from './packages/info-package';
import {
  WebpackBuildProdPackage,
  WebpackBuildAOTPackage,
  WebpackServePackage
} from './packages/webpack-package';
import ZipPackage from './packages/zip-package';

export const infoPack = new InfoPackage('lab1100');
export const webpackBuildPack = new WebpackBuildProdPackage('lab1100');

export const webpackServePack = new WebpackServePackage('lab1100');
webpackServePack.https = {
  key: readFileSync(webpackServePack.resolveInProject('tools/ssl/ssl.key')),
  cert: readFileSync(webpackServePack.resolveInProject('tools/ssl/ssl.crt'))
}

export const webpackAOTPack = new WebpackBuildAOTPackage('lab1100');
export const zipPack = new ZipPackage('lab1100', [webpackAOTPack]);
