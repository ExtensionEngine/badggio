'use strict';

const auth = require('./common/auth').authenticate('jwt');
const express = require('express');

const badge = require('./badges');
const user = require('./user');

const router = express.Router();
// TODO: Remove this demo route!
router.use('/ping', (_, res) => res.jsend.success(null));
router.use(badge.path, badge.router);
router.use(user.path, user.router);

module.exports = router;
