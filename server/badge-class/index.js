'use strict';

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./badge-class.controller');
const paths = require('./badge-class.paths');
const apiRouter = require('express').Router();
const badgingRouter = require('express').Router();

const { badge, create, criteria, decodeImage, encodeImages, image, list, loadBadge, patch } = ctrl;

apiRouter
  .use(auth)
  .get('/', list, encodeImages)
  .post('/', decodeImage, create)
  .patch('/:id', decodeImage, loadBadge, patch);

badgingRouter
  .get('/:id.json', loadBadge, badge)
  .get(`/:id${paths.image}`, loadBadge, image)
  .get(`/:id${paths.criteria}`, loadBadge, criteria);

module.exports = {
  path: paths.root,
  apiRouter,
  badgingRouter
};
