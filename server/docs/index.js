'use strict';

const ctrl = require('./docs.controller');
const router = require('express').Router();

router.get('/api.:type(js|json|yaml)', ctrl.docs);

module.exports = {
  path: '/docs',
  router
};
