import {
  Configuration
} from 'webpack';
import { Package, root } from './package';
import { WebpackOption, webpackCommon, webpackBroswer, webpackStyles, webpackJIT, webpackTest, webpackAOT, resolveTsConfigTarget } from '@ngx-lab1100/configuration';
import { readFileSync } from 'fs';

const merge = require('webpack-merge');
/**
 * Common class to all webpack packages
 */
export abstract class WebpackCommonPackage extends Package {

  protected wbo: WebpackOption;
  constructor(name: string, dependencies?: Package[]) {
    super(`${name}:webpack`, dependencies);
    const tsConfig = this.resolveInProject('src', 'tsconfig.app.json');
    const target = resolveTsConfigTarget(tsConfig).toLowerCase();

    this.wbo = {
      projectRoot: this.resolveInProject('.'),
      root: this.resolveInProject('src'),
      tsConfigPath: tsConfig,
      es2015support: target === 'es2015' || target === 'es6' || target === 'esnext',
      buildConfig: null
    };
  }
}
/**
 * Build webpack package
 *
 */
export class WebpackBuildJITPackage extends WebpackCommonPackage {
  constructor(name: string, wco?: WebpackOption, dependencies?: Package[]) {
    super(`${name}:jit`, dependencies);
    this.wbo = {
      ...this.wbo,
      buildConfig: {
        env: 'production',
        buildOptimization: true,
        deployPath: '/',
        recordsPath: 'records.json',
        extractCss: true,
        higherCompression: true,
        sourceMap: true,
        indexHTML: 'index.html',
        platform: 'broswer',
        outputPath: '../build',
        main: './main.ts',
        styles: []
      },
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
 * AOT build package
 */
export class WebpackBuildAOTPackage extends WebpackCommonPackage {

  constructor(name: string, wco?: WebpackOption, dependencies?: Package[]) {
    super(`${name}:aot`, dependencies);
    this.wbo = {
      ...this.wbo,
      buildConfig: {
        env: 'production',
        buildOptimization: true,
        deployPath: '/',
        recordsPath: 'records.json',
        extractCss: true,
        higherCompression: true,
        sourceMap: true,
        indexHTML: 'index.html',
        platform: 'broswer',
        outputPath: '../build',
        main: './main.ts',
        styles: []
      },
      ...wco
    };
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
      ...this.wbo,
      buildConfig: {
        env: 'development',
        buildOptimization: false,
        deployPath: '/',
        extractCss: false,
        higherCompression: false,
        sourceMap: true,
        indexHTML: 'index.html',
        platform: 'broswer',
        outputPath: '../build',
        main: './main.ts',
        styles: []
      },
      ...wco
    };
  }

  getConfig(): Configuration {
    const configurations = [
      webpackCommon(this.wbo),
      webpackBroswer(this.wbo),
      webpackStyles(this.wbo),
      webpackJIT(this.wbo),
      {
        devServer: {
          historyApiFallback: true,
          stats: 'minimal',
          https: {
            key: readFileSync(this.resolveInProject('tools/ssl/ssl.key')),
            cert: readFileSync(this.resolveInProject('tools/ssl/ssl.crt'))
          },
          host: 'localhost',
          port: 4200
        }
      }
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
      ...this.wbo,
      buildConfig: {
        env: 'development',
        buildOptimization: false,
        deployPath: '/',
        extractCss: false,
        higherCompression: false,
        sourceMap: true,
        indexHTML: 'index.html',
        platform: 'broswer',
        outputPath: '../build',
        main: './main.ts',
        styles: []
      },
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
