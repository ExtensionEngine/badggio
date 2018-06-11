'use strict';

const auth = require('./common/auth').authenticate('jwt');
const express = require('express');

const badgeClass = require('./badge-class');
const user = require('./user');

const router = express.Router();
// TODO: Remove this demo route!
router.use('/ping', (_, res) => res.jsend.success(null));
router.use(badgeClass.path, badgeClass.router);
router.use(user.path, user.router);

module.exports = router;
