import Package from './package';
import { root } from './package';

export default class ZipPackage extends Package {

  getConfig(): { [prop: string]: any } {
    return {
      source: `${root}/build/**/*`,
      name: `${this.name}.zip`,
      target: `${root}/build/Release`
    };
  }
}
