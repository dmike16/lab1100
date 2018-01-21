import createInfoTask from './tasks/info-task';
import { createServeWebpackTask } from './tasks/serve-task';
import { createBuildWebpackTask } from './tasks/build-task';
import { createZipDistTask } from './tasks/dist-task';
import { createKarmaWebpackTask } from './tasks/test-task';
import { createE2eProtractorTask } from './tasks/e2e-task';

import { infoPack, 
    webpackServePack, 
    webpackBuildPack, 
    webpackAOTPack, 
    zipPack, 
    karmaPack,
    e2ePack } from './packages';

createInfoTask(infoPack);
createServeWebpackTask(webpackServePack);
createBuildWebpackTask(webpackBuildPack);
createBuildWebpackTask(webpackAOTPack);
createZipDistTask(zipPack);
createKarmaWebpackTask(karmaPack);
createE2eProtractorTask(e2ePack);

import './tasks/default';
