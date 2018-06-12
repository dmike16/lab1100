import { dirname } from 'path';

import {Package} from './package';

export  class E2eProtractorPackage extends Package {
    constructor(name: string, dependecies?: Package[]) {
        super(`${name}:protractor`, dependecies);
    }

    laucher(): (...args: any[]) => void {
        return require(`${dirname(require.resolve('protractor'))}/launcher`).init;
    }

    getConfig(): ProtractorConfig {
        return {
            config: this.resolveInProject('protractor.conf.js'),
            additionalConfig: {
                suites: {
                    homepage: './e2e/homepage/**/*.e2e-spec.ts'
                }
            }
        };
    }
}

export interface ProtractorConfig {
    config: string;
    additionalConfig: any;
}
