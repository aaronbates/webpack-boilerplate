/* eslint import/no-extraneous-dependencies: "off" */
/* eslint no-unused-vars: "off", no-console: "off" */

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');
const cssnano = require('cssnano');

// import env, dirs, paths and options
const ENV = require('./config.env.js');
const { DIRS, PATHS } = require('./config.paths.js');
const OPTIONS = require('./config.options.js');

// plugins
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
// note: webpack-plugin-critical required in if statement below due to bug.
const OfflinePlugin = require('offline-plugin');

// export production specific config
let config = {
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk.modules.map(m => path.relative(m.context, m.request)).join('_');
    }),
    // extract any common chunks to their own bundle
    new webpack.optimize.CommonsChunkPlugin('common'),
    // extract webpack runtime to its own bundle
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
      minChunks: Infinity,
    }),
    new webpack.optimize.UglifyJsPlugin({
      exclude: ['/.min.js$/gi'], // ignore pre-minified files
      compress: {
        comparisons: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        screw_ie8: true,
        sequences: true,
        unused: true,
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    }),
    // minimise css using cssnano
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: {
        discardComments: { removeAll: true },
        map: { inline: false },
        safe: true,
      },
      canPrint: true,
    }),
    // generate json manifest of versioned assets
    new ManifestPlugin(),
  ],

  // bundle size warnings (edit based on project)
  performance: {
    hints: 'warning',
    maxEntrypointSize: 150000, // 150kb
    maxAssetSize: 250000, // 250kb
  },
};

// remove unused css if enabled (this can be heavy handed...)
if (OPTIONS.PURIFYCSS) {
  config = merge.smart(config, {
    plugins: [
      // note: PurifyCSS does not support sourcemaps
      new PurifyCSSPlugin({
        paths: glob.sync(`${PATHS.PATH_CLIENT_SOURCE}/**/*.html`),
        purifyOptions: {
          info: true,
          whitexlist: ['*c-*', '*is-*', '*has-*', '*js-*', '*embed-*'],
        },
      }),
    ],
  });
}

// inline critical css in html if enabled
if (OPTIONS.CRITICAL_CSS) {
  // break require rule here as plugin causes errors with webpack dev server
  const { CriticalPlugin } = require('webpack-plugin-critical'); // eslint-disable-line global-require

  config = merge.smart(config, {
    plugins: [
      new CriticalPlugin({
        base: ENV.PATH_CLIENT_DIST,
        src: 'index.html',
        inline: true,
        minify: false,
        dest: 'index.html',
      }),
    ],
  });
}

// process images with imageOptim if enabled
if (OPTIONS.OPTIMISE_IMAGES) {
  config = merge.smart(config, {
    plugins: [
      new WebpackShellPlugin({
        onBuildEnd: [`imageOptim --image-alpha --quit --directory ${PATHS.PATH_CLIENT_DIST_IMAGES}`],
      }),
    ],
  });
}

// process SVGs with svgo if enabled
if (OPTIONS.OPTIMISE_SVG) {
  config = merge.smart(config, {
    plugins: [
      new WebpackShellPlugin({
        onBuildEnd: [`svgo --folder ${PATHS.PATH_CLIENT_DIST_IMAGES}`],
      }),
    ],
  });
}

// service workers: must always come last
if (OPTIONS.USE_SERVICE_WORKERS) {
  config = merge.smart(config, {
    plugins: [
      new OfflinePlugin({
        ServiceWorker: { navigateFallbackURL: '/' },
        AppCache: {
          FALLBACK: { '/': '/offline.html' },
        },
      }),
    ],
  });
}

module.exports = config;
