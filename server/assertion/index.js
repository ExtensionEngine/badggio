'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./assertion.controller');
const paths = require('./assertion.paths');

const apiRouter = require('express').Router();
const badgingRouter = require('express').Router();

apiRouter
  .use(auth)
  .param('id', ctrl.loadAssertion)
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:id', ctrl.patch);

badgingRouter
  .param('id', ctrl.loadAssertion)
  .get('/:id.json', ctrl.badgeAssertion)
  .get('/:id/image', ctrl.image);

module.exports = {
  apiRouter,
  badgingRouter,
  path: paths.root
};
