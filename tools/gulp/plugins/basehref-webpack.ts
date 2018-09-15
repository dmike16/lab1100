import { Compiler } from 'webpack';

export class BasehrefWebpackPlugin {
    constructor(
        private opt: { baseHref: string; }
    ) { }

    apply(compiler: Compiler) {
        compiler.hooks.compilation.tap('BaseHrefWebpackPlugin', (compilation: any) => {
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('BaseHrefWebpackPlugin',
                (pluginArgs: any, callback: any) => {
                    // TODO
                });
        });
    }
}
