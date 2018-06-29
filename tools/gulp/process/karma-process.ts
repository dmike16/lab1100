import { WebpackKarmaPackage } from '@ngx-lab1100/packages';
export function runKarmaTest(krmPack: WebpackKarmaPackage, done: () => void) {
    // Karma need to be included into the function
    // because during the configuraion process re-register  ts-node
    const karma = require('karma');
    // Add webpack config to karma
    const karmaConfig: any = Object.assign({}, {
        // webpack: krmPack.getConfig(),
        configFile: `${krmPack.wbo.root}/karma.config.js`,
        ngxConfig: { webpack: krmPack.getConfig() },
        plugins: [
            require('karma-jasmine'),
            require('karma-jasmine-html-reporter'),
            require('karma-firefox-launcher'),
            require('../plugins/karma')
        ]
    });
    // Start karma server
    const server = new karma.Server(karmaConfig, (exitCode: any) => {
        (exitCode === 0) ? done() : process.exit(exitCode);
    });
    server.start();
}
