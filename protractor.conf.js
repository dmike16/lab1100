const {
  SpecReporter
} = require('jasmine-spec-reporter');

exports.config = {
  directConnect: true,
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      args: ['allow-insecure-localhost']
    }
  },
  baseUrl: 'https://localhost:4200/',
  allScriptsTimeout: 11000,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
  }
};
