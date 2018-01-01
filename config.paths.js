const path = require('path');

// DIRS
const dirClientSource = 'client';
const dirClientDist = 'public';
const dirServerSource = 'server';
const dirServerDist = 'dist';
const dirCSS = 'css';
const dirFonts = 'fonts';
const dirJS = 'js';
const dirImages = 'images';
const dirSASS = 'scss';
const dirSVG = 'svg';

const DIRS = {
  DIR_CLIENT_SOURCE: dirClientSource,
  DIR_CLIENT_DIST: dirClientDist,
  DIR_SERVER_SOURCE: dirServerSource,
  DIR_SERVER_DIST: dirServerDist,
  DIR_CSS: dirCSS,
  DIR_FONTS: dirFonts,
  DIR_IMAGES: dirImages,
  DIR_JS: dirJS,
  DIR_SASS: dirSASS,
  DIR_SVG: dirSVG,
};

// PATHS: client, server, src, source, app, public, build, dist, etc.
const pathClientSource = path.join(__dirname, `./${dirClientSource}`);
const pathClientDist = path.join(__dirname, `./${dirClientDist}`);

const pathServerSource = path.join(__dirname, `./${dirServerSource}`);
const pastServerDist = path.join(__dirname, `./${dirServerDist}`);

const PATHS = {
  PATH_CLIENT_SOURCE: pathClientSource,
  PATH_CLIENT_SOURCE_CSS: `${pathClientSource}/${dirCSS}`,
  PATH_CLIENT_SOURCE_IMAGES: `${pathClientSource}/${dirImages}`,
  PATH_CLIENT_SOURCE_JS: `${pathClientSource}/${dirJS}`,
  PATH_CLIENT_SOURCE_JS_VENDOR: `${pathClientSource}/${dirJS}/vendor`,
  PATH_CLIENT_SOURCE_SASS: `${pathClientSource}/${dirSASS}`,
  PATH_CLIENT_SOURCE_STATIC: `${pathClientSource}/static`,
  PATH_CLIENT_SOURCE_SVG: `${pathClientSource}/${dirSVG}`,
  PATH_CLIENT_SOURCE_TEMPLATES: `${pathClientSource}/templates`,
  PATH_CLIENT_DIST: pathClientDist,
  PATH_CLIENT_DIST_CSS: `${pathClientDist}/${dirCSS}`,
  PATH_CLIENT_DIST_IMAGES: `${pathClientDist}/${dirImages}`,
  PATH_CLIENT_DIST_JS: `${pathClientDist}/${dirJS}`,
  PATH_CLIENT_DIST_JS_VENDOR: `${pathClientDist}/${dirJS}/vendor`,
  PATH_CLIENT_DIST_SVG: `${pathClientDist}/${dirSVG}`,
  PATH_SERVER_SOURCE: pathServerSource,
  PATH_SERVER_DIST: pastServerDist,
};

module.exports = { DIRS, PATHS };
