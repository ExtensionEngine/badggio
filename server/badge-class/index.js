'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./badge-class.controller');
const paths = require('./badge-class.paths');
const apiRouter = require('express').Router();
const badgingRouter = require('express').Router();

const { badge, create, criteria, decodeImage, encodeImages, get, image, list, loadBadge, patch } = ctrl;

apiRouter
  .use(auth)
  .get('/', list, encodeImages)
  .post('/', decodeImage, create)
  .param('id', loadBadge)
  .get('/:id', get)
  .patch('/:id', decodeImage, patch);

badgingRouter
  .param('id', loadBadge)
  .get('/:id.json', badge)
  .get(`/:id${paths.image}`, image)
  .get(`/:id${paths.criteria}`, criteria);

module.exports = {
  path: paths.root,
  apiRouter,
  badgingRouter
};
