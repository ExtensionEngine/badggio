'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./badge.controller');
const router = require('express').Router();

router
  .use(auth)
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:id', ctrl.patch);

module.exports = {
  path: '/badges',
  router
};
