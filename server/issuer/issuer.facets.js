'use strict';

const facetBase = require('../common/open-badges');
const pickBy = require('lodash/pickBy');
const { issuer } = require('../config');

function profile() {
  return pickBy(Object.assign({
    id: issuer.issuerUrl,
    type: 'Issuer',
    name: issuer.name,
    url: issuer.url,
    telephone: issuer.telephone,
    description: issuer.description,
    image: issuer.imageUrl,
    email: issuer.email,
    publicKey: issuer.publicKeyUrl,
    verification: verificationObject(),
    // TODO: load from assertion.paths.js once created
    revocationList: 'http://example.org/assertions/revocationList.json'
  }, facetBase));
}

function publicKey() {
  if (!issuer.publicKey) return null;
  return Object.assign({
    id: issuer.publicKeyUrl,
    type: 'CryptographicKey',
    owner: issuer.issuerUrl,
    publicKeyPem: issuer.publicKey
  }, facetBase);
}

function verificationObject() {
  // TODO: add verificationProperty, startsWith and allowedOrigins properties
  if (!issuer.publicKey) {
    return { type: 'HostedBadge' };
  }
  return {
    type: 'SignedBadge',
    creator: issuer.publicKeyUrl
  };
}

module.exports = {
  profile,
  publicKey,
  verificationObject
};
