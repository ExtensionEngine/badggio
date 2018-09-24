'use strict';

const { setUsername } = require('./user.middleware');

const auth = require('../common/auth').authenticate('jwt');
const ctrl = require('./user.controller');
const router = require('express').Router();

router
  .use(setUsername)
  .post('/login', ctrl.login)
  .use(auth)
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:id', ctrl.patch)
  .post('/forgotPassword', ctrl.forgotPassword)
  .post('/resetPassword', ctrl.resetPassword);

module.exports = {
  path: '/users',
  router
};
