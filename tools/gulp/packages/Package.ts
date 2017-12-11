import {resolve,join} from 'path';
/**
 * Abstract Package class
 * @param  {string}   name         [package name]
 * @param  {Package[]} dependencies [dependencies]
 */
export default abstract class Package{

  constructor(protected name:string,protected dependencies?: Package[]){}

  get getname(): string{
    return this.name;
  }

  get getdeps(): Package[]{
    return this.dependencies;
  }

  resolveInProject(...path: string[]):string{
    return join(root,...path);
  }

  abstract getConfig():{};
}

export const root :string = resolve(__dirname,'../../../');
