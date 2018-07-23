'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./issuer.controller');
const paths = require('./issuer.paths');

const apiRouter = require('express').Router();
const badgingRouter = require('express').Router();

apiRouter
  .use(auth)
  .get('/', ctrl.get);

badgingRouter
  .get(paths.image, ctrl.image)
  .get(paths.issuer, ctrl.profile)
  .get(paths.publicKey, ctrl.publicKey)
  .get(paths.revocationList, ctrl.revokedAssertions);

module.exports = {
  apiRouter,
  badgingRouter,
  path: paths.root
};
