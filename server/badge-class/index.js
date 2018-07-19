'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./badge-class.controller');
const paths = require('./badge-class.paths');
const apiRouter = require('express').Router();
const badgingRouter = require('express').Router();

const { create, encodeImages, decodeImage, list, patch } = ctrl;

apiRouter
  .use(auth)
  .get('/', list, encodeImages)
  .post('/', decodeImage, create)
  .patch('/:id', decodeImage, patch);

badgingRouter
  .get('/:id.json', ctrl.badge)
  .get('/:id/image', ctrl.image);

module.exports = {
  path: paths.root,
  apiRouter,
  badgingRouter
};
