/**
 * Created by spring on 2018/9/11.
 */
const webpack = require('webpack');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = env => ({
  resolve: {
    extensions: ['.js', '.scss', '.css', '.json'],
    alias: {
      '@images': resolve('src/resources/images')
    }
  },
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: '15360',
            name: '[path][name].[hash:8].[ext]'
          }
        }]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: '10240',
            name: '[path][name].[hash:8].[ext]'
          }
        }]
      },
      {
        test: /\.tpl$/,
        loader: 'html-loader',
        options: {
          // art-template options (if necessary)
          // @see https://github.com/aui/art-template
        }
      },
    ]
  },

  plugins: [
    // new CleanWebpackPlugin(['dist'], {
    //   root: resolve('./')
    // }),
    new webpack.BannerPlugin(`Copyright © 2011 - ${(new Date()).getFullYear()} miHoYo. All Rights Reserved`)
  ]
});
