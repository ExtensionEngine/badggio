'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./badge-class.controller');
const paths = require('./badge-class.paths');
const router = require('express').Router();

const { create, encodeImages, decodeImage, list, patch } = ctrl;

router
  .use(auth)
  .get('/', list, encodeImages)
  .post('/', decodeImage, create)
  .patch('/:id', decodeImage, patch);

module.exports = {
  path: paths.root,
  router
};
