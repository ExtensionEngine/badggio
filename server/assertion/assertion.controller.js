'use strict';

const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');
const { Assertion, Recipient, Sequelize, sequelize } = require('../common/database');
const { assertion: assertionFacet } = require('./assertion.facets');
const { bake } = require('./assertion.helpers');
const { createError } = require('../common/errors');
const { NOT_FOUND, GONE } = HttpStatus;

const { EmptyResultError } = Sequelize;
const inputAttrs = ['badgeClassId', 'narrative', 'expires',
  'revoked', 'revocationReason'];

function loadAssertion(req, { locals }, next, id) {
  return Assertion.findById(id, { include: { all: true }, rejectOnEmpty: true })
    .catch(EmptyResultError, () => createError(NOT_FOUND, 'Assertion does not exist!'))
    .then(assertion => {
      locals.assertion = assertion;
      next();
    }).catch(err => next(err));
}

function badgeAssertion(req, res) {
  const { assertion } = res.locals;

  if (assertion.revoked) res.status(GONE);
  return res.json(assertionFacet(assertion));
}

function create({ body }, res) {
  const email = body.recipientEmail;

  return sequelize.transaction(transaction => {
    return Recipient.findOrCreate({ where: { email }, transaction })
      .spread(({ id }) => ({ ...pick(body, inputAttrs), recipientId: id }))
      .then(attrs => Assertion.create(attrs, { transaction }));
  }).then(assertion => res.jsend.success(assertion.profile));
}

function list(req, res) {
  return Assertion.findAll()
    .then(assertions => res.jsend.success(map(assertions, 'profile')));
}

function patch({ body }, res) {
  const { assertion } = res.locals;

  return assertion.update(pick(body, inputAttrs.slice(1)))
    .then(assertion => res.jsend.success(assertion.profile));
}

function image(req, res) {
  const { assertion } = res.locals;

  return bake(assertion)
    .then(({ image, extension }) => {
      res.set('content-type', `image/${extension}`);
      res.send(Buffer.from(image, 'base64'));
    });
}

module.exports = {
  badgeAssertion,
  create,
  image,
  list,
  loadAssertion,
  patch
};
