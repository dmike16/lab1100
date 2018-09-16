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
                    const { html } = pluginArgs;
                    const baseExp = /<base[^(?:href)]*?href="([^"]*?)"\/?>/i;
                    const baseMatch = baseExp.exec(html);
                    if (baseMatch && this.opt.baseHref !== baseMatch[1]) {
                        // Sub if is different
                        pluginArgs.html = html.replace(baseMatch[0], baseMatch[0].replace(/href="[^"]*?"/,
                            `href="${this.opt.baseHref}"`));
                    } else {
                        // Add baseHref to head tag
                        const headReg = /<head>/i;
                        pluginArgs.html = html.replace(headReg, `$& <base href="${this.opt.baseHref}"/>`);
                    }
                    callback(null, pluginArgs);
                });
        });
    }
}
