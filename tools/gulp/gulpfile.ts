import {createInfoTask} from '@ngx-lab1100/tasks';

import {
    infoPack,
    webpackServePack,
    webpackBuildPack,
    webpackAOTPack,
    zipPack,
    karmaPack,
    e2ePack,
    i18nPack,
    itPack
} from './packages';

createInfoTask(infoPack);
//createServeWebpackTask(webpackServePack);
//createBuildWebpackTask(webpackBuildPack);
//createBuildWebpackTask(webpackAOTPack);
//createZipDistTask(zipPack);
//createKarmaWebpackTask(karmaPack);
//createE2eProtractorTask(e2ePack);
//createI18nTask(i18nPack);
//createBuildIT(itPack, 'message.it.xlif');

import './tasks/default';
