'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./issuer.controller');
const paths = require('./issuer.paths');

const apiRouter = require('express').Router();
const badgingRouter = require('express').Router();

const { get, image, profile, publicKey, revokedAssertions } = ctrl;

apiRouter
  .use(auth)
  .get('/', get);

badgingRouter
  .get(paths.image, image)
  .get(paths.issuer, profile)
  .get(paths.publicKey, publicKey)
  .get(paths.revocationList, revokedAssertions);

module.exports = {
  apiRouter,
  badgingRouter,
  path: paths.root
};
