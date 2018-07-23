'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./assertion.controller');
const paths = require('./assertion.paths');

const apiRouter = require('express').Router();
const badgingRouter = require('express').Router();

apiRouter
  .use(auth)
  .post('/', ctrl.create);

badgingRouter
  .param('id', ctrl.loadAssertion)
  .get('/:id.json', ctrl.badgeAssertion);

module.exports = {
  apiRouter,
  badgingRouter,
  path: paths.root
};
