import Package from './package';
import {_PACKAGE_JSON as data} from '@dmike/packages';

export default class InfoPackage extends Package{
  constructor(name:string,dependencies?:Package[]){
    super(name,dependencies);
  }

  getConfig():{[prop:string]:any}{
    return {
      'blue': [data.name],
      'green': [data.description],
      'red':[data.author.email,data.repository.url]
    }
  }
}
