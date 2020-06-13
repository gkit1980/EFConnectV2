const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// oracledb 4.2.0 has an issue with webpack. This is a hack, suggested
// on GitHub that fixes the issue. Note, that it might not work with future
// versions of the npm packages
// See https://github.com/oracle/node-oracledb/issues/1156#issuecomment-574396243
module.exports = function (webpackConfig) {
  webpackConfig.plugins.push(
    new CopyWebpackPlugin([
      {
        // Copy the binary Oracle DB driver to dist.
        from: path.resolve(__dirname, '../../node_modules/oracledb/build'),
        to: 'node_modules/oracledb/build',
      },
    ])
  );

  webpackConfig.module.rules.push({
    // Use __non_webpack_require__ to look for the Oracle binary in the dist folder at runtime.
    test: /oracledb\.js$/,
    loader: 'string-replace-loader',
    options: {
      search: 'require(binaryLocations[i])',
      replace: '__non_webpack_require__(binaryLocations[i])',
    },
  });

  return webpackConfig;
};
