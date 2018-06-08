'use strict';

const express = require('express');
const user = require('./user');

const api = express.Router();
const root = express.Router();
const router = express.Router();

api.use(user.path, user.router);

router.use(root);
router.use('/api/v1', api);

module.exports = router;
