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
    sourceMap: boolean;
    indexHTML: string;
    outputPath: string;
    deployPath: string;
    buildOptimization: boolean;
    recordsPath?: string;
    main: string;
    i18nOutFile?: string;
    i18nOutFormat?: string;
    i18nLocale?: string;
    i18nInFile?: string;
    i18nInFormat?: string;
    i18nMissingTranslation?: string;
}
