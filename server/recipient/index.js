'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./recipient.controller');

const apiRouter = require('express').Router();

const { create, list, patch } = ctrl;

apiRouter
  .use(auth)
  .get('/', list)
  .post('/', create)
  .patch('/:id', patch);

module.exports = {
  apiRouter,
  path: '/recipients'
};
