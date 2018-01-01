/* eslint import/no-extraneous-dependencies: "off" */
/* eslint no-unused-vars: "off", no-console: "off" */

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

// import env, dirs and paths
const ENV = require('./config.env.js');
const { DIRS, PATHS } = require('./config.paths.js');
const OPTIONS = require('./config.options.js');

// plugins
const NodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

// console.log(PATHS.PATH_SERVER_SOURCE);
// console.log(PATHS.PATH_SERVER_DIST);

// export server specific config
const config = {
  name: 'server',
  target: 'node',
  entry: {
    server: [
      'webpack/hot/poll?1000',
      `${PATHS.PATH_SERVER_SOURCE}/index.js`,
    ],
  },
  output: {
    filename: '[name].js',
    path: PATHS.PATH_SERVER_DIST,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules'],
  },
  // whitelist for bundle from node_modules (used in development)
  externals: [
    NodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  watch: true,

  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        use: [{
          loader: 'babel-loader',
        }],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENV.NODE_ENV),
        BUILD_TARGET: JSON.stringify('server'),
      },
    }),
    // automatically start node server
    new StartServerPlugin('server.js'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

module.exports = config;
