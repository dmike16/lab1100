import {task} from 'gulp';
import { blue,red,green } from 'ansi-colors';
import log=require('fancy-log');

import InfoPackage from '../packages/info-package';

export default function createInfoTask(infoPack: InfoPackage):void{
  const config = infoPack.getConfig();
  const color:{[p:string]:any} = {
    'blue': blue,
    'red': red,
    'green': green
  }
  task(`${infoPack.getName()}:info`,async ()=>{
    for(let key in config){
      config[key].forEach((value:any)=>{
        log(color[key](value));
      });
    }
  });
}
