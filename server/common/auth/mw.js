'use strict';

const { createError } = require('../errors');
const HttpStatus = require('http-status');

const { UNAUTHORIZED } = HttpStatus;

function permit(...allowed) {
  return ({ user }, res, next) => {
    if (user && allowed.includes(user.role)) return next();
    return createError(UNAUTHORIZED, 'Access restricted');
  };
}

module.exports = {
  permit
};
