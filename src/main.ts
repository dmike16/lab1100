import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';
import { hmrBootstrap } from './hmr/hmr';

const enviromentType = process.env.TYPE;
const enviroment: { production: boolean; hrm: boolean } = require(`./env/enviroment${enviromentType}`).default;

if (enviroment.production) {
  enableProdMode();
  console.info(`%c${process.env.PROJECT_NAME}`, 'font-size:13px;color:#2196F3;');
  console.info(`%cv${process.env.VERSION}`, 'font-size:11px;color:#FF5252;');
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (enviroment.hrm) {
  if ((module as any)['hot']) {
    console.info(`%c${process.env.BOOTSTRAP_HMR}`, 'font-size:10px;color:#757575;');
    hmrBootstrap(module, bootstrap);
  } else {
    console.error('HMR is not enabled for webpack-dev-server!');
    console.info('Are you using the serve:hmr task?');
  }
} else {
  bootstrap();
}
