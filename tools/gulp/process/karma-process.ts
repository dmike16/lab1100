import { WebpackKarmaPackage } from '@ngx-lab1100/packages';
export function runKarmaTest(krmPack: WebpackKarmaPackage, done: () => void) {
    const karma = require('karma');
    // Add webpack config to karma
    const karmaConfig: any = Object.assign({}, {
        files: [{ pattern: './src/test.ts', watched: false }],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './src/test.ts': ['webpack']
        },
        webpack: krmPack.getConfig(),
        configFile: krmPack.resolveInProject('karma.config.js')
    });
    // Start karma server
    const server = new karma.Server(karmaConfig, (exitCode: any) => {
        (exitCode === 0) ? done() : process.exit(exitCode);
    });
    server.start();
}
