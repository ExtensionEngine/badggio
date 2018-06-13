'use strict';

const express = require('express');
const user = require('./user');

const api = express.Router();
const badging = express.Router();
const router = express.Router();

api.use(user.path, user.router);

router.use('/', badging);
router.use('/api/v1', api);

module.exports = router;
