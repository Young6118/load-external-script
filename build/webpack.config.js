/* eslint global-require: "off" */
/* eslint import/no-dynamic-require: "off" */

/**
 * Created by spring on 2018/9/10.
 */

const merge = require('webpack-merge');

module.exports = (env) => {
  const baseConfig = require('./webpack.base.config')(env);

  const webpackConfig = require(`./webpack.${env}.config`);

  return merge(baseConfig, webpackConfig);
};
