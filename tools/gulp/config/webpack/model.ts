export interface WebpackOption {
    es2015support: boolean;
    root: string;
    buildConfig: BuildOption;
}

export interface BuildOption {
    env: 'production' | 'development';
    https: boolean;
    platform: 'server' | 'broswer';
    higherCompression: boolean;
}
