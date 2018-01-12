import { task } from 'gulp';
import { Server } from 'karma';

import { WebpackKarmaPackage } from '../packages/webpack-package';

export function createKarmaWebpackTask(karmaPack: WebpackKarmaPackage): void {
  task(`${karmaPack.getName()}:test`, (cb: (err?: any) => void) => {
    //Add webpack config to karma
    const karmaConfig: any = Object.assign({}, {
      files: [{ pattern: './src/test.ts', watched: false }],
      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
        './src/test.ts': ['webpack']
      },
      webpack: karmaPack.getConfig(),
      configFile: karmaPack.resolveInProject('karma.config.js')
    });
    //Start karma server
    new Server(karmaConfig, cb).start();
  });
}
