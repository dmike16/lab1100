import {
  Configuration
} from 'webpack';
import { Package, root } from './package';
import { WebpackOption, webpackCommon, webpackBroswer, webpackStyles, webpackJIT, webpackTest, webpackAOT } from '@ngx-lab1100/configuration';

const merge = require('webpack-merge');
/**
 * Common class to all webpack packages
 */
export abstract class WebpackCommonPackage extends Package {

  protected wbo: WebpackOption;
  constructor(name: string, dependencies?: Package[]) {
    super(`${name}:webpack`, dependencies);
  }
}
/**
 * Build webpack package
 *
 */
export class WebpackBuildJITPackage extends WebpackCommonPackage {
  constructor(name: string, wco?: WebpackOption, dependencies?: Package[]) {
    super(`${name}:jit`, dependencies);
  }

  getConfig(): Configuration {
    const configurations = [
      webpackCommon(this.wbo),
      webpackBroswer(this.wbo),
      webpackStyles(this.wbo),
      webpackJIT(this.wbo)
    ];
    return merge(configurations);
  }
}
/**
 * AOT build package
 */
export class WebpackBuildAOTPackage extends WebpackCommonPackage {

  constructor(name: string, wco?: WebpackOption, dependencies?: Package[]) {
    super(`${name}:aot`, dependencies);
  }

  getConfig(): Configuration {
    const configurations = [
      webpackCommon(this.wbo),
      webpackBroswer(this.wbo),
      webpackStyles(this.wbo),
      webpackAOT(this.wbo)
    ];
    return merge(configurations);
  }
}
/**
 * Serve webpack server pacakge
 */
export class WebpackServePackage extends WebpackCommonPackage {

  constructor(name: string, wco?: WebpackOption, dependencies?: Package[]) {
    super(name, dependencies);
    this.wbo = {
      ...wco
    };
  }

  getConfig(): Configuration {
    const configurations = [
      webpackCommon(this.wbo),
      webpackBroswer(this.wbo),
      webpackStyles(this.wbo),
      webpackJIT(this.wbo)
    ];
    return merge(configurations);
  }
}
/**
 * Test webpack Karma package
 */
export class WebpackKarmaPackage extends WebpackCommonPackage {

  constructor(name: string, wco?: WebpackOption, dependencies?: Package[]) {
    super(name, dependencies);
    this.wbo = {
      ...wco
    };
  }

  getConfig(): Configuration {
    const configurations = [
      webpackCommon(this.wbo),
      webpackTest(this.wbo),
      webpackStyles(this.wbo),
      webpackJIT(this.wbo)
    ];
    return merge(configurations);
  }
}
