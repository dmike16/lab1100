export interface WebpackOption {
    es2015support: boolean;
    root: string;
    buildConfig: BuildOption;
    tsConfigPath: string;
    projectRoot: string;
}

export interface BuildOption {
    env: 'production' | 'development';
    platform: 'server' | 'broswer';
    higherCompression: boolean;
    extractCss: boolean;
    styles: Array<{name: string; path: string}>;
    assets: AssetsOption[];
    ingorePath: string[];
    sourceMap: boolean;
    indexHTML: string;
    outputPath: string;
    deployPath: string;
    buildOptimization: boolean;
    debug: boolean;
    recordsPath?: string;
    main: string;
    polyfills: string;
    outputHash: 'none' | 'serve' | 'all';
    hmr?: boolean | object;
    https?: false | { key: string | Buffer; cert: string | Buffer };
    outputHashLen?: number;
    i18nOutFile?: string;
    i18nOutFormat?: string;
    i18nLocale?: string;
    i18nInFile?: string;
    i18nInFormat?: string;
    i18nMissingTranslation?: string;
}

export interface AssetsOption {
    input: string;
    output: string;
    glob: string;
}
