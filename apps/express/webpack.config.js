const configDescriptors = require('./webpack.config.descriptors');
const configOracledb = require('./webpack.config.oracledb');

module.exports = function (webpackConfig) {
  webpackConfig = configDescriptors(webpackConfig);
  webpackConfig = configOracledb(webpackConfig);
  return webpackConfig;
};
