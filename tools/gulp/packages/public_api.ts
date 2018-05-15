import Package from './package';
import InfoPackage from './info-package';
import ZipPackage from './zip-package';
import E2eProtractorPackage from './e2e-protractor';

export { Package };
export { InfoPackage };
export {ZipPackage};
export {E2eProtractorPackage};
export { WebpackBuildProdPackage, WebpackBuildAOTPackage, WebpackServePackage, WebpackKarmaPackage } from './webpack-package';
export const _PACKAGE_JSON = require('../../../package.json');