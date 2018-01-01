// ENV
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

const id = 1;
const host = process.env.HOST || 'localhost';
const portClient = 8080;
const portServer = parseInt(process.env.PORT, 10) || 3000;
const assetPath = '/';
const timeout = parseInt(process.env.TIMEOUT, 10) || 20000;
const maxAge = process.env.MAX_AGE || '365d';

const ENV = {
  NODE_ENV,
  IS_PRODUCTION,
  ID: id,
  HOST: host,
  DEBUG: process.env.DEBUG || false,
  TARGET: process.env.npm_lifecycle_event,
  ASSET_PATH: process.env.ASSET_PATH || assetPath,
  ASSET_PATH_DEV: '/',
  PORT_CLIENT: portClient,
  PORT_SERVER: portServer,
  PROXY_CLIENT: `http://${host}:${portClient}`,
  PROXY_SERVER: `http://${host}:${portServer}`,
  TIMEOUT: timeout,
  MAXAGE: maxAge,
};

module.exports = ENV;
