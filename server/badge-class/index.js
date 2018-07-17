'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./badge-class.controller');
const paths = require('./badge-class.paths');
const apiRouter = require('express').Router();
const badgingRouter = require('express').Router();

const { badge, create, criteria, decodeImage, encodeImages, image, list, patch } = ctrl;

apiRouter
  .use(auth)
  .get('/', list, encodeImages)
  .post('/', decodeImage, create)
  .patch('/:id', decodeImage, patch);

badgingRouter
  .get('/:id.json', badge)
  .get(`/:id${paths.image}.json`, image)
  .get(`/:id${paths.criteria}.json`, criteria);

module.exports = {
  path: paths.root,
  apiRouter,
  badgingRouter
};
