'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./issuer.controller');
const paths = require('./issuer.paths');

const api = require('express').Router();
const badging = require('express').Router();

api
  .use(auth)
  .get('/', ctrl.get);

badging
  .get(paths.image, ctrl.image)
  .get(paths.issuer, ctrl.profile)
  .get(paths.publicKey, ctrl.publicKey);

module.exports = {
  api,
  badging,
  path: paths.root
};
