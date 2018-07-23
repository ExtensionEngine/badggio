'use strict';

const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');
const { Assertion, Recipient } = require('../common/database');
const { assertion: assertionFacet } = require('./assertion.facets');
const { createError } = require('../common/errors');
const { NOT_FOUND, GONE } = HttpStatus;

const inputAttrs = ['badgeClassId', 'narrative', 'expires',
  'revoked', 'revocationReason'];

function loadAssertion(req, res, next, id) {
  return Assertion.findById(id, { include: { all: true } })
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

function create({ body }, res) {
  const email = body.recipientEmail;
  return Recipient.findOrCreate({ where: { email } })
    .spread(({ id }) => {
      const attrs = { ...pick(body, inputAttrs), recipientId: id };
      return Assertion.create(attrs);
    })
    .then(assertion => res.jsend.success(assertion.profile));
}

function list(req, res) {
  return Assertion.findAll()
    .then(assertions => res.jsend.success(map(assertions, 'profile')));
}

function patch({ body, locals: { assertion } }, res) {
  return assertion.update(pick(body, inputAttrs.slice(1)))
    .then(assertion => res.jsend.success(assertion.profile));
}

module.exports = {
  loadAssertion,
  badgeAssertion,
  create,
  list,
  patch
};
