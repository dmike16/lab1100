import { WebpackKarmaPackage } from '@ngx-lab1100/packages';
export function runKarmaTest(krmPack: WebpackKarmaPackage, done: () => void) {
    // Karma need to be included into the function
    // because during the configuraion process re-register  ts-node
    const karma = require('karma');
    // Add webpack config to karma
    const karmaConfig: any = Object.assign({}, {
        files: [{ pattern: './test.ts', watched: false }],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test.ts': ['webpack']
        },
        webpack: krmPack.getConfig(),
        configFile: krmPack.resolveInProject('src', 'karma.config.js')
    });
    // Start karma server
    const server = new karma.Server(karmaConfig, (exitCode: any) => {
        (exitCode === 0) ? done() : process.exit(exitCode);
    });
    server.start();
}
