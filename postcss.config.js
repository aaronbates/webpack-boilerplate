/* eslint quote-props: "off" */

module.exports = ({ env, file, options }) => ({
  parser: file.extname === '.sss' ? 'sugarss' : false,
  plugins: {
    'postcss-import': { root: file.dirname },
    'postcss-cssnext': options.cssnext,
    'autoprefixer': env === 'production' ? options.autoprefixer : false,
    'postcss-sorting': env === 'production' ? options.sorting : false,
    'postcss-browser-reporter': env === 'production' ? options.browserReporter : false,
    'postcss-reporter': options.reporter,
  },
});
