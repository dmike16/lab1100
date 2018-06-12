import { createInfoTask } from '@ngx-lab1100/tasks';
import { createServeWebpackTask } from '@ngx-lab1100/tasks';
import { createBuildWebpackTask, createBuildIT } from '@ngx-lab1100/tasks';
import { createZipDistTask } from '@ngx-lab1100/tasks';
import {  createKrmWebpackTask } from '@ngx-lab1100/tasks';
import { createE2eProtractorTask } from '@ngx-lab1100/tasks';
import { createI18nTask } from '@ngx-lab1100/tasks';
import {
    infoPack,
    webpackServePack,
    webpackBuildPack,
    webpackAOTPack,
    zipPack,
    e2ePack,
    i18nPack,
    itPack,
    krmPack
} from './packages';

createInfoTask(infoPack);
createServeWebpackTask(webpackServePack);
createBuildWebpackTask(webpackBuildPack);
createBuildWebpackTask(webpackAOTPack);
createZipDistTask(zipPack);
createE2eProtractorTask(e2ePack);
createI18nTask(i18nPack);
createBuildIT(itPack, 'message.it.xlif');
createKrmWebpackTask(krmPack);

import './tasks/default';
