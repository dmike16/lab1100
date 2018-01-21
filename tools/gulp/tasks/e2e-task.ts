import { task } from 'gulp';
//TODO select suite with gulp arg

import E2eProtractorPackage from "../packages/e2e-protractor";


export function createE2eProtractorTask(e2ePack: E2eProtractorPackage){
    task(`${e2ePack.getName()}:e2e`,() => {
        const resolve = Promise.resolve(); 
        return resolve.then( () => {
            const options = e2ePack.getConfig();
            e2ePack.laucher()(options.config,options.additionalConfig);
        });
    });
}