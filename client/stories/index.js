/* eslint import/no-unresolved: "off", import/no-extraneous-dependencies: "off", import/extensions: "off" */
/* eslint react/jsx-filename-extension: "off" */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

storiesOf('Button', module)
  .add('with text', () => (
    <button onClick={action('clicked')}>Hello Button</button>
  ))
  .add('with some emoji', () => (
    <button onClick={action('clicked')}>
      <span role="img" aria-label="smiley">😀</span>
      <span role="img" aria-label="sunglasses">😎</span>
      <span role="img" aria-label="thumbsup">👍</span>
      <span role="img" aria-label="100%">💯</span>
    </button>
  ));
