/* eslint import/no-extraneous-dependencies: 0 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */

// import styles
import './scss/main.scss';

// Avoid `console` errors in browsers that lack a console.
(function avoidConsoleErrors() {
  function noop() {}

  const console = (window.console || {});
  const methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn',
  ];

  // Only stub undefined methods.
  for (let i = 0; i < methods.length; i += 1) {
    const method = methods[i];

    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

// polyfill performance.now if needed
(function polyfillPerformanceNow() {
  if ('performance' in window === false) {
    window.performance = {};
  }

  // thanks IE8
  Date.now = (Date.now || function now() {
    return new Date().getTime();
  });

  if ('now' in window.performance === false) {
    let nowOffset = Date.now();

    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart;
    }

    window.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }
}());

// perf measure
// logTimes('The page is really ready');

// https://webpack.github.io/docs/hot-module-replacement.html#api
if (module.hot) {
  module.hot.accept();
}
