import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';

if (process.env.ENV === 'production') {
  enableProdMode();
  console.log(`%c${process.env.PROJECT_NAME}`,'font-size:13px;color:#0147A7;');
  console.log(`%cv${process.env.VERSION}`,'font-size:11px;color:#c4342e;');
}

platformBrowserDynamic().bootstrapModule(AppModule);
