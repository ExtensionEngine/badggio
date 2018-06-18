'use strict';

const express = require('express');
const user = require('./user');
const issuer = require('./issuer');

const api = express.Router();
const badging = express.Router();
const router = express.Router();

api
  .use(user.path, user.router)
  .use(issuer.path, issuer.api);

badging
  .use(issuer.path, issuer.badging);

router.use('/', badging);
router.use('/api/v1', api);

module.exports = router;
