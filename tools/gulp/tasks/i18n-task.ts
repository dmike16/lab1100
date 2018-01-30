import { task, src } from 'gulp';
import webpack = require('webpack');
import webpackStream = require('webpack-stream');
import pump = require('pump');
import { WebpackBuildAOTPackage } from '../packages/webpack-package';

export function createI18nTask(i18nPack: WebpackBuildAOTPackage) {
    task(`${i18nPack.getName()}:i18n`, (cb) => {
        const source = i18nPack.resolveInProject('src');
        i18nPack.options = {
            i18nOutFile: i18nPack.resolveInProject('src', 'locale', 'message.xlif'),
            i18nOutFormat: 'xlif',
            locale: 'en'
        } as any;
        pump([
            src([`${source}/main.ts`, `${source}/polyfills.ts`, `${source}/vendor.ts`]),
            webpackStream(i18nPack.getConfig(), webpack)
        ], cb);
    });
}
