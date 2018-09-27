'use strict';

const { Integration } = require('../common/database');
const { permit } = require('../common/auth/mw');
const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./assertion.controller');
const paths = require('./assertion.paths');
const apiRouter = require('express').Router();
const badgingRouter = require('express').Router();

const { badgeAssertion, create, image, list, loadAssertion, patch } = ctrl;

apiRouter
  .use(auth)
  .param('id', loadAssertion)
  .get('/', list)
  .post('/', permit(Integration.role), create)
  .patch('/:id', permit(Integration.role), patch);

badgingRouter
  .param('id', loadAssertion)
  .get('/:id.json', badgeAssertion)
  .get(`/:id${paths.image}`, image);

module.exports = {
  apiRouter,
  badgingRouter,
  path: paths.root
};
