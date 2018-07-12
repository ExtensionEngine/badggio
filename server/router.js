'use strict';

const express = require('express');

const badgeClass = require('./badge-class');
const issuer = require('./issuer');
const recipient = require('./recipient');
const user = require('./user');

const api = express.Router();
const badging = express.Router();
const router = express.Router();

api
  .use(badgeClass.path, badgeClass.apiRouter)
  .use(issuer.path, issuer.apiRouter)
  .use(recipient.path, recipient.apiRouter)
  .use(user.path, user.router);

badging
  .use(issuer.path, issuer.badgingRouter)
  .use(badgeClass.path, badgeClass.badgingRouter);

router.use('/', badging);
router.use('/api/v1', api);

module.exports = router;
