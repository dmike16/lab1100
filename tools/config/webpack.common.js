const helper = require('./helper');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Entry Points
  entry:{
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },
  // Ext to resolve when is not specified
  resolve:{
    extensions: ['.ts','.js']
  },
 //Module section
  module:{
    rules:[
    //typescript rule
      {
        test: /\.ts$/,
        use:[
          {
            loader: 'awesome-typescript-loader',
            options:{configFileName:helper.root('src','tsconfig.json')}
          },
          'angular2-template-loader'
        ]
      },
      //Html rule
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options:{minimize:false}
        }
      },
      //Image and fonts rule
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: ['file-loader?name=assets/[name].[hash].[ext]']
      },
      //Css in assets rule
      {
        test: /\.scss$/,
        exclude: helper.root('src','app'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {sourceMap:true}
          },
          {
            loader: 'sass-loader',
            options: {sourceMap: true}
          }]
        })
      },
      // Css in app folder rule
      {
        test: /.scss$/,
        include: helper.root('src','app'),
        use: ['raw-loader','sass-loader']
      }
    ]
  },

  plugins:[
  //Fix an angular2 warning
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(@angular|esm5)/,
      helper.root('./src'),
      {}
    ),
  //Optimize common dependencies
    new webpack.optimize.CommonsChunkPlugin({
      name:['app','vendor','polyfills']
    }),
  // Fill the index.html with buldle geneated
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};
