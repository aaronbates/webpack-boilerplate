/* eslint no-console: "off" */

import http from 'http';

import ENV from '../config.env';
import app from './server';

const server = http.createServer(app);
let currentApp = app;

server.listen(3000, () => console.log(`Development server running at ${ENV.HOST}:${ENV.PORT_SERVER} (CTRL-C to exit)`));

if (module.hot) {
  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}
