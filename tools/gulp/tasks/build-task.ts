import {task,src,dest} from 'gulp';
import webpack = require('webpack');
import webpackStream = require('webpack-stream');
import pump = require('pump');

import {WebpackBuildProdPackage} from '../packages/webpack-package';

export function createBuildWebpackTask(buildPack: WebpackBuildProdPackage){
  const source = buildPack.resolveInProject('src');
  const target = buildPack.resolveInProject('build');
  task(`${buildPack.getName()}:build`,(cb:(err?:any)=>void)=>{
    pump([
      src([`${source}/main.ts`,`${source}/polyfills.ts`,`${source}/vendor.ts`]),
      webpackStream(buildPack.getConfig(),webpack),
      dest(target)
    ],cb);
  });
}
