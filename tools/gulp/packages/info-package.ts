import {Package} from './package';
const data = require('../../../package.json');

export class InfoPackage extends Package {
  constructor(name: string, dependencies?: Package[]) {
    super(name, dependencies);
  }

  getConfig(): { [prop: string]: any } {
    return {
      blue: [data.name],
      green: [data.description],
      red: [data.author.email, data.repository.url]
    };
  }
}
