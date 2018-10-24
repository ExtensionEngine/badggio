'use strict';

const express = require('express');

const assertion = require('./assertion');
const badgeClass = require('./badge-class');
const docs = require('./docs');
const issuer = require('./issuer');
const recipient = require('./recipient');
const user = require('./user');

const api = express.Router();
const badging = express.Router();
const router = express.Router();

api
  .use(assertion.path, assertion.apiRouter)
  .use(badgeClass.path, badgeClass.apiRouter)
  .use(issuer.path, issuer.apiRouter)
  .use(recipient.path, recipient.apiRouter)
  .use(user.path, user.router);

badging
  .use(assertion.path, assertion.badgingRouter)
  .use(issuer.path, issuer.badgingRouter)
  .use(badgeClass.path, badgeClass.badgingRouter);

router.use('/', badging);
router.use(docs.path, docs.router);
router.use('/api/v1', api);

module.exports = router;
