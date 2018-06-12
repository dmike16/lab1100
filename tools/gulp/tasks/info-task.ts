import { task } from 'gulp';
import { blue, red, green } from 'ansi-colors';
import log = require('fancy-log');
import { InfoPackage } from '@ngx-lab1100/packages';

export function createInfoTask(infoPack: InfoPackage): void {
  const config = infoPack.getConfig();
  const color: { [p: string]: any } = {
    blue,
    red,
    green
  };
  task(`${infoPack.getName()}:info`, async () => {
    for (const key in config) {
      if (config[key]) {
        config[key].forEach((value: any) => {
          log(color[key](value));
        });
      }
    }
  });
}
