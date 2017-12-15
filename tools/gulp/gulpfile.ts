import createInfoTask from './tasks/info-task';
import { createServeWebpackTask } from './tasks/serve-task';
import { createBuildWebpackTask } from './tasks/build-task';
import { infoPack,webpackServePack,webpackBuildPack,webpackAOTPack } from './packages';

createInfoTask(infoPack);
createServeWebpackTask(webpackServePack);
createBuildWebpackTask(webpackBuildPack);
createBuildWebpackTask(webpackAOTPack);

import  './tasks/default';
