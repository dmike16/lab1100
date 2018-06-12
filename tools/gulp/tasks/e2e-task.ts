import { task } from 'gulp';
// TODO select suite with gulp arg

import { E2eProtractorPackage } from '@ngx-lab1100/packages';

export function createE2eProtractorTask(e2ePack: E2eProtractorPackage) {
    task(`${e2ePack.getName()}:e2e`, () => {
        const resolve = Promise.resolve();
        return resolve.then(() => {
            const options = e2ePack.getConfig();
            const additionalConfig: any = {};
            const argv = e2ePack.getArgv(e2eargv);
            e2ePack.laucher()(options.config, Object.assign(options.additionalConfig, argv));
        });
    });
}

interface E2EArgv {
    suite: string;
}

const e2eargv: E2EArgv = {
    suite: 'homepage'
};
