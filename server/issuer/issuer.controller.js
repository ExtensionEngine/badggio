'use strict';

const facets = require('./issuer.facets');
const HttpStatus = require('http-status');
const omit = require('lodash/omit');
const { Assertion } = require('../common/database');
const { createError } = require('../common/errors');
const { issuer } = require('../config');
const { NOT_FOUND } = HttpStatus;
const { revocationList } = require('../assertion/assertion.facets');

function get(req, res) {
  const omitAttrs = ['imagePath', 'privateKey', 'privateKeyPath', 'publicKeyPath'];
  res.jsend.success(omit(issuer, omitAttrs));
}

function image(req, res) {
  if (!issuer.imagePath) {
    return createError(NOT_FOUND, 'Issuer image does not exist!');
  }
  res.sendFile(issuer.imagePath);
}

function profile(req, res) {
  res.json(facets.profile());
}

function publicKey(req, res) {
  if (!issuer.publicKeyPath) {
    return createError(NOT_FOUND, 'Public key does not exist!');
  }
  res.json(facets.publicKey());
}

function revokedAssertions(req, res) {
  if (!issuer.publicKeyPath) {
    return createError(NOT_FOUND, 'Hosted verification in use, thus no revocation list.');
  }
  return Assertion.scope('revoked').findAll()
    .then(assertions => res.json(revocationList(assertions)));
}

module.exports = {
  get,
  image,
  profile,
  publicKey,
  revokedAssertions
};
