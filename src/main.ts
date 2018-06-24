import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';
import { hmrModule } from './hmr/hmr';

const enviromentType = process.env.TYPE;
const enviroment: { production: boolean; hrm: boolean } = require(`./env/enviroment${enviromentType}`).default;

if (enviroment.production) {
  enableProdMode();
  console.info(`%c${process.env.PROJECT_NAME}`, 'font-size:13px;color:#2196F3;');
  console.info(`%cv${process.env.VERSION}`, 'font-size:11px;color:#FF5252;');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then((ngModule: any) => {
    console.info(`%c${process.env.BOOTSTAP_COMPETED}`, 'font-size:10px;color:#757575;');
    if (enviroment.hrm) {
      console.info(`%c${process.env.BOOTSTRAP_HMR}`, 'font-size:10px;color:#757575;');
      hmrModule(ngModule, module);
    }
  }).catch((err) => console.error(`%c${process.env.BOOTSTRAP_ERROR}`, 'font-size:10px;color:#757575;', err));
