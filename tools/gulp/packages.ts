import InfoPackage from './packages/info-package';
import {
  WebpackBuildProdPackage,
  WebpackBuildAOTPackage,
  WebpackServePackage
} from './packages/webpack-package';

export const infoPack = new InfoPackage('lab1100');
export const webpackBuildPack = new WebpackBuildProdPackage('lab1100');
export const webpackServePack = new WebpackServePackage('lab1100');
export const webpackAOTPack = new WebpackBuildAOTPackage('lab1100');
