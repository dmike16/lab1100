import {task} from 'gulp';
import {log,colors} from 'gulp-util';

import InfoPackage from '../packages/info-package';

export default function createInfoTask(infoPack: InfoPackage):void{
  const config = infoPack.getConfig();
  const color:{[p:string]:any} = {
    'blue': colors.blue,
    'red':colors.red,
    'green':colors.green
  }
  task(`${infoPack.getName()}:info`,async ()=>{
    for(let key in config){
      config[key].forEach((value:any)=>{
        log(color[key](value));
      });
    }
  });
}
