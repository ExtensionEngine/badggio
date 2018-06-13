'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./badge-class.controller');
const router = require('express').Router();

const { create, addImageHash, list, patch } = ctrl;

router
  .use(auth)
  .get('/', list)
  .post('/', addImageHash, create)
  .patch('/:id', addImageHash, patch);

module.exports = {
  path: '/badges',
  router
};
