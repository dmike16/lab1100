import { WebpackOption } from './model';
import { Configuration } from 'webpack';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

export function webpackStyles(wbo: WebpackOption): Configuration {
    return wbo.buildConfig.platform === 'server' ? webpackInlineStyles(wbo) : webpackCompactStyles(wbo);
}

function webpackInlineStyles(wbo: WebpackOption): Configuration {
    return {
        module: {
            rules: [
                // Css in assets rule
                {
                    test: /\.scss$/,
                    exclude: this.resolveInProject('src', 'app'),
                    use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }]
                }]
        }
    };
}

function webpackCompactStyles(wbo: WebpackOption): Configuration {
    return {
        module: {
            rules: [
                // Css in assets rule
                {
                    test: /\.scss$/,
                    exclude: this.resolveInProject('src', 'app'),
                    use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }]
                }]
        },
        optimization: {
            minimizer: [
                new OptimizeCssAssetsPlugin({
                    cssProcessorOptions: {
                        map: {
                            inline: false
                        }
                    }
                })
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].[chunkhash].css'
            })
        ]
    };
}
