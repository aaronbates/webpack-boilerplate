/* eslint import/no-extraneous-dependencies: "off" */
/* eslint no-unused-vars: "off", no-console: "off" */

const webpack = require('webpack');
const merge = require('webpack-merge');

// import env, dirs, paths and options
const ENV = require('./config.env.js');
const { DIRS, PATHS } = require('./config.paths.js');
const OPTIONS = require('./config.options.js');

// plugins
const ReloadPlugin = require('reload-html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// export development specific config
let config = {
  output: {
    // comment bundles with info about modules
    pathinfo: true,
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ReloadPlugin(),
  ],

  devServer: {
    contentBase: PATHS.PATH_CLIENT_DIST,
    historyApiFallback: true,
    hot: true,
    host: ENV.HOST,
    port: ENV.PORT_CLIENT,
    open: true,
    // proxy calls to /api on dev client to dev server
    proxy: {
      '/api/**': {
        target: `${ENV.PROXY_SERVER}`,
        secure: false,
      },
    },
    overlay: {
      errors: true,
      warnings: true,
    },
    stats: {
      assetsSort: '!size',
      cached: 'false',
      cachedAssets: 'false',
      children: false,
      chunkOrigins: true,
      chunksSort: 'chunks',
      modules: false,
    },
  },
};

// use browser sync if `npm run browsersync` called
if (ENV.TARGET === 'browsersync') {
  config = merge.smart(config, {
    plugins: [
      new BrowserSyncPlugin({
        host: ENV.HOST,
        port: ENV.PORT_CLIENT,
        proxy: ENV.PROXY_CLIENT,
      }, {
        reload: false,
      }),
    ],
  });
}

module.exports = config;
