'use strict';

const HttpStatus = require('http-status');
const { Assertion } = require('../common/database');
const { assertion: assertionFacet } = require('./assertion.facets');
const { createError } = require('../common/errors');
const { NOT_FOUND, GONE } = HttpStatus;

function loadAssertion(req, res, next, id) {
  Assertion.findById(id, { include: { all: true } })
    .then(assertion => assertion || createError(NOT_FOUND, 'Assertion does not exist!'))
    .then(assertion => {
      req.locals = { assertion };
      next();
    }).catch(err => next(err));
}

function badgeAssertion({ locals: { assertion } }, res) {
  if (assertion.revoked) res.status(GONE);
  return res.json(assertionFacet(assertion));
}

module.exports = {
  badgeAssertion,
  loadAssertion
};
