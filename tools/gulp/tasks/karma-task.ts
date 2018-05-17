import { task } from 'gulp';

import { WebpackKarmaPackage } from '@ngx-lab1100/packages';
import {runKarmaTest} from '@ngx-lab1100/process';

export function createKrmWebpackTask(krmPack: WebpackKarmaPackage): void {
  task(`${krmPack.getName()}:test`,
    (cb: (err?: any) => void) => {
      runKarmaTest(krmPack, cb);
    });
}
