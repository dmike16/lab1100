import Package from './Package';
import {log,colors} from 'gulp-util';
import * as data from '../../../package.json';

export default class InfoPackage extends Package{
  constructor(name:string,dependencies?:Package[]){
    super(name,dependencies);
  }

  getConfig():{}{
    return {}
  }

  info():void{
    log(colors.blue(data.name));
    log(colors.green(data.description));
    log(colors.red(data.author.email));
    log(colors.red(data.repository.url));
  }
}
