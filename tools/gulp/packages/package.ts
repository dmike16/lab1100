import { resolve, join } from 'path';
/**
 * Abstract Package class
 * @param  {string}   name         [package name]
 * @param  {Package[]} dependencies [dependencies]
 */
export default abstract class Package {

  constructor(protected name: string, protected dependencies?: Package[]) { }

  getName(): string {
    return this.name;
  }

  getDepsPackages(): Package[] {
    return this.dependencies;
  }

  getDepsTasks(phase?: string): string[] {
    const suffix = (phase) ? `:${phase}` : '';
    return this.dependencies.map((p) => {
      return `${p.getName()}${suffix}`;
    });
  }

  resolveInProject(...path: string[]): string {
    return join(root, ...path);
  }

  getArgv<T>(arg: Argv<T>): Argv<T> {
    const terminalArgs = process.argv.slice(3);
    let lastKey: keyof T;
    terminalArgs.reduce((accumulator, value, index, data) => {
      const flag = /^--{0,1}(.*)/.exec(value);
      if (flag && accumulator.hasOwnProperty(flag[1])) {
        lastKey = flag[1] as (keyof T);
      } else {
        if (accumulator[lastKey] instanceof Array) {
          accumulator[lastKey] = value.split(',');
        } else {
          accumulator[lastKey] = value;
        }
      }
      return accumulator;
    }, arg);

    return arg;
  }

  abstract getConfig(): { [prop: string]: any };
}

export type Argv<T> = {
  [P in keyof T]: string | string[];
};

export const root: string = resolve(__dirname, '../../../');
