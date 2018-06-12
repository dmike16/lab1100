import { task } from 'gulp';

import { WebpackBuildJITPackage, WebpackBuildAOTPackage } from '@ngx-lab1100/packages';
import {webpackCompile} from '@ngx-lab1100/process';

export function createBuildWebpackTask(buildPack: WebpackBuildJITPackage) {
  task(`${buildPack.getName()}:build`, (cb: (err?: any) => void) => {
    webpackCompile(buildPack.getConfig(), cb);
  });
}

export function createBuildIT(buildPack: WebpackBuildAOTPackage, translation: string) {
  createBuildWebpackTask(buildPack);
}
