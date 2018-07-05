'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./recipient.controller');

const apiRouter = require('express').Router();

apiRouter
  .use(auth)
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:id', ctrl.patch);

module.exports = {
  apiRouter,
  path: '/recipients'
};
