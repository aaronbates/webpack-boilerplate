/* eslint import/no-extraneous-dependencies: "off" */
/* eslint no-unused-vars: "off", no-console: "off" */

const webpack = require('webpack');
const merge = require('webpack-merge');

// import env, dirs, paths and options
const ENV = require('./config.env');
const { DIRS, PATHS } = require('./config.paths');
const OPTIONS = require('./config.options.js');

// plugins
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// configs
const developmentConfig = require('./webpack.development.js');
const productionConfig = require('./webpack.production.js');
const serverConfig = require('./webpack.server.js');

// CLIENT SHARED CONFIG
let clientConfig = {
  name: 'client',
  entry: {
    // set up client entry as an array so we can extend with hmr in development
    client: [
      `${PATHS.PATH_CLIENT_SOURCE}/index.js`,
    ],
  },
  output: {
    filename: ENV.IS_PRODUCTION ? '[name].bundle.[chunkhash:8].js' : '[name].bundle.js',
    path: PATHS.PATH_CLIENT_DIST,
    publicPath: ENV.IS_PRODUCTION ? ENV.ASSET_PATH : ENV.ASSET_PATH_DEV,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', 'shared'],
  },
  // use source-map in production (use hidden-source-map if not extracting)
  devtool: ENV.IS_PRODUCTION ? 'source-map' : 'cheap-module-source-map',
  stats: {
    children: false,
  },

  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        use: [{
          loader: 'babel-loader',
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.(css|sass|scss)$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                // load order: SASS, PostCSS, CSS (indexes from 0)
                importLoaders: 2,
                modules: OPTIONS.CSS_MODULES,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                sourceMap: ENV.IS_PRODUCTION,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: ENV.IS_PRODUCTION,
                config: {
                  // ctx passed to postcss.config.js as `options`
                  ctx: {
                    cssnext: {
                      features: {
                        // disable autoprefixer so we can use manual options
                        autoprefixer: false,
                      },
                    },
                    autoprefixer: {},
                    sorting: {
                      order: [
                        'custom-properties',
                        'dollar-variables',
                        'declarations',
                        'at-rules',
                        'rules',
                      ],
                      'properties-order': 'alphabetical',
                      'unspecified-properties-position': 'bottom',
                    },
                    browserReporter: {},
                    reporter: {},
                  },
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: ENV.IS_PRODUCTION,
              },
            },
          ],
          fallback: 'style-loader',
        })),
      },
      {
        test: /\.(gif|jpg|png)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 3000,
            name: ENV.IS_PRODUCTION ? `${DIRS.DIR_IMAGES}/[name].[hash:8].[ext]` : `${DIRS.DIR_IMAGES}/[name].[ext]`,
          },
        }],
      },
      {
        test: /\.svg$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: ENV.IS_PRODUCTION ? `${DIRS.DIR_SVG}/[name].[hash:8].[ext]` : `${DIRS.DIR_SVG}/[name].[ext]`,
          },
        }],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: ENV.IS_PRODUCTION ? `${DIRS.DIR_FONTS}/[name].[hash:8].[ext]` : `${DIRS.DIR_FONTS}/[name].[ext]`,
          },
        }],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENV.NODE_ENV),
        BUILD_TARGET: JSON.stringify(ENV.TARGET),
        ASSET_PATH: JSON.stringify(ENV.ASSET_PATH),
        DEBUG: JSON.stringify(ENV.DEBUG),
      },
    }),
    // use html-webpack-harddisk-plugin for html hmr
    new HTMLWebpackPlugin({
      inject: false,
      template: `${PATHS.PATH_CLIENT_SOURCE_TEMPLATES}/${OPTIONS.REACT ? 'react/index.html' : 'index.html'}`,
      alwaysWriteToDisk: true,
    }),
    new HTMLWebpackHarddiskPlugin(),
    new ExtractTextPlugin({
      filename: ENV.IS_PRODUCTION ? 'css/styles.[contenthash:8].css' : 'css/styles.css',
      allChunks: true,
    }),
    // static files, minified vendor libs etc
    new CopyWebpackPlugin([
      { from: PATHS.PATH_CLIENT_SOURCE_STATIC },
      // you can remove js vendor files if going full react bundle
      { from: PATHS.PATH_CLIENT_SOURCE_JS_VENDOR, to: PATHS.PATH_CLIENT_DIST_JS_VENDOR },
      { from: PATHS.PATH_CLIENT_SOURCE_IMAGES, to: PATHS.PATH_CLIENT_DIST_IMAGES },
      { from: PATHS.PATH_CLIENT_SOURCE_SVG, to: PATHS.PATH_CLIENT_DIST_SVG },
    ], {
      ignore: ['**/.*'],
    }),
  ],
};

// vendor bundle
const VENDOR_BUNDLE = [];

if (OPTIONS.REACT) VENDOR_BUNDLE.push('react', 'react-dom');
if (OPTIONS.JQUERY) VENDOR_BUNDLE.push('jquery/dist/jquery.min.js');

// add vendor bundle if required
if (Array.isArray(VENDOR_BUNDLE) && VENDOR_BUNDLE.length > 0) {
  clientConfig = merge.smart({
    entry: {
      vendor: VENDOR_BUNDLE,
    },

    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
      }),
    ],
  }, clientConfig);
}

// if using react add hmr for development and polyfills for production
if (OPTIONS.REACT && ENV.IS_PRODUCTION === false) clientConfig.entry.client.unshift('react-hot-loader/patch');
if (OPTIONS.REACT && ENV.IS_PRODUCTION) clientConfig.entry.client.unshift(`${PATHS.PATH_CLIENT_SOURCE}/polyfills.js`);

// automatically load jquery everywhere if enabled
if (OPTIONS.USE_JQUERY) {
  clientConfig = merge.smart(clientConfig, {
    plugins: [
      new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }),
    ],
  });
}

// analyze client bundles if DEBUG true in node env
if (ENV.DEBUG) {
  clientConfig = merge.smart(clientConfig, {
    plugins: [
      new BundleAnalyzerPlugin({
        // analyzerMode: 'static'
        analyzerMode: 'server',
        analyzerPort: 8888,
        reportFilename: 'report.html',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
      }),
    ],
  });
}

// return config based on env / target
let runType = ENV.IS_PRODUCTION ? 'production' : 'development';
if (ENV.TARGET.includes(':server')) runType = 'server';

let config = {};

switch (runType) {
  case 'development':
    console.log('> Using CLIENT DEVELOPMENT config');
    config = merge.smart(clientConfig, developmentConfig);
    break;
  case 'production':
    console.log('> Using CLIENT PRODUCTION config');
    config = merge.smart(clientConfig, productionConfig);
    break;
  case 'server':
    console.log('> Using SERVER config');
    config = serverConfig;
    break;
  default:
    throw new Error('Unknown configuration passed to webpack');
}

module.exports = config;
