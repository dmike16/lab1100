import { Configuration } from 'webpack';

import * as  webpack from 'webpack';
const WebpackDevMidd = require('webpack-dev-middleware');

let blocked: Array<() => void> = [];
let isBlocked = false;
let webpackMiddleware: any = null;

const build: any = (config: any, emitter: any, customFileHandlers: any) => {
    if (!config.ngxConfig) {
        throw new Error('The plugin is not mean to be used outside the ngx-lab1100 project.');
    }
    const { ngxConfig } = config;
    const webpackConfig: Configuration = ngxConfig.webpack;

    config.customContextFile = `${__dirname}/karma-context.html`;
    config.customDebugFile = `${__dirname}/karma-debug.html`;

    config.beforeMiddleware = ['@ngx-lab/request-blocker'];
    config.middleware = ['@ngx-lab/request-fallback'];

    webpackConfig.output.path = '/_karma_webpack_/';
    webpackConfig.output.publicPath = '/_karma_webpack_/';

    delete (webpackConfig.entry as any).styles;

    let compiler = null;
    try {
        compiler = webpack(webpackConfig);
    } catch (e) {
        console.error(e.stack || e);
        if (e.details) {
            console.error(e.details);
        }
        throw e;
    }

    compiler.hooks.invalid.tap('karma', () => isBlocked = true);
    compiler.hooks.watchRun.tapAsync('karma', (_, fn: () => any) => {
        isBlocked = true;
        fn();
    });
    compiler.hooks.run.tapAsync('karma', (_, fn: () => void) => {
        isBlocked = true;
        fn();
    });

    compiler.hooks.done.tap('karma', (stats: any) => {
        if (stats.compilation.errors.length > 0) {
            emitter.emit('run_complete', [], { exitCode: 1 });
        } else {
            emitter.refreshFiles();
            isBlocked = false;
            blocked.forEach((fn) => fn());
            blocked = [];
        }
    });

    webpackMiddleware = new WebpackDevMidd(compiler, {
        logLevel: 'error',
        publicPath: '/_karma_webpack_/'
    });

    // Forward requests to webpack server.
    customFileHandlers.push({
        urlRegex: /^\/_karma_webpack_\/.*/,
        handler: function handler(req: any, res: any) {
            webpackMiddleware(req, res, () => {
                // Ensure script and style bundles are served.
                // They are mentioned in the custom karma context page and we don't want them to 404.
                const alwaysServe = [
                    '/_karma_webpack_/runtime.js',
                    '/_karma_webpack_/polyfills.js',
                    '/_karma_webpack_/scripts.js',
                    '/_karma_webpack_/vendor.js',
                ];
                if (alwaysServe.indexOf(req.url) !== -1) {
                    res.statusCode = 200;
                    res.end();
                } else {
                    res.statusCode = 404;
                    res.end('Not found');
                }
            });
        }
    });

    emitter.on('exit', (done: () => void) => {
        webpackMiddleware.close();
        done();
    });
};

build.$inject = ['config', 'emitter', 'customFileHandlers'];

function blockerMiddleware() {
    return (req: any, res: any, next: () => void) => {
        if (isBlocked) {
            blocked.push(next);
        } else {
            next();
        }
    };
}

function fallbackMiddleware() {
    return (req: any, res: any, next: () => void) => {
        if (webpackMiddleware) {
            const webpackUrl = `/_karma_webpack_${req.url}`;
            const webpackReq = { ...req, url: webpackUrl };
            console.info('webpack middleware', webpackUrl);
            webpackMiddleware(req, res, next);
        } else {
            next();
        }
    };
}

export const NGX_LAB_FRAMWORK = {
    'framework:@ngx-lab/build-test': ['factory', build],
    'middleware:@ngx-lab/request-blocker': ['factory', blockerMiddleware],
    'middleware:@ngx-lab/request-fallback': ['factory', fallbackMiddleware]
};
