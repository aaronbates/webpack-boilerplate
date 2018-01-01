/* eslint react/jsx-filename-extension: "off" */

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './containers/App';

const appRoot = document.getElementById('root');

const renderApp = (Component) => {
  render(
    <AppContainer>
      <Component />
    </AppContainer>,
    appRoot,
  );
};

renderApp(App);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/App', () => {
    render(App);
  });
}
