import {resolve,join} from 'path';
/**
 * Abstract Package class
 * @param  {string}   name         [package name]
 * @param  {Package[]} dependencies [dependencies]
 */
export default abstract class Package{

  constructor(protected name:string,protected dependencies?: Package[]){}

  getName(): string{
    return this.name;
  }

  getDepsPackages(): Package[]{
    return this.dependencies;
  }

  getDepsTasks(phase?:string):string[]{
    const suffix = (phase)?`:${phase}`:'';
    return this.dependencies.map((p) =>{
      return `${p.getName()}${suffix}`;
    });
  }

  resolveInProject(...path: string[]):string{
    return join(root,...path);
  }

  abstract getConfig():{[prop:string]:any};
}

export const root :string = resolve(__dirname,'../../../');
