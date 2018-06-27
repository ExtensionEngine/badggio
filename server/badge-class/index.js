'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./badge-class.controller');
const validate = require('./badge-class.validator');
const router = require('express').Router();

const { create, encodeImage, decodeImage, list, patch } = ctrl;

router
  .use(auth)
  .get('/', list, encodeImage)
  .use(validate)
  .post('/', decodeImage, create)
  .patch('/:id', decodeImage, patch);

module.exports = {
  path: '/badges',
  router
};
