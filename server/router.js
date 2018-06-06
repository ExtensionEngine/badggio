'use strict';

const auth = require('./common/auth').authenticate('jwt');
const express = require('express');
const user = require('./user');

const api = express.Router();
const root = express.Router();
// TODO: Remove this demo route!
api.use('/ping', (_, res) => res.jsend.success(null));
api.use(user.path, user.router);

module.exports = { api, root };
