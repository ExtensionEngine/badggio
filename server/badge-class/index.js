'use strict';

const { Router } = require('express');
const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./badge-class.controller');
const paths = require('./badge-class.paths');

const { badge, create, criteria, decodeImage, encodeImages, image, list, loadBadge, patch } = ctrl;

const apiRouter = Router()
  .use(auth)
  .param('id', loadBadge)
  .get('/', list, encodeImages)
  .post('/', decodeImage, create)
  .patch('/:id', decodeImage, patch);

const badgingRouter = Router()
  .param('id', loadBadge)
  .get('/:id.json', badge)
  .get(`/:id${paths.image}`, image)
  .get(`/:id${paths.criteria}`, criteria);

module.exports = {
  apiRouter,
  badgingRouter,
  path: paths.root
};
