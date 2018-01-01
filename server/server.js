/* eslint import/no-extraneous-dependencies: "off" */
/* eslint global-require: "off", no-console: "off" */

import express from 'express';

import ENV from '../config.env';
import { DIRS } from '../config.paths';

const app = express();

const errorHandler = (err, req, res, next) => {
  res.status(500).send('<p>Internal Server Error</p>');
  console.error(err.stack);
  next(err);
};

app.locals.settings['x-powered-by'] = false;

app.use(errorHandler);
app.use(express.static(DIRS.DIR_SERVER_DIST));

app.get('/', (req, res) => {
  res.send('Hello world! (express)');
});

// example api calls
app.get('/api/users', (req, res) => {
  res.send('API: GET all users');
});

app.get('/api/user/:id', (req, res) => {
  res.send(`API: GET user with id ${req.params.id}`);
});

if (ENV.IS_PRODUCTION === false) {
  // if development:
  app.get('*', (req, res) => {
    // options include: render react App to string, or send index...
    // res.sendFile(path.resolve(DIRS.DIR_CLIENT_DIST + 'index.html'));
    res.send('Nothing to see here...');
  });
} else {
  // if production: start server
  app.listen(ENV.PORT_SERVER, () => {
    console.log(`Server running at ${ENV.HOST}:${ENV.PORT_SERVER} (CTRL-C to exit)`);
  });
}

export default app;
