import { task, src, dest } from 'gulp';
import runSeq = require('run-sequence');
import pump = require('pump');
import zip = require('gulp-zip');

import ZipPackage from '../packages/zip-package';

export function createZipDistTask(zipPack: ZipPackage) {
    const config = zipPack.getConfig();
    task(`${zipPack.getName()}:zip`, (cb) => {
        runSeq(zipPack.getDepsTasks('build'), () => {
            createArchive(zipPack.getConfig(), cb);
        });
    });
}

function createArchive(config: { [prop: string]: any }, cb: (err?: any) => void) {
    pump([
        src(config.source),
        zip(config.name),
        dest(config.target)
    ], cb);
}
