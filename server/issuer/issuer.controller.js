'use strict';

const facets = require('./issuer.facets');
const HttpStatus = require('http-status');
const omit = require('lodash/omit');
const { issuer } = require('../config');
const { NO_CONTENT } = HttpStatus;

function get(req, res) {
  const omitAttrs = ['imagePath', 'privateKey', 'privateKeyPath', 'publicKeyPath'];
  res.jsend.success(omit(issuer, omitAttrs));
}

function image(req, res) {
  if (issuer.imagePath) res.sendFile(issuer.imagePath);
  else res.status(NO_CONTENT).send();
}

function profile(req, res) {
  res.send(facets.profile());
}

function publicKey(req, res) {
  if (issuer.publicKeyPath) res.send(facets.publicKey());
  else res.status(NO_CONTENT).send();
}

module.exports = {
  get,
  image,
  profile,
  publicKey
};
