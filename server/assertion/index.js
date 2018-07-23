'use strict';

const ctrl = require('./assertion.controller');
const paths = require('./assertion.paths');

const badgingRouter = require('express').Router();

badgingRouter
  .param('id', ctrl.loadAssertion)
  .get('/:id.json', ctrl.badgeAssertion);

module.exports = {
  badgingRouter,
  path: paths.root
};
