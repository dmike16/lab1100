import {
  Configuration
} from 'webpack';
import { Package, root } from './package';
import {
  WebpackOption, webpackCommon, webpackBroswer, webpackStyles,
  webpackJIT, webpackTest, webpackAOT, resolveTsConfigTarget, BuildOption
} from '@ngx-lab1100/configuration';
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
      buildConfig: {
        env: 'development',
        buildOptimization: false,
        deployPath: '/',
        sourceMap: true,
        higherCompression: false,
        extractCss: false,
        assets: [{ input: 'assets', output: '/assets', glob: '**/*' }],
        ingorePath: [],
        indexHTML: 'index.html',
        platform: 'broswer',
        outputPath: '../build',
        main: './main.ts',
        styles: [{ name: 'styles', path: './styles.scss' }]
      }
    };
  }

  protected mergeWBO(wbo: WebpackOption, defaultBuildOption: Partial<BuildOption>): WebpackOption {
    const { root, projectRoot, tsConfigPath, es2015support, buildConfig } = wbo ||
      { root: undefined, projectRoot: undefined, tsConfigPath: undefined, es2015support: undefined, buildConfig: undefined };
    return {
      root: root || this.wbo.root,
      projectRoot: projectRoot || this.wbo.projectRoot,
      tsConfigPath: tsConfigPath || this.wbo.tsConfigPath,
      es2015support: es2015support === undefined ? this.wbo.es2015support : es2015support,
      buildConfig: {
        ...this.wbo.buildConfig,
        ...defaultBuildOption,
        ...buildConfig
      }
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
    this.wbo = this.mergeWBO(wco, {
      env: 'production',
      buildOptimization: true,
      deployPath: '/',
      recordsPath: 'records.json',
      extractCss: true,
      higherCompression: true
    });
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
    this.wbo = this.mergeWBO(wco, {
      env: 'production',
      buildOptimization: true,
      deployPath: '/',
      recordsPath: 'records.json',
      extractCss: true,
      higherCompression: true
    });
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
    this.wbo = this.mergeWBO(wco, {});
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
    this.wbo = this.mergeWBO(wco, {});
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
