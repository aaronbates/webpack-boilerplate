/* eslint import/no-unresolved: "off", import/no-extraneous-dependencies: "off", import/extensions: "off" */
/* eslint global-require: "off" */

import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/index.js');
  // require other stories here.
}

configure(loadStories, module);
