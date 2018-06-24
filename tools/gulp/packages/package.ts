import { resolve, join } from 'path';
/**
 * Abstract Package class
 * @param  {string}   name         [package name]
 * @param  {Package[]} dependencies [dependencies]
 */
export abstract class Package {

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

export const NODE_VERSION = (() => {
  const v = process.version.replace('v', '').split('.');
  return {
    major: parseInt(v[0], 10),
    minor: parseInt(v[1], 10),
    patch: parseInt(v[2], 10)
  };
})();
