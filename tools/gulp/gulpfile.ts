import createInfoTask from './tasks/info-task';
import { createServeWebpackTask } from './tasks/serve-task';
import { createBuildWebpackTask } from './tasks/build-task';
import { createZipDistTask } from './tasks/dist-task';
import { createKarmaWebpackTask } from './tasks/test-task';

import { infoPack, webpackServePack, webpackBuildPack, webpackAOTPack, zipPack, KarmaPack } from './packages';

createInfoTask(infoPack);
createServeWebpackTask(webpackServePack);
createBuildWebpackTask(webpackBuildPack);
createBuildWebpackTask(webpackAOTPack);
createZipDistTask(zipPack);
createKarmaWebpackTask(KarmaPack);

import './tasks/default';
