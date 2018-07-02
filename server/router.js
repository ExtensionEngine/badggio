'use strict';

const express = require('express');

const badgeClass = require('./badge-class');
const user = require('./user');
const issuer = require('./issuer');

const api = express.Router();
const badging = express.Router();
const router = express.Router();

api
  .use(badgeClass.path, badgeClass.router)
  .use(user.path, user.router)
  .use(issuer.path, issuer.apiRouter);

badging
  .use(issuer.path, issuer.badgingRouter);

router.use('/', badging);
router.use('/api/v1', api);

module.exports = router;
